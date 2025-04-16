document.addEventListener('DOMContentLoaded', function() {
    // スライダーデータを読み込み
    fetch('data/slider.json')
        .then(response => response.json())
        .then(data => {
            initializeSlider(data);
        })
        .catch(error => {
            console.error('スライダーデータの読み込みに失敗しました:', error);
            // エラー時にデフォルトデータで表示
            const defaultSliderData = [
                {
                    "title": "新キャラクター「ピンキー」登場！",
                    "description": "宇宙からやってきた不思議な猫型キャラクター",
                    "url": "#characters"
                }
            ];
            initializeSlider(defaultSliderData);
        });

    // キャラクターデータを読み込み
    fetch('data/characters.json')
        .then(response => response.json())
        .then(data => {
            initializeCharacters(data);
            setupCharacterModal(data); // モーダル設定を追加
        })
        .catch(error => {
            console.error('キャラクターデータの読み込みに失敗しました:', error);
            // エラー時は何も表示しない
        });

    // グッズデータを読み込み
    fetch('data/goods.json')
        .then(response => response.json())
        .then(data => {
            initializeGoods(data);
        })
        .catch(error => {
            console.error('グッズデータの読み込みに失敗しました:', error);
            // エラー時は何も表示しない
        });

    // ニュースデータを読み込み
    fetch('data/news.json')
        .then(response => response.json())
        .then(data => {
            initializeNews(data);
        })
        .catch(error => {
            console.error('ニュースデータの読み込みに失敗しました:', error);
            // エラー時は何も表示しない
        });
        
    // YouTubeデータの初期化（仮のデータ）
    initializeYouTube();
    
    // 漫画ブログデータの初期化（仮のデータ）
    initializeMangaBlog();
});

// スライダーの初期化
function initializeSlider(data) {
    const sliderContainer = document.querySelector('.slider');
    if (!sliderContainer || !data || data.length === 0) return;

    // スライダー内容をクリア
    sliderContainer.innerHTML = '';

    // スライダーの最初の要素を表示
    const sliderItem = document.createElement('div');
    sliderItem.className = 'slider-content';
    sliderItem.innerHTML = `
        <div style="text-align: center; color: white; font-size: 24px; font-weight: bold;">
            BUSON STUDIO<br>スライダー
        </div>
        <div class="slider-caption">
            <h3>${data[0].title}</h3>
            <p>${data[0].description}</p>
        </div>
    `;
    sliderContainer.appendChild(sliderItem);

    // スライダーの操作処理
    let currentIndex = 0;

    document.querySelector('.slider-next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % data.length;
        updateSlider();
    });

    document.querySelector('.slider-prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + data.length) % data.length;
        updateSlider();
    });

    function updateSlider() {
        sliderItem.innerHTML = `
            <div style="text-align: center; color: white; font-size: 24px; font-weight: bold;">
                BUSON STUDIO<br>スライダー
            </div>
            <div class="slider-caption">
                <h3>${data[currentIndex].title}</h3>
                <p>${data[currentIndex].description}</p>
            </div>
        `;
    }
    
    // 自動スライド（5秒間隔）
    if (data.length > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % data.length;
            updateSlider();
        }, 5000);
    }
}

// キャラクターの初期化
function initializeCharacters(data) {
    const characterContainer = document.querySelector('.character-container');
    if (!characterContainer || !data || data.length === 0) return;

    // キャラクターカードをクリア
    characterContainer.innerHTML = '';

    // キャラクターカードを生成
    data.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.setAttribute('data-character', character.name); // data属性を追加
        
        // 画像パスの生成（実際のパスに合わせる）
        const imagePath = character.image || 'images/character/1.png';
        
        card.innerHTML = `
            <div class="character-img">
                <img src="${imagePath}" alt="${character.name}" onerror="this.onerror=null; this.src='images/character/1.png';">
            </div>
            <h3>${character.name}</h3>
        `;
        characterContainer.appendChild(card);
    });
}

// キャラクターモーダルの設定
function setupCharacterModal(characters) {
    const modal = document.getElementById('characterModal');
    const modalContent = document.getElementById('modalCharacterContent');
    const closeButton = document.querySelector('.close-button');

    // キャラクターカードにクリックイベントを追加
    const characterCards = document.querySelectorAll('.character-card');

    characterCards.forEach(card => {
        card.addEventListener('click', function() {
            const characterName = this.getAttribute('data-character');
            showCharacterModal(characterName, characters);
        });
    });

    // 閉じるボタンのクリックイベント
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // スクロールを再有効化
    });

    // モーダル外のクリックで閉じる
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // スクロールを再有効化
        }
    });

    // キャラクターモーダルを表示する関数
    function showCharacterModal(characterName, characters) {
        const character = characters.find(char => char.name === characterName);

        if (character) {
            // 画像パスの生成（実際のパスに合わせる）
            const imagePath = character.image || `images/character/1.png`;

            // ソーシャルリンクを生成
            const socialLinksHTML = character.socialLinks && character.socialLinks.length > 0
                ? character.socialLinks.map(link =>
                    `<a href="${link.url}" target="_blank">${link.name}</a>`
                ).join('')
                : '';

            // キャラクター情報アイコンの配置順序を指定
            const topRowIcons = [
                { key: 'personality', label: '性格', icon: 'images/icons/1.png' },
                { key: 'birthday', label: '誕生日', icon: 'images/icons/2.png' },
                { key: 'debutYear', label: 'デビュー年', icon: 'images/icons/3.png' }
            ];
            
            const bottomRowIcons = [
                { key: 'hobbies', label: '趣味', icon: 'images/icons/4.png' },
                { key: 'skills', label: '特技', icon: 'images/icons/5.png' },
                { key: 'favoriteFood', label: '好きな食べ物', icon: 'images/icons/6.png' }
            ];

            // アイコン生成関数
            function generateIconHTML(iconInfo) {
                if (!character[iconInfo.key]) return '';
                
                const value = Array.isArray(character[iconInfo.key]) 
                    ? character[iconInfo.key].join('、') 
                    : character[iconInfo.key];
                
                return `
                    <div class="info-item">
                        <div class="info-circle" data-info="${iconInfo.key}">
                            <img src="${iconInfo.icon}" alt="${iconInfo.label}" onerror="this.onerror=null; this.style.display='none';">
                            <div class="info-popup">${value}</div>
                        </div>
                        <p class="info-label-text">${iconInfo.label}</p>
                    </div>
                `;
            }

            // 上下段のアイコンHTMLを生成
            const topRowHTML = topRowIcons.map(icon => generateIconHTML(icon)).join('');
            const bottomRowHTML = bottomRowIcons.map(icon => generateIconHTML(icon)).join('');

            // モーダル内容を生成
            modalContent.innerHTML = `
                <div class="character-profile">
                    <div class="character-image">
                        <img src="${imagePath}" alt="${character.name}" onerror="this.onerror=null; this.src='images/character/1.png';">
                    </div>
                    <h2 class="character-name">${character.name}</h2>
                    <p class="character-description">${character.profile}</p>
                    <div class="character-social">
                        ${socialLinksHTML}
                    </div>
                    <div class="character-other-info-container">
                        ${topRowHTML}
                        ${bottomRowHTML}
                    </div>
                </div>
            `;

            // ポップアップイベントリスナーを設定
            const infoCircles = document.querySelectorAll('.info-circle');
            infoCircles.forEach(circle => {
                circle.addEventListener('click', function() {
                    const popup = this.querySelector('.info-popup');
                    if (popup) {
                        document.querySelectorAll('.info-popup').forEach(p => {
                            if (p !== popup) {
                                p.style.display = 'none';
                            }
                        });
                        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                    }
                });
            });

            // モーダルを表示
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
}

// グッズの初期化
function initializeGoods(data) {
    const goodsContainer = document.querySelector('.goods-container');
    if (!goodsContainer || !data || data.length === 0) return;

    // グッズカードをクリア
    goodsContainer.innerHTML = '';

    // グッズカードを生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'goods-card';

        // 画像パスの生成（実際のパスに合わせる）
        const imagePath = item.image || 'images/character/1.png';

        // 価格をフォーマット
        const formattedPrice = item.price.toLocaleString() + '円';

        card.innerHTML = `
            <div class="goods-img">
                <img src="${imagePath}" alt="${item.name}" onerror="this.onerror=null; this.src='images/character/1.png';">
            </div>
            <div class="goods-info">
                <h3>${item.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${item.url}" class="button" target="_blank">購入する</a>
            </div>
        `;
        goodsContainer.appendChild(card);
    });
}

// ニュースの初期化
function initializeNews(data) {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer || !data || data.length === 0) return;

    // ニュースコンテナをクリア
    newsContainer.innerHTML = '';

    // ニュースアイテムを生成
    data.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        const formattedDate = item.date.replace(/-/g, '.');
        newsItem.innerHTML = `
            <p class="date">${formattedDate}</p>
            <h3>${item.title}</h3>
            <p>${item.summary}</p>
            <a href="${item.url}" class="read-more">もっと見る</a>
        `;
        newsContainer.appendChild(newsItem);
    });
}

// YouTube動画の初期化
function initializeYouTube() {
    const youtubeContainer = document.querySelector('.youtube-container');
    if (!youtubeContainer) return;
    
    // 実際のAPIデータの代わりに仮データを使用
    const dummyYouTubeData = [
        {
            id: 'VIDEO_ID_1',
            title: '最新動画',
            description: 'チャンネルの最新アップロード動画',
            type: '最新'
        },
        {
            id: 'VIDEO_ID_2',
            title: '人気動画',
            description: '最も再生数の多い動画',
            type: '人気'
        },
        {
            id: 'VIDEO_ID_3',
            title: 'おすすめ動画',
            description: '管理者が選んだおすすめ動画',
            type: 'ピックアップ'
        }
    ];
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    dummyYouTubeData.forEach(video => {
        const card = document.createElement('div');
        card.className = 'youtube-card';
        
        card.innerHTML = `
            <div class="youtube-embed">
                <!-- 実際の埋め込みコードに置き換える -->
                <iframe src="https://www.youtube.com/embed/${video.id}" title="${video.title}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <div class="youtube-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
                <p class="video-type">${video.type}</p>
            </div>
        `;
        
        youtubeContainer.appendChild(card);
    });
}

// 漫画ブログの初期化
function initializeMangaBlog() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // 実際のAPIデータの代わりに仮データを使用
    const dummyMangaData = [
        {
            title: '最新漫画ブログ記事1',
            date: '2025.04.15',
            image: 'images/manga1.jpg',
            url: 'https://buson.blog.jp'
        },
        {
            title: '最新漫画ブログ記事2',
            date: '2025.04.10',
            image: 'images/manga2.jpg',
            url: 'https://buson.blog.jp'
        },
        {
            title: '最新漫画ブログ記事3',
            date: '2025.04.05',
            image: 'images/manga3.jpg',
            url: 'https://buson.blog.jp'
        }
    ];
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 漫画ブログカードを生成
    dummyMangaData.forEach(manga => {
        const card = document.createElement('div');
        card.className = 'manga-card';
        
        card.innerHTML = `
            <div class="manga-img">
                <img src="${manga.image}" alt="${manga.title}" onerror="this.onerror=null; this.src='images/character/1.png';">
            </div>
            <div class="manga-info">
                <p class="date">${manga.date}</p>
                <h3>${manga.title}</h3>
                <a href="${manga.url}" class="read-more" target="_blank">もっと見る</a>
            </div>
        `;
        
        mangaContainer.appendChild(card);
    });
}

// 将来的な実装: YouTube API連携
// 実際のアプリケーションでは、YouTube Data APIを使用して最新・人気動画を取得
function fetchYouTubeData() {
    // 実装例（実際には適切なAPIキーとチャンネルIDが必要）
    const apiKey = 'YOUR_API_KEY';
    const channelId = 'UCtRCF2NLRULCmf-oLAF455w';
    
    // 最新動画を取得
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=1`)
        .then(response => response.json())
        .then(data => {
            // データ処理
            console.log('最新動画:', data);
        })
        .catch(error => console.error('YouTube API エラー:', error));
    
    // 人気動画を取得
    fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=viewCount&maxResults=1`)
        .then(response => response.json())
        .then(data => {
            // データ処理
            console.log('人気動画:', data);
        })
        .catch(error => console.error('YouTube API エラー:', error));
}

// 将来的な実装: RSS/ブログフィード連携
// 実際のアプリケーションでは、RSSフィードなどを使用して最新の漫画ブログ記事を取得
function fetchMangaBlogData() {
    // 実装例（RSSフィードをJSONに変換するサービスを使用）
    const blogUrl = 'https://buson.blog.jp';
    const rssUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(blogUrl)}/feed/`;
    
    fetch(rssUrl)
        .then(response => response.json())
        .then(data => {
            // データ処理
            console.log('ブログフィード:', data);
        })
        .catch(error => console.error('ブログフィード取得エラー:', error));
}
