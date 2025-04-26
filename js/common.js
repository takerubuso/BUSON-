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
                // モバイルメニューの設定などヘッダー関連のJavaScriptを実行
                setupMobileMenu();
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
            })
            .catch(error => console.error('フッターの読み込みに失敗しました:', error));
    }
    
    // モバイルメニューの設定
    function setupMobileMenu() {
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const navMenu = document.querySelector('nav ul');
        
        if (mobileMenuButton && navMenu) {
            mobileMenuButton.addEventListener('click', function() {
                this.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                const isExpanded = navMenu.classList.contains('active');
                mobileMenuButton.setAttribute('aria-expanded', isExpanded);
                navMenu.setAttribute('aria-hidden', !isExpanded);
            });
        }
    }
});
