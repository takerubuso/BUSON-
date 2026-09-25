'use strict';
/* 効果音エンジン（v5）— 「素材＋加工」方式。
   素材は tools/build_sfx.py が作った MP3（assets/sfx_data.js に base64 で埋め込み。A=木・紙寄り／B=ガラス・水寄り）。
   再生時にかけるもの: 毎回 ±3% 程度の音程揺れ（±50 セント）・左右のパン（StereoPanner。無い環境ではモノ）・
   短い残響（Convolver。減衰する雑音から自作した 0.32 秒の IR）・全体のローパス（9kHz）と軽いコンプレッサー。
   ゲーム（index.html の Sound）と聞き比べページ（docs/sfx_compare.html）と自動テスト（OfflineAudioContext）が同じものを使う。
   外部通信はしない（fetch/XHR を使わず <script> で読んだ base64 を decodeAudioData に渡す）。 */
function createSfxEngine() {
  const E = {
    ctx: null, out: null, dry: null, wetIn: null, lowpass: null,
    buffers: {}, heads: {}, bank: 'A', decoded: 0, failed: 0, voices: 0, last: null,
    LOWPASS_HZ: 9000, REVERB_SEC: 0.32, WET: 0.22, JITTER_CENTS: 50,
    ROLES: ['pick', 'back', 'tap', 'place', 'bad', 'undo', 'done', 'start', 'clear', 'combo'],
    // v5e: 置くのコンボ（失敗なしで続けて置けた回数。数えるのはゲーム側）。n 回目の置く音は全体を +min(n-1, 5) 半音、
    // 3 回目からコンボの音（P4 コルク）を -8dB で置く音の頭にそろえて重ねる。5 回目からゲームが小さな光の粒を出す
    COMBO: { LAYER_AT: 3, LAYER_DB: -8, PITCH_MAX: 5, SPARK_AT: 5 },
  };
  function b64ToBuf(s) { const bin = atob(s); const u = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i); return u.buffer; }
  // 短い残響のインパルス応答: 減衰する雑音を 1 次ローパスで丸めたもの（左右で別の雑音）
  function makeIR(ctx) {
    const sr = ctx.sampleRate, n = Math.max(1, Math.floor(sr * E.REVERB_SEC)), ir = ctx.createBuffer(2, n, sr);
    for (let ch = 0; ch < 2; ch++) {
      const d = ir.getChannelData(ch); let lp = 0, seed = 12345 + ch * 777;
      for (let i = 0; i < n; i++) {
        seed = (seed * 1664525 + 1013904223) >>> 0;
        const w = seed / 4294967296 * 2 - 1; lp += (w - lp) * 0.25;
        const t = i / n; d[i] = lp * Math.pow(1 - t, 2.2) * Math.exp(-3 * t);
      }
    }
    return ir;
  }
  // 復号した音の立ち上がり位置（MP3 のエンコーダ遅延ぶんの無音を飛ばす）
  function headOf(buf) {
    const d = buf.getChannelData(0); let peak = 0;
    for (let i = 0; i < d.length; i++) { const a = Math.abs(d[i]); if (a > peak) peak = a; }
    const thr = peak * 0.02;
    for (let i = 0; i < d.length; i++) if (Math.abs(d[i]) > thr) return Math.max(0, (i - buf.sampleRate * 0.002) / buf.sampleRate);
    return 0;
  }
  E.init = function (ctx) {
    E.ctx = ctx;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = E.LOWPASS_HZ; lp.Q.value = 0.5;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -12; comp.knee.value = 12; comp.ratio.value = 3; comp.attack.value = 0.003; comp.release.value = 0.12;
    const master = ctx.createGain(); master.gain.value = 1;
    E.dry = ctx.createGain(); E.dry.gain.value = 1;
    E.wetIn = ctx.createGain(); E.wetIn.gain.value = E.WET;
    const conv = ctx.createConvolver(); conv.buffer = makeIR(ctx);
    E.dry.connect(master); E.wetIn.connect(conv); conv.connect(master);
    master.connect(lp); lp.connect(comp); comp.connect(ctx.destination);
    E.out = master; E.lowpass = lp;
    return E;
  };
  // data = SFX_DATA（{ sets: { A: { role: base64 }, B: {...} } }）。banks を省くと全部の案を復号する
  E.load = function (data, banks) {
    if (!E.ctx || !data || !data.sets) return Promise.resolve(E);
    const jobs = [];
    for (const bank of (banks || Object.keys(data.sets))) {
      const set = data.sets[bank]; if (!set) continue;
      for (const role in set) {
        const key = bank + '/' + role;
        jobs.push(new Promise(res => {
          let done = false;
          const ok = buf => { if (done) return; done = true; E.buffers[key] = buf; E.heads[key] = headOf(buf); E.decoded++; res(); };
          const ng = () => { if (done) return; done = true; E.failed++; res(); };
          try {
            const p = E.ctx.decodeAudioData(b64ToBuf(set[role]), ok, ng);   // Safari の古い形（コールバック）と Promise の両対応
            if (p && p.then) p.then(ok, ng);
          } catch (e) { ng(); }
        }));
      }
    }
    return Promise.all(jobs).then(() => E);
  };
  E.setBank = function (b) { if (b === 'A' || b === 'B') E.bank = b; return E.bank; };
  E.has = function (role) { return !!E.buffers[E.bank + '/' + role]; };
  // o: { pan: -1..1, cents: 音程（セント）, gain, when: 開始時刻（ctx の時計）, jitter: false で揺れなし }
  E.play = function (role, o) {
    const ctx = E.ctx, key = E.bank + '/' + role, buf = E.buffers[key];
    if (!ctx || !buf) return null;
    o = o || {};
    const jitter = o.jitter === false ? 0 : (Math.random() * 2 - 1) * E.JITTER_CENTS;
    const cents = (o.cents || 0) + jitter;
    const src = ctx.createBufferSource(); src.buffer = buf; src.playbackRate.value = Math.pow(2, cents / 1200);
    const g = ctx.createGain(); g.gain.value = o.gain == null ? 1 : o.gain;
    let node = g; src.connect(g);
    let pan = Math.max(-1, Math.min(1, o.pan || 0));
    if (typeof ctx.createStereoPanner === 'function') { const p = ctx.createStereoPanner(); p.pan.value = pan; node.connect(p); node = p; } else pan = 0;
    node.connect(E.dry); node.connect(E.wetIn);
    const when = o.when != null ? o.when : ctx.currentTime;
    src.start(when, E.heads[key] || 0);
    E.voices++;
    E.last = { role, bank: E.bank, cents: Math.round(cents), pan: Math.round(pan * 100) / 100, gain: g.gain.value, when };
    return E.last;
  };
  E.comboSemis = function (n) { return Math.max(0, Math.min(E.COMBO.PITCH_MAX, (n || 0) - 1)); };
  E.comboLayer = function (n) { return (n || 0) >= E.COMBO.LAYER_AT; };
  // 置く（v5e）: combo = この置きを含めたコンボの回数。o は play と同じ。揺れは置く音と重ねる音で同じ値（音程がずれないように）
  E.playPlace = function (combo, o) {
    o = o || {};
    const jitter = o.jitter === false ? 0 : (Math.random() * 2 - 1) * E.JITTER_CENTS;
    const cents = (o.cents || 0) + E.comboSemis(combo) * 100 + jitter;
    const when = o.when != null ? o.when : (E.ctx ? E.ctx.currentTime : 0);
    const gain = o.gain == null ? 1 : o.gain;
    const v = E.play('place', { pan: o.pan, cents, gain, jitter: false, when });
    if (!v) return null;
    let layer = null;
    if (E.comboLayer(combo) && E.has('combo')) {
      const w = E.play('combo', { pan: o.pan, cents, gain: gain * Math.pow(10, E.COMBO.LAYER_DB / 20), jitter: false, when });
      if (w) layer = { cents: w.cents, gain: w.gain, when: w.when, pan: w.pan };
    }
    E.last = Object.assign(v, { combo: combo || 0, semis: E.comboSemis(combo), layer });
    return E.last;
  };
  // 全クリア: クリアの音に、揃うのチャイムを左・右・中央の順に上がる音程で 3 回重ねる（v5b。v6 でゲームの Sound からここへ移し、オフライン描画でも同じものを使う）
  E.ALLCLEAR_CHIMES = [[0.45, -0.5, 300], [0.7, 0.5, 500], [0.95, 0, 700]];   // [遅れ（秒）, パン, セント]
  E.playAllClear = function (when) {
    const t0 = when != null ? when : (E.ctx ? E.ctx.currentTime : 0);
    const v = E.play('clear', { jitter: false, when: t0 });
    if (!v) return null;
    E.ALLCLEAR_CHIMES.forEach(([dt, pan, cents]) => E.play('done', { jitter: false, pan, cents, when: t0 + dt }));
    E.last = v;
    return v;
  };
  // 聞き比べとオフライン描画で使う擬似シーケンス: 取る→置く→揃う×3→クリア（列は左→右へ。揃うは +1 半音ずつ上がる）
  E.DEMO_SEQ = [
    { t: 0.00, role: 'pick', pan: -0.6 }, { t: 0.32, role: 'place', pan: 0.6, cents: 60 },
    { t: 0.95, role: 'pick', pan: -0.3 }, { t: 1.27, role: 'place', pan: -0.6, cents: -60 }, { t: 1.40, role: 'done', pan: -0.6, cents: 0 },
    { t: 2.10, role: 'pick', pan: 0.6 }, { t: 2.42, role: 'place', pan: 0.0, cents: 0 }, { t: 2.55, role: 'done', pan: 0.0, cents: 100 },
    { t: 3.25, role: 'pick', pan: -0.6 }, { t: 3.57, role: 'place', pan: 0.6, cents: 60 }, { t: 3.70, role: 'done', pan: 0.6, cents: 200 },
    { t: 4.45, role: 'clear', jitter: false },
  ];
  E.DEMO_FAIL_SEQ = [{ t: 0.0, role: 'pick', pan: -0.3 }, { t: 0.35, role: 'bad', pan: 0.3, gain: 0.8 }, { t: 0.9, role: 'back', pan: -0.3 }, { t: 1.4, role: 'undo' }];
  // v5e: 置くのコンボの擬似シーケンス（4 列の面）: (取る→置く)×6 の連続コンボ → 取る→失敗（コンボ 0 に）→ 持ったまま置く → その置きで揃う → クリア。
  // combo はゲームの数え方（置けたら +1・失敗と揃った直後に 0）で書いた値。パンと列ごとの音程はゲームの 4 列の値に近いもの
  (function () {
    const P = [-0.52, -0.17, 0.17, 0.52], C = [-45, -15, 15, 45], moves = [[0, 1], [1, 2], [2, 3], [3, 0], [0, 2], [2, 1]];
    const s = [];
    moves.forEach(([f, t], i) => { s.push({ t: i * 0.6, role: 'pick', pan: P[f] }, { t: i * 0.6 + 0.3, role: 'place', pan: P[t], cents: C[t], combo: i + 1 }); });
    s.push({ t: 3.6, role: 'pick', pan: P[3] }, { t: 3.9, role: 'bad', pan: P[0], gain: 0.8 });
    s.push({ t: 4.4, role: 'place', pan: P[1], cents: C[1], combo: 1 }, { t: 4.53, role: 'done', pan: P[1], cents: 0 });
    s.push({ t: 5.3, role: 'clear', jitter: false });
    E.DEMO_COMBO_SEQ = s;
  })();
  E.playSeq = function (seq, t0) {
    const base = (t0 != null ? t0 : E.ctx.currentTime) + 0.02;
    return seq.map(s => s.role === 'place' && s.combo != null
      ? E.playPlace(s.combo, { pan: s.pan, cents: s.cents, gain: s.gain, jitter: s.jitter, when: base + s.t })
      : E.play(s.role, { pan: s.pan, cents: s.cents, gain: s.gain, jitter: s.jitter, when: base + s.t }));
  };
  return E;
}
var SFX = createSfxEngine();
SFX.create = createSfxEngine;
