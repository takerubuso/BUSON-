document.addEventListener('DOMContentLoaded', function() {
    // モバイルメニューの切り替え
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // スライダーデータの読み込みと初期化
    loadSliderData();
    
    // キャラクターデータの読み込みと初期化
    loadCharacterData();
    
    // グッズデータの読み込みと初期化
    loadGoodsData();
    
    // ニュースデータの読み込みと初期化
    loadNewsData();
});

// データ取得関数
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Could not fetch data from ${url}: ${error}`);
        return null;
    }
}

// ダミーJSONデータ（実際には外部ファイルから読み込み）
// 実装時にはこれらのデータを /data/ ディレクトリ内の対応するJSONファイルに置き換える
const dummySliderData = [
    {
        image: "images/slider1.jpg",
        title: "新キャラクター「ピンキー」登場！",
        description: "宇宙からやってきた不思議な猫型キャラクター",
        url: "#characters"
    },
    {
        image: "images/slider2.jpg",
        title: "グッズ新発売",
        description: "人気キャラクター「モフタロウ」のぬいぐるみが発売開始！",
        url: "#goods"
    },
    {
        image: "images/slider3.jpg",
        title: "コラボカフェ開催中",
        description: "期間限定のスペシャルコラボカフェが渋谷にオープン！",
        url: "#news"
    }
];

const dummyCharacterData = [
    {
        id: 1,
        name: "モフタロウ",
        image: "images/character1.jpg",
        profile: "BUSONスタジオの看板キャラクター。もふもふの毛に包まれた謎の生き物。食べ物の好き嫌いが激しく、特にいちごが大好物。好奇心旺盛で、いつも新しい冒険を探している。",
        socialLinks: [
            { name: "Twitter", url: "https://twitter.com/" },
            { name: "Instagram", url: "https://instagram.com/" }
        ]
    },
    {
        id: 2,
        name: "ピンキー",
        image: "images/character2.jpg",
        profile: "宇宙からやってきた猫型宇宙人。ピンク色の体が特徴的。いつも明るく元気いっぱいで、周りを幸せにする不思議な力を持っている。モフタロウとは親友。",
        socialLinks: [
            { name: "Twitter", url: "https://twitter.com/" },
            { name: "YouTube", url: "https://youtube.com/" }
        ]
    },
    {
        id: 3,
        name: "クマゴロー",
        image: "images/character3.jpg",
        profile: "森に住むクマのキャラクター。見た目は怖そうだが、実は甘いものが大好きな優しい性格。手先が器用で、木工細工が得意。",
        socialLinks: [
            { name: "Instagram", url: "https://instagram.com/" }
        ]
    },
    {
        id: 4,
        name: "ミント",
        image: "images/character4.jpg",
        profile: "ミントの妖精。清涼感のある香りを放つ緑色の小さな妖精。自然を愛し、環境保護に熱心。ハーブティーを作るのが特技。",
        socialLinks: [
            { name: "Twitter", url: "https://twitter.com/" }
        ]
    },
    {
        id: 5,
        name: "ポポタン",
        image: "images/character5.jpg",
        profile: "可愛らしいひよこのようなキャラクター。いつもポポポと鳴いている。単純で素直な性格だが、時々予想外の行動をとる。",
        socialLinks: [
            { name: "YouTube", url: "https://youtube.com/" },
            { name: "Instagram", url: "https://instagram.com/" }
        ]
    }
];

const dummyGoodsData = [
    {
        id: 1,
        name: "モフタロウ ぬいぐるみ",
        image: "images/goods1.jpg",
        price: 2,500,
        url: "https://booth.pm/"
    },
    {
        id: 2,
        name: "ピンキー アクリルキーホルダー",
        image: "images/goods2.jpg",
        price: 800,
        url: "https://booth.pm/"
    },
    {
        id: 3,
        name: "キャラクター マスキングテープ",
        image: "images/goods3.jpg",
        price: 550,
        url: "https://booth.pm/"
    },
    {
        id: 4,
        name: "クマゴロー Tシャツ",
        image: "images/goods4.jpg",
        price: 3,200,
        url: "https://base.shop/"
    },
    {
        id: 5,
        name: "ミント トートバッグ",
        image: "images/goods5.jpg",
        price: 1,800,
        url: "https://base.shop/"
    },
    {
        id: 6,
        name: "ポポタン マグカップ",
        image: "images/goods6.jpg",
        price: 1,500,
        url: "https://booth.pm/"
    }
];

const dummyNewsData = [
    {
        id: 1,
        date: "2025-04-15",
        title: "新キャラクター「ピンキー」登場！",
        image: "images/news1.jpg",
        summary: "宇宙からやってきた不思議な猫型キャラクター「ピンキー」が仲間入り！特設ページでプロフィールを公開中です。",
        url: "#"
    },
    {
        id: 2,
        date: "2025-04-10",
        title: "コラボカフェ開催のお知らせ",
        image: "images/news2.jpg",
        summary: "4月20日から5月15日まで、渋谷のカフェ「スイートタイム」にてBUSONスタジオキャラクターズのコラボカフェを開催します！",
        url: "#"
    },
    {
        id: 3,
        date: "2025-04-01",
        title: "グッズ新発売のお知らせ",
        image: "images/news3.jpg",
        summary: "人気キャラクター「モフタロウ」のぬいぐるみなど、新グッズが発売開始！BOOTHとBASEにて販売中です。",
        url: "#"
    },
    {
        id: 4,
        date: "2025-03-25",
        title: "春の新作イラスト公開！",
        image: "images/news4.jpg",
        summary: "桜をテーマにした春の新作イラストを公開しました。壁紙としてダウンロードも可能です。",
        url: "#"
    }
];

// トップスライダーの初期化
function loadSliderData() {
    // 実際の実装ではfetchJSON('/data/slider.json')を使用
    const sliderData = dummySliderData;
    initializeSlider(sliderData);
}

function initializeSlider(data) {
    const sliderContainer = document.querySelector('.slider');
    if (!sliderContainer || !data || data.length === 0) return;

    // スライダーアイテムの生成
    data.forEach(item => {
        const sliderItem = document.createElement('div');
        sliderItem.className = 'slider-item';
        
        // リンクを設定（クリックで遷移可能に）
        sliderItem.onclick = function() {
            window.location.href = item.url;
        };
        
        sliderItem.style.cursor = 'pointer';
        
        // 画像と説明テキストを追加
        const html = `
            <img src="${item.image}" alt="${item.title}">
            <div class="slider-caption">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        sliderItem.innerHTML = html;
        sliderContainer.appendChild(sliderItem);
    });

    // スライダーコントロールの初期化
    initializeSliderControls('.slider', '.slider-item', '.slider-prev', '.slider-next');
}

// キャラクター紹介の初期化
function loadCharacterData() {
    // 実際の実装ではfetchJSON('/data/characters.json')を使用
    const characterData = dummyCharacterData;
    initializeCharacters(characterData);
}

function initializeCharacters(data) {
    const characterContainer = document.querySelector('.character-cards');
    if (!characterContainer || !data || data.length === 0) return;

    // キャラクターカードの生成
    data.forEach(character => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.dataset.id = character.id;
        
        const html = `
            <img src="${character.image}" alt="${character.name}">
            <h3>${character.name}</h3>
        `;
        
        card.innerHTML = html;
        characterContainer.appendChild(card);
        
        // カードクリック時の詳細モーダル表示
        card.addEventListener('click', function() {
            showCharacterDetail(character);
        });
    });

    // キャラクタースライダーコントロールの初期化
    initializeSliderControls('.character-slider', '.character-card', '.character-prev', '.character-next');
}

// キャラクター詳細モーダル表示
function showCharacterDetail(character) {
    const modal = document.querySelector('.character-modal');
    const detailContainer = document.querySelector('.character-detail');
    
    if (!modal || !detailContainer) return;
    
    // モーダル内容の生成
    let socialLinksHtml = '';
    if (character.socialLinks && character.socialLinks.length > 0) {
        socialLinksHtml = '<div class="social-links">';
        character.socialLinks.forEach(link => {
            socialLinksHtml += `<a href="${link.url}" target="_blank">${link.name}</a>`;
        });
        socialLinksHtml += '</div>';
    }
    
    const html = `
        <img src="${character.image}" alt="${character.name}">
        <h3>${character.name}</h3>
        <p>${character.profile}</p>
        ${socialLinksHtml}
    `;
    
    detailContainer.innerHTML = html;
    
    // モーダル表示
    modal.style.display = 'flex';
    
    // モーダルを閉じる処理
    const closeBtn = document.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // モーダル外クリックで閉じる
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// グッズ紹介の初期化
function loadGoodsData() {
    // 実際の実装ではfetchJSON('/data/goods.json')を使用
    const goodsData = dummyGoodsData;
    initializeGoods(goodsData);
}

function initializeGoods(data) {
    const goodsContainer = document.querySelector('.goods-container');
    if (!goodsContainer || !data || data.length === 0) return;

    // グッズカードの生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        
        // 価格をフォーマット（カンマ区切り）
        const formattedPrice = item.price.toLocaleString() + '円';
        
        const html = `
            <a href="${item.url}" target="_blank">
                <img src="${item.image}" alt="${item.name}">
                <div class="goods-info">
                    <h3>${item.name}</h3>
                    <p class="price">${formattedPrice}</p>
                    <span class="button">購入する</span>
                </div>
            </a>
        `;
        
        card.innerHTML = html;
        goodsContainer.appendChild(card);
    });
}

// ニュース記事の初期化
function loadNewsData() {
    // 実際の実装ではfetchJSON('/data/news.json')を使用
    const newsData = dummyNewsData;
    initializeNews(newsData);
}

function initializeNews(data) {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer || !data || data.length === 0) return;

    // ニュースカードの生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'news-card';
        
        // 日付のフォーマット（YYYY-MM-DD → YYYY.MM.DD）
        const formattedDate = item.date.replace(/-/g, '.');
        
        const html = `
            <img src="${item.image}" alt="${item.title}">
            <div class="news-info">
                <p class="date">${formattedDate}</p>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <a href="${item.url}" class="read-more">もっと見る</a>
            </div>
        `;
        
        card.innerHTML = html;
        newsContainer.appendChild(card);
    });

    // ニューススライダーコントロールの初期化
    initializeSliderControls('.news-slider', '.news-card', '.news-prev', '.news-next');
}

// スライダー共通制御（トップ、キャラクター、ニュース）
function initializeSliderControls(containerSelector, itemSelector, prevBtnSelector, nextBtnSelector) {
    const container = document.querySelector(containerSelector);
    const items = document.querySelectorAll(itemSelector);
    const prevBtn = document.querySelector(prevBtnSelector);
    const nextBtn = document.querySelector(nextBtnSelector);
    
    if (!container || !items.length || !prevBtn || !nextBtn) return;
    
    // スライダーの状態を追跡
    let currentIndex = 0;
    let itemWidth = items[0].offsetWidth;
    let visibleItems = Math.floor(container.offsetWidth / itemWidth);
    
    // 画面サイズ変更時に再計算
    window.addEventListener('resize', function() {
        itemWidth = items[0].offsetWidth;
        visibleItems = Math.floor(container.offsetWidth / itemWidth);
    });
    
    // 前へボタン
    prevBtn.addEventListener('click', function() {
        if (currentIndex > 0) {
            currentIndex--;
            updateSliderPosition();
        }
    });
    
    // 次へボタン
    nextBtn.addEventListener('click', function() {
        if (currentIndex < items.length - visibleItems) {
            currentIndex++;
            updateSliderPosition();
        }
    });
    
    // スライダー位置の更新
    function updateSliderPosition() {
        const sliderContent = container.querySelector(':scope > div'); // .slider, .character-cards または .news-container
        if (sliderContent) {
            const offset = -currentIndex * itemWidth;
            sliderContent.style.transform = `translateX(${offset}px)`;
        }
    }
    
    // トップスライダーの場合は自動再生
    if (containerSelector === '.slider-container') {
        setInterval(function() {
            currentIndex = (currentIndex + 1) % items.length;
            updateSliderPosition();
        }, 5000);
    }
}

// JSONファイルが更新されたときにサイト情報を再読み込みする関数
function reloadSiteData() {
    // トップスライダーの再読み込み
    document.querySelector('.slider').innerHTML = '';
    loadSliderData();
    
    // キャラクターの再読み込み
    document.querySelector('.character-cards').innerHTML = '';
    loadCharacterData();
    
    // グッズの再読み込み
    document.querySelector('.goods-container').innerHTML = '';
    loadGoodsData();
    
    // ニュースの再読み込み
    document.querySelector('.news-container').innerHTML = '';
    loadNewsData();
}
