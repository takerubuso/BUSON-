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

// 漫画ブログ記事をUIに表示する関数（タイトルのみバージョン）
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
                url: 'https://buson.blog.jp/post1'
            },
            {
                title: '幼児の口癖あるある',
                date: '2025-04-04',
                url: 'https://buson.blog.jp/post2'
            },
            {
                title: 'モテない人あるある',
                date: '2025-04-03',
                url: 'https://buson.blog.jp/post3'
            },
            {
                title: '実家の両親あるある',
                date: '2025-04-01',
                url: 'https://buson.blog.jp/post4'
            },
            {
                title: '猫を飼っている人あるある',
                date: '2025-03-28',
                url: 'https://buson.blog.jp/post5'
            },
            {
                title: '同僚とのやりとりあるある',
                date: '2025-03-25',
                url: 'https://buson.blog.jp/post6'
            }
        ];
        
        // コンテナをクリア
        mangaContainer.innerHTML = '';
        
        // リスト形式で表示
        const listElement = document.createElement('ul');
        listElement.className = 'manga-list';
        
        // 記事リストアイテムを生成
        posts.forEach(post => {
            // 日付をフォーマット
            const formattedDate = post.date.replace(/-/g, '.');
            
            const listItem = document.createElement('li');
            listItem.className = 'manga-list-item';
            
            listItem.innerHTML = `
                <span class="post-date">${formattedDate}</span>
                <a href="${post.url}" class="post-title" target="_blank">${post.title}</a>
            `;
            
            listElement.appendChild(listItem);
        });
        
        mangaContainer.appendChild(listElement);
        
    } catch (error) {
        console.error('漫画ブログの表示に失敗しました:', error);
        mangaContainer.innerHTML = '<div class="error">ブログの読み込みに失敗しました。後でもう一度お試しください。</div>';
    }
}

// 将来的な実装: RSSフィードから最新記事を取得する関数
async function fetchRealMangaBlogPosts() {
    try {
        // SITE_CONFIG (config.js)から設定を取得
        const rssUrl = window.SITE_CONFIG ? window.SITE_CONFIG.mangaBlog.rssUrl : 'https://buson.blog.jp/index.rdf';
        
        // RSS2JSONサービスを使用してRSSをJSONに変換
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`RSSフィードエラー: ${data.message || 'Unknown error'}`);
        }
        
        // 最新の6記事を取得して整形
        const posts = data.items.slice(0, 6).map(item => ({
            title: item.title,
            date: new Date(item.pubDate).toISOString().split('T')[0],
            url: item.link
        }));
        
        return posts;
    } catch (error) {
        console.error('漫画ブログフィードの取得に失敗しました:', error);
        throw error;
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

// 実際の実装に移行する場合のために、以下の関数を定期的に実行するセットアップ
function setupAutomaticUpdates() {
    // 更新間隔を設定（ミリ秒）
    const updateInterval = window.SITE_CONFIG ? window.SITE_CONFIG.mangaBlog.updateInterval : 3600000; // デフォルト1時間
    
    // 定期的な更新を設定
    setInterval(async () => {
        try {
            // 実際のデータ取得関数に置き換える
            // const posts = await fetchRealMangaBlogPosts();
            // displayMangaBlogPosts(posts);
            
            console.log('ブログデータの自動更新をチェックしました');
        } catch (error) {
            console.error('自動更新に失敗しました:', error);
        }
    }, updateInterval);
    
    // 初回実行（ページ読み込み完了時）
    document.addEventListener('DOMContentLoaded', () => {
        console.log('ページ読み込み完了時のデータ更新を実行します');
    });
}

// アプリケーションが本番環境に移行する際にコメントを外す
// setupAutomaticUpdates();
