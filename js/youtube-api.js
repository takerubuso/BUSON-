// 漫画ブログセクションを画像表示に変更
async function displayMangaBlogPosts() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // ヘッダー画像を表示
    const mangaHeader = document.createElement('div');
    mangaHeader.className = 'manga-header';
    
    mangaHeader.innerHTML = `
        <a href="https://buson.blog.jp" target="_blank" class="manga-header-link">
            <img src="images/mangablog/header.PNG" alt="漫画ブログ" class="manga-header-image">
        </a>
    `;
    
    mangaContainer.appendChild(mangaHeader);
}
