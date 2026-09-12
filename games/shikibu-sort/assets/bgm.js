'use strict';
/* BGM エンジン（v6）— tools/build_bgm.py が作った MP3（assets/bgm_data.js に base64 で埋め込み）を Web Audio で鳴らす。
   title・main はループ（BufferSource の loop。loopStart/loopEnd はビルドが拍と相関で決めた継ぎ目。継ぎ目の 30ms の等パワーのつなぎは
   ファイルに焼き込み済みで、飛ぶ所の前後は同じ音）。jingle は全クリアで 1 回。
   経路: 曲ごとの gain → duck（ジングルの間だけ本編を -6dB）→ out（BGM の ON/OFF）→ 出力。効果音のローパスとコンプレッサーは通さない
   （3〜5kHz の下げと 9kHz ローパスはビルドで効果音と同じ式で焼き込んである）。
   音量の変化はすべて AudioParam の予定（ctx の時計）で書くので、一時停止・YouTube のミュートで AudioContext が止まると
   ループの位置・クロスフェード・ジングルの後の戻しも一緒に止まり、再開でそこから続く。
   ゲーム（index.html の Sound）と自動テスト・オフライン描画（OfflineAudioContext）が同じものを使う。外部通信はしない。 */
function createBgmEngine() {
  const B = {
    ctx: null, out: null, duck: null, buffers: {}, info: {}, decoded: 0, failed: 0,
    cur: null, want: null, on: false, starts: 0, log: [], jingleAt: -1, jingleEnd: -1,
    XFADE: 0.4, DUCK_DB: -6, DUCK_IN: 0.15, DUCK_OUT: 0.6, MUTE_FADE: 0.15, STEPS: 8,
  };
  function b64ToBuf(s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  const r3 = v => Math.round(v * 1000) / 1000;
  // from → to を時刻 t から dur 秒で。上げは sin・下げは cos の点を折れ線で結ぶ（等パワーの近似。setValueCurveAtTime は予定が重なると例外になるので使わない）
  function ramp(param, from, to, t, dur) {
    if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(t); else param.cancelScheduledValues(t);
    param.setValueAtTime(from, t);
    if (!(dur > 0)) { param.setValueAtTime(to, t); return; }
    for (let k = 1; k <= B.STEPS; k++) {
      const u = k / B.STEPS;
      param.linearRampToValueAtTime(to > from ? from + (to - from) * Math.sin(u * Math.PI / 2) : to + (from - to) * Math.cos(u * Math.PI / 2), t + dur * u);
    }
  }
  B.init = function (ctx, dest) {
    B.ctx = ctx;
    B.duck = ctx.createGain(); B.duck.gain.value = 1;
    B.out = ctx.createGain(); B.out.gain.value = B.on ? 1 : 0;
    B.duck.connect(B.out); B.out.connect(dest || ctx.destination);
    return B;
  };
  // data = BGM_DATA（{ tracks: { title: { b64, loopStart, loopEnd, sec }, main: {...}, jingle: { b64, sec } } }）。
  // 復号が済んだとき、鳴らしたい曲（want）がまだ鳴っていなければ鳴らす（タイトルは頭から・本編は途中から入るのでフェードイン）
  B.load = function (data) {
    if (!B.ctx || !data || !data.tracks) return Promise.resolve(B);
    const jobs = Object.keys(data.tracks).map(name => new Promise(res => {
      const t = data.tracks[name];
      let done = false;
      const ok = buf => { if (done) return; done = true; B.buffers[name] = buf; B.info[name] = { loopStart: t.loopStart, loopEnd: t.loopEnd, sec: t.sec || buf.duration }; B.decoded++; res(); };
      const ng = () => { if (done) return; done = true; B.failed++; res(); };
      try {
        const p = B.ctx.decodeAudioData(b64ToBuf(t.b64), ok, ng);   // Safari の古い形（コールバック）と Promise の両対応
        if (p && p.then) p.then(ok, ng);
      } catch (e) { ng(); }
    }));
    return Promise.all(jobs).then(() => { if (B.want && !B.cur) B.play(B.want, { fade: B.want === 'title' ? 0 : B.XFADE }); return B; });
  };
  B.has = function (name) { return !!B.buffers[name]; };
  // 曲を替える（同じ曲なら何もしない）。o: { when: 開始時刻, fade: クロスフェード秒（既定 XFADE。最初の 1 曲は 0）, offset: 曲の中の開始位置（秒） }
  B.play = function (name, o) {
    o = o || {}; B.want = name;
    const ctx = B.ctx, buf = B.buffers[name];
    if (!ctx || !buf) return null;
    if (B.cur && B.cur.name === name) return B.cur;
    const t = o.when != null ? o.when : ctx.currentTime;
    const fade = o.fade != null ? o.fade : (B.cur ? B.XFADE : 0);
    const inf = B.info[name];
    const src = ctx.createBufferSource(); src.buffer = buf;
    if (inf.loopEnd) { src.loop = true; src.loopStart = inf.loopStart; src.loopEnd = inf.loopEnd; }
    const g = ctx.createGain(); g.gain.value = fade > 0 ? 0 : 1;
    src.connect(g); g.connect(B.duck);
    if (fade > 0) ramp(g.gain, 0, 1, t, fade);
    src.start(t, o.offset || 0);
    const old = B.cur;
    if (old) { ramp(old.gain.gain, old.gain.gain.value, 0, t, fade); try { old.src.stop(t + fade + 0.05); } catch (e) { /* 止め済み */ } }
    B.cur = { name, src, gain: g, t0: t };
    B.starts++;
    B.log.push({ name, from: old ? old.name : null, t: r3(t), fade });
    return B.cur;
  };
  // 全クリアのジングル: 本編（duck）を DUCK_IN 秒で -6dB に下げて重ね、終わったら DUCK_OUT 秒で戻す。ジングルは duck を通らない（BGM の ON/OFF には従う）
  B.jingle = function (o) {
    o = o || {};
    const ctx = B.ctx, buf = B.buffers.jingle;
    if (!ctx || !buf) return null;
    const t = o.when != null ? o.when : ctx.currentTime, sec = B.info.jingle.sec;
    const src = ctx.createBufferSource(); src.buffer = buf; src.connect(B.out); src.start(t);
    const d = B.duck.gain, low = Math.pow(10, B.DUCK_DB / 20);
    ramp(d, d.value, low, t, B.DUCK_IN);
    d.setValueAtTime(low, t + sec);
    d.linearRampToValueAtTime(1, t + sec + B.DUCK_OUT);
    B.jingleAt = t; B.jingleEnd = t + sec;
    B.log.push({ name: 'jingle', t: r3(t), sec: r3(sec) });
    return { when: t, sec };
  };
  // BGM の ON/OFF（ゲームの設定）。鳴らし続けたまま out を絞るので、ON に戻すと続きから聞こえる。instant = 起動時の反映（フェードなし）
  B.setOn = function (on, instant) {
    B.on = !!on;
    if (!B.out) return B.on;
    const p = B.out.gain, t = B.ctx.currentTime, v = B.on ? 1 : 0;
    if (instant) { p.cancelScheduledValues(0); p.setValueAtTime(v, t); p.value = v; } else ramp(p, p.value, v, t, B.MUTE_FADE);
    return B.on;
  };
  B.state = function () {
    return { want: B.want, cur: B.cur ? B.cur.name : null, on: B.on, decoded: B.decoded, failed: B.failed, starts: B.starts,
      duck: B.duck ? r3(B.duck.gain.value) : null, out: B.out ? r3(B.out.gain.value) : null, time: B.ctx ? r3(B.ctx.currentTime) : 0,
      jingleAt: r3(B.jingleAt), jingleEnd: r3(B.jingleEnd), log: B.log.slice(-12), info: JSON.parse(JSON.stringify(B.info)) };
  };
  return B;
}
var BGM = createBgmEngine();
BGM.create = createBgmEngine;
