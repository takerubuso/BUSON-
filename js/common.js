document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーの読み込み
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        // 現在のページのパスをチェックしてルートからの相対パスを決定
        const pathPrefix = location.pathname.includes('/kiji/') ? '../' : '';

        fetch(pathPrefix + 'includes/header.html')
            .then(response => response.text())
            .then(data => {
                // ロゴのパスを修正
                if (pathPrefix) {
                    data = data.replace('src="images/', 'src="../images/');
                    data = data.replace('href="index.html', 'href="../index.html');
                }

                headerPlaceholder.innerHTML = data;
                // ヘッダー注入後に script.js 側の完全版 setupMobileMenu を呼び出す
                // （以前は common.js 内に簡略版が定義されておりリンククリック時の閉じ処理が無かった）
                if (typeof window.setupMobileMenu === 'function') {
                    window.setupMobileMenu();
                }
            })
            .catch(error => console.error('ヘッダーの読み込みに失敗しました:', error));
    }

    // フッターの読み込み
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        // 現在のページのパスをチェックしてルートからの相対パスを決定
        const pathPrefix = location.pathname.includes('/kiji/') ? '../' : '';

        fetch(pathPrefix + 'includes/footer.html')
            .then(response => response.text())
            .then(data => {
                // フッターのリンクパスを修正
                if (pathPrefix) {
                    data = data.replace(/href="([^"#]+\.html)/g, 'href="../$1');
                }

                footerPlaceholder.innerHTML = data;
                setupBackToTop();
            })
            .catch(error => console.error('フッターの読み込みに失敗しました:', error));
    }

    // ページトップへ戻るボタン
    function setupBackToTop() {
        const button = document.querySelector('.back-to-top');
        if (!button) return;

        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                button.classList.add('show');
            } else {
                button.classList.remove('show');
            }
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        button.addEventListener('click', () => {
            const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
        });
        toggleVisibility();
    }
});
