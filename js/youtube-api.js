// YouTube APIとの連携
document.addEventListener('DOMContentLoaded', function() {
    // YouTube動画とマンガブログの表示を初期化
    displayYouTubeVideos();
    displayMangaBlogPosts();
});

// YouTube動画をUIに表示する関数
async function displayYouTubeVideos() {
    const youtubeContainer = document.querySelector('.youtube-container');
    if (!youtubeContainer) return;
    
    // ローディング表示
    youtubeContainer.innerHTML = '<div class="loading">動画を読み込み中...</div>';
    
    try {
        // 現段階では、APIから実際に取得する代わりにデモデータを使用
        const videos = [
            {
                id: 'VIDEO_ID_1',
                title: '最新動画',
                description: 'チャンネルの最新アップロード動画です。自動的に更新されます。',
                type: '最新'
            },
            {
                id: 'VIDEO_ID_2',
                title: '人気動画',
                description: '最も再生数の多い動画です。自動的に更新されます。',
                type: '人気'
            },
            {
                id: 'VIDEO_ID_3',
                title: 'おすすめ動画',
                description: '管理者が選んだおすすめ動画です。',
                type: 'ピックアップ'
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
                        src="https://www.youtube.com/embed/${video.id}" 
                        title="${video.title}" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                    ></iframe>
                </div>
                <div class="youtube-info">
                    <h3>${video.title}</h3>
                    <p>${video.description}</p>
                    <span class="video-type">${video.type}</span>
                </div>
            `;
            
            youtubeContainer.appendChild(card);
        });
    } catch (error) {
        console.error('YouTube動画の表示に失敗しました:', error);
        youtubeContainer.innerHTML = '<div class="error">動画の読み込みに失敗しました。後でもう一度お試しください。</div>';
    }
}

// 漫画ブログ記事をUIに表示する関数
async function displayMangaBlogPosts() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // ローディング表示
    mangaContainer.innerHTML = '<div class="loading">漫画ブログを読み込み中...</div>';
    
    try {
        // 現段階では、APIから実際に取得する代わりにデモデータを使用
        const posts = [
            {
                title: '夫にやめて欲しいあるある',
                date: '2025-04-15',
                image: 'images/manga/manga1.jpg', // デモ用画像パス
                summary: '日常の夫婦生活でよくある出来事を描いた4コマ漫画です。',
                url: 'https://buson.blog.jp/post1'
            },
            {
                title: '幼児の口癖あるある',
                date: '2025-04-04',
                image: 'images/manga/manga2.jpg', // デモ用画像パス
                summary: '子育て中の親御さんが共感できる、幼児の言動を描いた漫画です。',
                url: 'https://buson.blog.jp/post2'
            },
            {
                title: 'モテない人あるある',
                date: '2025-04-03',
                image: 'images/manga/manga3.jpg', // デモ用画像パス
                summary: '恋愛コメディ漫画の一場面です。全800話を超える人気作品の1ページです。',
                url: 'https://buson.blog.jp/post3'
            }
        ];
        
        // コンテナをクリア
        mangaContainer.innerHTML = '';
        
        // 記事カードを生成
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'manga-card';
            
            // 日付をフォーマット
            const formattedDate = post.date.replace(/-/g, '.');
            
            card.innerHTML = `
                <div class="manga-img">
                    <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='images/manga/manga_default.jpg';">
                </div>
                <div class="manga-info">
                    <p class="date">${formattedDate}</p>
                    <h3>${post.title}</h3>
                    <p>${post.summary}</p>
                    <a href="${post.url}" class="read-more" target="_blank">もっと見る</a>
                </div>
            `;
            
            mangaContainer.appendChild(card);
        });
    } catch (error) {
        console.error('漫画ブログの表示に失敗しました:', error);
        mangaContainer.innerHTML = '<div class="error">ブログの読み込みに失敗しました。後でもう一度お試しください。</div>';
    }
}

// 将来的な実装: YouTube API連携
// 実際のアプリケーションでは、YouTube Data APIを使用して最新・人気動画を取得
function fetchYouTubeVideos() {
    // SITE_CONFIG (config.js)から設定を取得
    const apiKey = window.SITE_CONFIG ? window.SITE_CONFIG.youtube.apiKey : 'YOUR_API_KEY_HERE';
    const channelId = window.SITE_CONFIG ? window.SITE_CONFIG.youtube.channelId : 'UCtRCF2NLRULCmf-oLAF455w';
    const featuredVideoId = window.SITE_CONFIG ? window.SITE_CONFIG.youtube.featuredVideoId : 'FEATURED_VIDEO_ID';
    
    // 最新動画を取得するためのURL構築
    const latestVideoUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1&type=video`;
    
    // 人気動画を取得するためのURL構築
    const popularVideoUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=1&type=video`;
    
    // 指定動画を取得するためのURL構築
    const featuredVideoUrl = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${featuredVideoId}&part=snippet`;
    
    // 将来的にはここでAPIリクエストを行い、結果を処理
    console.log('YouTube API URLが構築されました：', latestVideoUrl);
}

// 将来的な実装: RSS/ブログフィード連携
// 実際のアプリケーションでは、RSSフィードなどを使用して最新の漫画ブログ記事を取得
function fetchMangaBlogPosts() {
    // SITE_CONFIG (config.js)から設定を取得
    const rssUrl = window.SITE_CONFIG ? window.SITE_CONFIG.mangaBlog.rssUrl : 'https://buson.blog.jp/index.rdf';
    
    // RSS2JSONサービスを使用してRSSをJSONに変換するためのURL構築
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    // 将来的にはここでAPIリクエストを行い、結果を処理
    console.log('RSS API URLが構築されました：', apiUrl);
}

// HTML内の画像URL抽出ロジック（将来の実装用）
function extractImageFromHTML(html) {
    // まず<img>タグのsrc属性を探す
    const imgRegex = /<img[^>]+src="([^">]+)"/g;
    const match = imgRegex.exec(html);
    
    if (match && match[1]) {
        return match[1];
    }
    
    // <figure>タグ内の画像も探す
    const figureRegex = /<figure[^>]*>[\s\S]*?<img[^>]+src="([^">]+)"[\s\S]*?<\/figure>/g;
    const figureMatch = figureRegex.exec(html);
    
    if (figureMatch && figureMatch[1]) {
        return figureMatch[1];
    }
    
    // 背景画像のURL抽出を試みる
    const styleRegex = /background-image:\s*url\(['"]?([^'")]+)['"]?\)/g;
    const styleMatch = styleRegex.exec(html);
    
    if (styleMatch && styleMatch[1]) {
        return styleMatch[1];
    }
    
    // 画像が見つからない場合はデフォルト画像のパスを返す
    return 'images/manga/manga_default.jpg';
}
