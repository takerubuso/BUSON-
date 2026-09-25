/* buson2025.com の Web 版だけで使う「続きから遊べる」保存。
   ゲーム本体は YouTube Playables 用で、YouTube の外では SDK のスタブがメモリにしか保存しない。
   ここでスタブの初期データをこの端末のブラウザから渡し、saveData のたびにブラウザへ書き残す。
   YouTube の中（本物の SDK）では何もしない。提出用 ZIP には入れない。
   読み込み位置: 各ゲームの index.html の SDK の <script> の直後（ゲームのコードより前）。 */
(function () {
  var KEY = 'buson-games:' + location.pathname.replace(/index\.html$/, '');
  var store = null;
  try { store = window.localStorage; store.getItem(KEY); } catch (e) { store = null; }
  if (!store) return;

  var saved = '';
  try { saved = store.getItem(KEY) || ''; } catch (e) { saved = ''; }
  var init = window.__ytStubInit || {};
  if (typeof init.data !== 'string') init.data = saved;
  window.__ytStubInit = init;

  document.addEventListener('DOMContentLoaded', function () {
    try {
      if (typeof Platform === 'undefined' || Platform.env !== 'stub') return;
      var game = Platform.sdk.game, original = game.saveData.bind(game);
      game.saveData = function (s) {
        var p = original(s);
        return Promise.resolve(p).then(function (v) {
          try { store.setItem(KEY, s); } catch (e) { /* 容量不足などは黙って諦める（遊びは止めない） */ }
          return v;
        });
      };
    } catch (e) { /* 保存できなくても遊べるようにする */ }
  });
})();
