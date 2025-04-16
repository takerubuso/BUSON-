// YouTube APIとの連携とRSSフィード連携
document.addEventListener('DOMContentLoaded', function() {
    // YouTube動画とマンガブログの表示を初期化
    displayYouTubeVideos();
    displayMangaBlogPosts();
    
    // 自動更新機能を有効化
    setupAutomaticUpdates();
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
        // 実際のRSSフィードからデータを取得
        const posts = await fetchRealMangaBlogPosts();
        
        // データが取得できない場合
        if (!posts || posts.length === 0) {
            mangaContainer.innerHTML = '<div class="error">ブログ記事が見つかりませんでした。</div>';
            return;
        }
        
        // コンテナをクリア
        mangaContainer.innerHTML = '';
        
        // リスト形式で表示
        const listElement = document.createElement('ul');
        listElement.className = 'manga-list';
        
        // 記事リストアイテムを生成（最大6件）
        posts.slice(0, 6).forEach(post => {
            // 日付をフォーマット
            const formattedDate = post.date.replace(/-/g, '.');
            
            const listItem = document.createElement('li');
            listItem.className = 'manga-list-item';
            
            listItem.innerHTML = `
                <a href="${post.url}" class="post-link" target="_blank">
                    <span class="post-date">${formattedDate}</span>
                    <span class="post-title">${post.title}</span>
                </a>
            `;
            
            listElement.appendChild(listItem);
        });
        
        mangaContainer.appendChild(listElement);
        
    } catch (error) {
        console.error('漫画ブログの表示に失敗しました:', error);
        mangaContainer.innerHTML = '<div class="error">ブログの読み込みに失敗しました。後でもう一度お試しください。</div>';
        
        // エラー時はローカルデータでフォールバック
        useFallbackMangaBlogData(mangaContainer);
    }
}

// RSSフィードから実際のブログ記事データを取得する関数
async function fetchRealMangaBlogPosts() {
    try {
        // SITE_CONFIG (config.js)から設定を取得、またはデフォルト値を使用
        const rssUrl = window.SITE_CONFIG?.mangaBlog?.rssUrl || 'https://buson.blog.jp/index.rdf';
        
        // RSS2JSONサービスを使用してRSSをJSONに変換
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        // ローカルストレージからキャッシュを取得
        const cachedData = localStorage.getItem('mangaBlogData');
        const cacheTimestamp = localStorage.getItem('mangaBlogTimestamp');
        
        // キャッシュが有効か確認（10分以内）
        const currentTime = new Date().getTime();
        const cacheExpiryTime = 10 * 60 * 1000; // 10分（ミリ秒）
        
        if (cachedData && cacheTimestamp) {
            const cacheAge = currentTime - parseInt(cacheTimestamp);
            
            // キャッシュが有効期限内なら使用
            if (cacheAge < cacheExpiryTime) {
                return JSON.parse(cachedData);
            }
        }
        
        // APIリクエスト
        console.log('RSSフィードを取得中...');
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
            throw new Error(`APIエラー: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`RSSフィードエラー: ${data.message || 'Unknown error'}`);
        }
        
        // データ整形
        const posts = data.items.map(item => ({
            title: item.title,
            date: new Date(item.pubDate).toISOString().split('T')[0],
            url: item.link
        }));
        
        // キャッシュを更新
        localStorage.setItem('mangaBlogData', JSON.stringify(posts));
        localStorage.setItem('mangaBlogTimestamp', currentTime.toString());
        
        return posts;
    } catch (error) {
        console.error('漫画ブログフィードの取得に失敗しました:', error);
        
        // キャッシュがあればそれを返す
        const cachedData = localStorage.getItem('mangaBlogData');
        if (cachedData) {
            console.log('キャッシュデータを使用します');
            return JSON.parse(cachedData);
        }
        
        throw error;
    }
}

// フォールバック用の漫画ブログデータを表示する関数
function useFallbackMangaBlogData(container) {
    // デモデータ
    const fallbackPosts = [
        {
            title: '夫にやめて欲しいあるある',
            date: '2025.04.15',
            url: 'https://buson.blog.jp/post1'
        },
        {
            title: '幼児の口癖あるある',
            date: '2025.04.04',
            url: 'https://buson.blog.jp/post2'
        },
        {
            title: 'モテない人あるある',
            date: '2025.04.03',
            url: 'https://buson.blog.jp/post3'
        },
        {
            title: '実家の両親あるある',
            date: '2025.04.01',
            url: 'https://buson.blog.jp/post4'
        },
        {
            title: '猫を飼っている人あるある',
            date: '2025.03.28',
            url: 'https://buson.blog.jp/post5'
        },
        {
            title: '同僚とのやりとりあるある',
            date: '2025.03.25',
            url: 'https://buson.blog.jp/post6'
        }
    ];
    
    // コンテナをクリア
    container.innerHTML = '';
    
    // リスト形式で表示
    const listElement = document.createElement('ul');
    listElement.className = 'manga-list';
    
    // 記事リストアイテムを生成（最大6件）
    fallbackPosts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.className = 'manga-list-item';
        
        listItem.innerHTML = `
            <a href="${post.url}" class="post-link" target="_blank">
                <span class="post-date">${post.date}</span>
                <span class="post-title">${post.title}</span>
            </a>
        `;
        
        listElement.appendChild(listItem);
    });
    
    container.appendChild(listElement);
}

// 自動更新のための設定
function setupAutomaticUpdates() {
    // 更新間隔を設定（ミリ秒）
    const updateInterval = window.SITE_CONFIG?.mangaBlog?.updateInterval || 600000; // デフォルト10分
    
    // 定期的な更新を設定
    setInterval(async () => {
        try {
            console.log('ブログデータの自動更新をチェックしています...');
            displayMangaBlogPosts();
        } catch (error) {
            console.error('自動更新に失敗しました:', error);
        }
    }, updateInterval);
}

// CORS問題に対応するヘルパー関数（プロキシサーバーが必要な場合に使用）
function getProxiedRssUrl(originalUrl) {
    // CORSプロキシサービスのURL
    // 注意：独自のプロキシサーバーを使用するか、CORS対応のサービスを使用することをお勧めします
    return `https://api.allorigins.win/raw?url=${encodeURIComponent(originalUrl)}`;
}
