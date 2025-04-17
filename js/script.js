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
                    "image": "images/slider1.jpg",
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
        
    // YouTubeデータの初期化
    initializeYouTube();
    
    // 漫画ブログデータの初期化
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
    
    // 画像を背景として設定
    if (data[0].image) {
        sliderItem.style.backgroundImage = `url('${data[0].image}')`;
        sliderItem.style.backgroundSize = 'cover';
        sliderItem.style.backgroundPosition = 'center';
        sliderItem.style.height = '100%';
    }
    
    sliderItem.innerHTML = `
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
        // 画像を背景として設定
        if (data[currentIndex].image) {
            sliderItem.style.backgroundImage = `url('${data[currentIndex].image}')`;
        }
        
        sliderItem.innerHTML = `
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
        
        // 画像パスの生成
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
            // 画像パスの生成
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
    if (!goodsContainer || !data || data.length === 0) {
        console.error('グッズデータまたはコンテナが見つかりません');
        return;
    }

    // グッズカードをクリア
    goodsContainer.innerHTML = '';
    
    // デバッグ情報
    console.log('グッズデータを読み込みました:', data);

    // グッズカードを生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'goods-card';

        // 画像パスの生成
        const imagePath = item.image || 'images/character/1.png';
        console.log('グッズ画像パス:', imagePath);

        // 価格をフォーマット
        const formattedPrice = item.price.toLocaleString() + '円（税込）';

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

// グッズデータを読み込み
fetch('data/goods.json')
    .then(response => {
        console.log('グッズJSONレスポンス:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('グッズデータ取得成功:', data);
        initializeGoods(data);
    })
    .catch(error => {
        console.error('グッズデータの読み込みに失敗しました:', error);
        // エラー時にはダミーデータを表示（オプション）
        const dummyData = [
            {
                "id": 1,
                "name": "モフタロウ ぬいぐるみ",
                "image": "images/goods/1.png",
                "price": 2649,
                "url": "https://suzuri.jp/buson2025/15723649/acrylic-keychain/50x50mm/clear"
            }
        ];
        initializeGoods(dummyData);
    });

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
    
    // 指定された動画URL
    const youtubeVideos = [
        {
            url: 'https://www.youtube.com/embed/kcrNtg0TJyU',
            title: 'BUSON STUDIO紹介動画',
            description: 'BUSONスタジオの紹介動画です'
        },
        {
            url: 'https://www.youtube.com/embed/OKKawaP8z-c',
            title: 'キャラクターメイキング',
            description: 'キャラクターのメイキング動画です'
        },
        {
            url: 'https://www.youtube.com/embed/M9cTZ0lZqPQ',
            title: 'イベント映像',
            description: 'イベントの様子をお届けします'
        }
    ];
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    youtubeVideos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'youtube-card';
        
        card.innerHTML = `
            <div class="youtube-embed">
                <iframe src="${video.url}" title="${video.title}" 
                frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
            </div>
            <div class="youtube-info">
                <h3>${video.title}</h3>
                <p>${video.description}</p>
            </div>
        `;
        
        youtubeContainer.appendChild(card);
    });
}

// 漫画ブログの初期化（ヘッダー画像のみ表示）
function initializeMangaBlog() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // ヘッダー画像のみを表示
    const headerImage = document.createElement('div');
    headerImage.className = 'manga-header';
    
    headerImage.innerHTML = `
        <a href="https://buson.blog.jp" target="_blank" class="manga-header-link">
            <img src="images/mangablog/header.PNG" alt="漫画ブログ" class="manga-header-image">
        </a>
    `;
    
    mangaContainer.appendChild(headerImage);
}
