// YouTube動画表示とマンガブログ表示のための簡易スクリプト
document.addEventListener('DOMContentLoaded', function() {
    // YouTube動画の表示
    displaySimpleYouTubeVideos();
});

// YouTube動画を表示する関数（APIを使わない簡易版）
function displaySimpleYouTubeVideos() {
    const youtubeContainer = document.querySelector('.youtube-container');
    if (!youtubeContainer) return;
    
    // 表示する動画（指定のURLを使用）
    const videos = [
        {
            url: 'https://www.youtube.com/embed/gfKDzxeEcEM',
            title: '部活動あるある',
            description: '各種部活動にありがちなことが一気にわかる'
        },
        {
            url: 'https://www.youtube.com/embed/AXITHLfhaO8',
            title: '妊婦さんあるある',
            description: '妊娠・出産する前に役立つ漫画動画'
        },
        {
            url: 'https://www.youtube.com/embed/hcthPFLLF0U',
            title: '47都道府県あるある',
            description: '漫画動画であるある250連まとめ'
        }
    ];
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'youtube-card';
        
        card.innerHTML = `
            <div class="youtube-embed">
                <iframe 
                    src="${video.url}" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                ></iframe>
            </div>
            <div class="youtube-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        
        youtubeContainer.appendChild(card);
    });
}

// YouTube動画URLからサムネイル画像を取得する関数（参考用）
// YouTube APIを使わずにサムネイルを取得するには、以下のパターンが使えます
function getYouTubeThumbnail(youtubeUrl) {
    // YouTube動画IDを抽出する
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = youtubeUrl.match(regExp);
    
    if (match && match[2].length === 11) {
        videoId = match[2];
    }
    
    // サムネイルURLを生成
    if (videoId) {
        // 高解像度サムネイル
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
        
        // その他のサイズ
        // 最高解像度: https://img.youtube.com/vi/${videoId}/maxresdefault.jpg
        // 標準解像度: https://img.youtube.com/vi/${videoId}/mqdefault.jpg
        // 低解像度: https://img.youtube.com/vi/${videoId}/default.jpg
    }
    
    return '';
}
