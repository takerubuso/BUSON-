document.addEventListener('DOMContentLoaded', function() {
    // ヘッダーの読み込み
    const headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('includes/header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
                // モバイルメニューの設定などヘッダー関連のJavaScriptを実行
                setupMobileMenu();
            });
    }
    
    // フッターの読み込み
    const footerPlaceholder = document.getElementById('footer-placeholder');
    if (footerPlaceholder) {
        fetch('includes/footer.html')
            .then(response => response.text())
            .then(data => {
                footerPlaceholder.innerHTML = data;
            });
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
