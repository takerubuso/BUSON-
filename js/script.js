document.addEventListener('DOMContentLoaded', function() {
    // スライダーデータを読み込み
    fetch('data/slider.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('スライダーデータの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
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
        .then(response => {
            if (!response.ok) {
                throw new Error('キャラクターデータの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
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
        .then(response => {
            if (!response.ok) {
                throw new Error('グッズデータの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('グッズデータ取得成功:', data);
            initializeGoods(data);
            setupGoodsFilter(); // フィルター設定を追加
        })
        .catch(error => {
            console.error('グッズデータの読み込みに失敗しました:', error);
            // エラー時にはダミーデータを表示（オプション）
            const dummyData = [
                {
                    "id": 1,
                    "name": "モフタロウ ぬいぐるみ",
                    "image": "images/placeholder.jpg",
                    "price": 2649,
                    "category": "plush",
                    "url": "https://suzuri.jp/buson2025/15723649/acrylic-keychain/50x50mm/clear"
                },
                {
                    "id": 2,
                    "name": "ピンキー アクリルキーホルダー",
                    "image": "images/placeholder.jpg",
                    "price": 800,
                    "category": "collection",
                    "url": "https://booth.pm/"
                },
                {
                    "id": 3,
                    "name": "キャラクター マスキングテープ",
                    "image": "images/placeholder.jpg",
                    "price": 550,
                    "category": "stationary",
                    "url": "https://booth.pm/"
                }
            ];
            initializeGoods(dummyData);
            setupGoodsFilter();
        });

    // 書籍セクションの初期化
    initializeBooks();
    
    // LINEスタンプセクションの初期化
    initializeLineStamps();

    // ニュースデータを読み込み
    fetch('data/news.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('ニュースデータの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('ニュースデータ取得成功:', data);
            // 最新の3つのニュースだけを表示
            const latestNews = data.slice(0, 3);
            initializeNews(latestNews);
        })
        .catch(error => {
            console.error('ニュースデータの読み込みに失敗しました:', error);
            // エラー時にはダミーデータを表示
            const dummyNews = [
                {
                    "id": 1,
                    "date": "2025-04-15",
                    "title": "新キャラクター「ピンキー」登場！",
                    "summary": "宇宙からやってきた不思議な猫型キャラクター「ピンキー」が仲間入り！特設ページでプロフィールを公開中です。",
                    "url": "#"
                },
                {
                    "id": 2,
                    "date": "2025-04-10",
                    "title": "コラボカフェ開催のお知らせ",
                    "summary": "4月20日から5月15日まで、渋谷のカフェ「スイートタイム」にてBUSONスタジオキャラクターズのコラボカフェを開催します！",
                    "url": "#"
                },
                {
                    "id": 3,
                    "date": "2025-04-01",
                    "title": "グッズ新発売のお知らせ",
                    "summary": "人気キャラクター「モフタロウ」のぬいぐるみなど、新グッズが発売開始！BOOTHとBASEにて販売中です。",
                    "url": "#"
                }
            ];
            initializeNews(dummyNews);
        });
        
    // YouTubeデータの初期化
    initializeYouTube();
    
    // 漫画ブログデータの初期化
    initializeMangaBlog();
    
    // モバイルタッチイベントを設定
    setupMobileTouchEvents();
});

// キャラクターモーダルのナビゲーションにタッチイベントを追加
function setupMobileTouchEvents() {
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');
    
    if (prevButton && nextButton) {
        // タッチデバイス用のイベントを追加
        prevButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // クリックイベントをトリガー
            prevButton.click();
        }, {passive: false});
        
        nextButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            // クリックイベントをトリガー
            nextButton.click();
        }, {passive: false});
    }
}

// スライダーの初期化
function initializeSlider(data) {
    const sliderContainer = document.querySelector('.slider-container');
    if (!sliderContainer || !data || data.length === 0) return;

    // スライダー内容をクリア
    const slider = document.querySelector('.slider');
    slider.innerHTML = '';

    // スライドアイテムを全て作成
    data.forEach((item, index) => {
        const sliderItem = document.createElement('div');
        sliderItem.className = 'slider-content';
        
        // 画像を背景として設定
        if (item.image) {
            sliderItem.style.backgroundImage = `url('${item.image}')`;
            sliderItem.style.backgroundSize = 'cover';
            sliderItem.style.backgroundPosition = 'center';
        }
        
        sliderItem.innerHTML = `
            <div class="slider-caption">
                <h3>${item.title}</h3>
                <p>${item.description}</p>
            </div>
        `;
        
        // クリックでリンク先に遷移
        sliderItem.addEventListener('click', function() {
            if (item.url) {
                window.location.href = item.url;
            }
        });
        
        slider.appendChild(sliderItem);
    });

    // スライダーのチラ見せ要素を追加
    const peekLeft = document.createElement('div');
    peekLeft.className = 'slider-peek slider-peek-left';
    sliderContainer.appendChild(peekLeft);
    
    const peekRight = document.createElement('div');
    peekRight.className = 'slider-peek slider-peek-right';
    sliderContainer.appendChild(peekRight);

    // スライダーの操作処理
    let currentIndex = 0;
    const slideWidth = 100; // 100%

    document.querySelector('.slider-next').addEventListener('click', function() {
        currentIndex = (currentIndex + 1) % data.length;
        updateSlider();
    });

    document.querySelector('.slider-prev').addEventListener('click', function() {
        currentIndex = (currentIndex - 1 + data.length) % data.length;
        updateSlider();
    });

    function updateSlider() {
        slider.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // チラ見せ部分を更新
        if (data.length > 1) {
            const prevIndex = (currentIndex - 1 + data.length) % data.length;
            const nextIndex = (currentIndex + 1) % data.length;
            
            peekLeft.style.backgroundImage = `url('${data[prevIndex].image}')`;
            peekLeft.style.backgroundSize = 'cover';
            peekLeft.style.backgroundPosition = 'center';
            
            peekRight.style.backgroundImage = `url('${data[nextIndex].image}')`;
            peekRight.style.backgroundSize = 'cover';
            peekRight.style.backgroundPosition = 'center';
        }
    }
    
    // 初期表示のセットアップ
    updateSlider();
    
    // 自動スライド（5秒間隔）
    if (data.length > 1) {
        setInterval(() => {
            currentIndex = (currentIndex + 1) % data.length;
            updateSlider();
        }, 5000);
    }
}

// キャラクターの初期化関数を修正（カテゴリ属性を追加）
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
        
        // カテゴリー属性を追加
        card.setAttribute('data-category', character.category || 'all');
        
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
    
    // フィルター機能を初期化
    setupCharacterFilter();
}

// キャラクターフィルター機能を追加
function setupCharacterFilter() {
    const filterButtons = document.querySelectorAll('.character-filter .filter-button');
    const characterCards = document.querySelectorAll('.character-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブボタンのスタイルを切り替え
            document.querySelector('.character-filter .filter-button.active').classList.remove('active');
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            characterCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// キャラクターモーダルの設定関数を修正（左右移動機能を追加）
function setupCharacterModal(characters) {
    const modal = document.getElementById('characterModal');
    const modalContent = document.getElementById('modalCharacterContent');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');

    // 現在表示中のキャラクターインデックスを追跡
    let currentCharacterIndex = 0;

    // キャラクターカードにクリックイベントを追加
    const characterCards = document.querySelectorAll('.character-card');

    characterCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const characterName = this.getAttribute('data-character');
            // クリックされたカードのインデックスを保存
            currentCharacterIndex = characters.findIndex(char => char.name === characterName);
            showCharacterModal(currentCharacterIndex, characters);
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

    // 前のキャラクターボタン
    prevButton.addEventListener('click', function(e) {
        e.stopPropagation(); // イベントの伝播を停止
        currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
        showCharacterModal(currentCharacterIndex, characters);
    });

    // 次のキャラクターボタン
    nextButton.addEventListener('click', function(e) {
        e.stopPropagation(); // イベントの伝播を停止
        currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
        showCharacterModal(currentCharacterIndex, characters);
    });

    // キャラクターモーダルを表示する関数（インデックスベースに変更）
    function showCharacterModal(index, characters) {
        const character = characters[index];

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

// グッズの初期化を修正
function initializeGoods(data) {
    const goodsContainer = document.querySelector('.goods-container');
    if (!goodsContainer || !data || data.length === 0) {
        console.error('グッズデータまたはコンテナが見つかりません');
        return;
    }

    // グッズカードをクリア
    goodsContainer.innerHTML = '';
    
    console.log('グッズデータを読み込みました:', data);

    // グッズカードを生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        // カテゴリ属性を追加
        card.setAttribute('data-category', item.category || 'all');

        // 画像パスの生成 - フォールバック画像を設定
        // 存在しないパスの場合はプレースホルダー画像を使用
        const imagePath = item.image || 'images/placeholder.jpg';
        
        // デフォルト画像のパスを調整
        const fallbackImagePath = 'images/placeholder.jpg';
        
        console.log('グッズ画像パス:', imagePath);

        // 価格をフォーマット
        const formattedPrice = item.price.toLocaleString() + '円（税込）';

        card.innerHTML = `
            <div class="goods-img">
                <img src="${imagePath}" alt="${item.name}" 
                     onerror="this.onerror=null; this.src='${fallbackImagePath}';">
            </div>
            <div class="goods-info">
                <h3>${item.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${item.url}" class="button" target="_blank">詳しく見る</a>
            </div>
        `;
        goodsContainer.appendChild(card);
    });
}

// グッズのフィルタリング機能を追加
function setupGoodsFilter() {
    const filterButtons = document.querySelectorAll('.goods-filter .filter-button');
    const goodsCards = document.querySelectorAll('.goods-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブボタンのスタイルを切り替え
            document.querySelector('.goods-filter .filter-button.active').classList.remove('active');
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            goodsCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// 書籍セクションの初期化を修正
function initializeBooks() {
    fetch('data/books.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('書籍データの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('書籍データ取得成功:', data);
            displayBooks(data);
            setupBooksFilter();
        })
        .catch(error => {
            console.error('書籍データの読み込みに失敗しました:', error);
            // エラー時には静的データを表示
            const staticBooksData = [
                {
                    id: 1,
                    name: "しきぶちゃんの日常",
                    image: "images/books/book1.jpg",
                    price: 1500,
                    category: "paper",
                    url: "https://example.com/book1"
                },
                {
                    id: 2,
                    name: "ピンキーの不思議な冒険",
                    image: "images/books/book2.jpg",
                    price: 1200,
                    category: "paper",
                    url: "https://example.com/book2"
                },
                {
                    id: 3,
                    name: "クマゴローと森のともだち",
                    image: "images/books/book3.jpg",
                    price: 1300,
                    category: "ebook",
                    url: "https://example.com/book3"
                },
                {
                    id: 4,
                    name: "BUSON STUDIO キャラクターコレクション",
                    image: "images/books/book4.jpg",
                    price: 2500,
                    category: "ebook",
                    url: "https://example.com/book4"
                }
            ];
            displayBooks(staticBooksData);
            setupBooksFilter();
        });
}

function displayBooks(data) {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) {
        console.error('書籍コンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    booksContainer.innerHTML = '';
    
    // 書籍カードを生成
    data.forEach(book => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        card.setAttribute('data-category', book.category || 'all');
        
        // 価格をフォーマット
        const formattedPrice = book.price.toLocaleString() + '円（税込）';
        
        card.innerHTML = `
            <div class="goods-img">
                <img src="${book.image}" alt="${book.name}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="goods-info">
                <h3>${book.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${book.url}" class="button" target="_blank">詳しく見る</a>
            </div>
        `;
        booksContainer.appendChild(card);
    });
}

function setupBooksFilter() {
    const filterButtons = document.querySelectorAll('.books-filter .filter-button');
    const bookCards = document.querySelectorAll('#books-container .goods-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブなボタンのスタイルを切り替え
            document.querySelector('.books-filter .filter-button.active').classList.remove('active');
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            bookCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// LINEスタンプの初期化
function initializeLineStamps() {
    fetch('data/line.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('LINEスタンプデータの読み込みに失敗: ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            console.log('LINEスタンプデータ取得成功:', data);
            displayLineStamps(data);
            setupStampsFilter();
        })
        .catch(error => {
            console.error('LINEスタンプデータの読み込みに失敗しました:', error);
            // エラー時には静的データを表示
            const staticStampsData = [
                {
                    id: 1,
                    name: "しきぶちゃんスタンプ 基本セット",
                    image: "images/stamps/stamp1.jpg",
                    price: 120,
                    category: "stamp",
                    url: "https://line.me/S/sticker/"
                },
                {
                    id: 2,
                    name: "しきぶちゃん 日常会話セット",
                    image: "images/stamps/stamp2.jpg",
                    price: 120,
                    category: "stamp",
                    url: "https://line.me/S/sticker/"
                },
                {
                    id: 3,
                    name: "ピンキー スタンプ",
                    image: "images/stamps/stamp3.jpg",
                    price: 120,
                    category: "emoji",
                    url: "https://line.me/S/sticker/"
                },
                {
                    id: 4,
                    name: "クマゴロー＆ポポタン スタンプ",
                    image: "images/stamps/stamp4.jpg",
                    price: 120,
                    category: "theme",
                    url: "https://line.me/S/sticker/"
                }
            ];
            displayLineStamps(staticStampsData);
            setupStampsFilter();
        });
}

function displayLineStamps(data) {
    const stampsContainer = document.getElementById('stamps-container');
    if (!stampsContainer) {
        console.error('LINEスタンプコンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    stampsContainer.innerHTML = '';
    
    // スタンプカードを生成
    data.forEach(stamp => {
        const card = document.createElement('div');
        card.className = 'stamp-card';
        card.setAttribute('data-category', stamp.category || 'all');
        
        // 価格をフォーマット
        const formattedPrice = stamp.price + '円';
        
        card.innerHTML = `
            <div class="stamp-img">
                <img src="${stamp.image}" alt="${stamp.name}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="stamp-info">
                <h3>${stamp.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${stamp.url}" class="button" target="_blank">詳しく見る</a>
            </div>
        `;
        stampsContainer.appendChild(card);
    });
}

// 修正したLINEスタンプフィルター機能
function setupStampsFilter() {
    const filterButtons = document.querySelectorAll('.stamps-filter .filter-button');
    const stampCards = document.querySelectorAll('#stamps-container .stamp-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // すべてのボタンのactiveクラスを削除
            filterButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // クリックされたボタンにactiveクラスを追加
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            stampCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// ニュースの初期化 - 既存の関数を修正
function initializeNews(data) {
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer || !data || data.length === 0) {
        console.error('ニュースデータまたはコンテナが見つかりません');
        return;
    }

    // ニュースコンテナをクリア
    newsContainer.innerHTML = '';
    
    console.log('ニュースデータを表示します:', data);

    // ニュースアイテムを生成
    data.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        // 日付フォーマットを変換（YYYY-MM-DD → YYYY.MM.DD）
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

// YouTube動画を表示する関数（APIを使わない簡易版）
function initializeYouTube() {
    displaySimpleYouTubeVideos();
}

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

// 漫画ブログのカードデザインで表示する関数（1つだけ表示）
function initializeMangaBlog() {
    displayMangaBlogCards();
}

function displayMangaBlogCards() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 固定の漫画ブログデータ（1つだけ使用）
    const mangaData = {
        title: "BUSONコンテンツ",
        date: "2025-04-15",
        image: "images/mangablog/header.PNG",
        summary: "ほぼ毎日漫画更新中!!",
        url: "https://buson.blog.jp"
    };
    
    // 漫画ブログカードを生成（1つだけ）
    const formattedDate = mangaData.date.replace(/-/g, '.');
    const card = document.createElement('div');
    card.className = 'manga-card';
    
    card.innerHTML = `
        <a href="${mangaData.url}" target="_blank" class="manga-link">
            <div class="manga-img">
                <img src="${mangaData.image}" alt="${mangaData.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="manga-info">
                <p class="date">${formattedDate}</p>
                <h3>${mangaData.title}</h3>
                <p>${mangaData.summary}</p>
            </div>
        </a>
    `;
    
    mangaContainer.appendChild(card);
}
        })
        .catch(error => {
            console.error('漫画ブログデータの読み込みに失敗しました:', error);
            // エラー時には単一のデフォルトカードを表示
            const mangaData = {
                title: "BUSONコンテンツ",
                date: "2025-04-15",
                image: "images/mangablog/header.PNG",
                summary: "ほぼ毎日漫画更新中!!",
                url: "https://buson.blog.jp"
            };
            
            // 漫画ブログカードを生成（1つだけ）
            const formattedDate = mangaData.date.replace(/-/g, '.');
            const card = document.createElement('div');
            card.className = 'manga-card';
            
            card.innerHTML = `
                <a href="${mangaData.url}" target="_blank" class="manga-link">
                    <div class="manga-img">
                        <img src="${mangaData.image}" alt="${mangaData.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                    </div>
                    <div class="manga-info">
                        <p class="date">${formattedDate}</p>
                        <h3>${mangaData.title}</h3>
                        <p>${mangaData.summary}</p>
                    </div>
                </a>
            `;
            
            mangaContainer.appendChild(card);
        });
}
// ページ読み込み完了後にニュースを確認し、必要なら強制表示
window.addEventListener('load', function() {
    // ニュースセクションを確認
    const newsContainer = document.querySelector('.news-container');
    if (newsContainer && newsContainer.children.length === 0) {
        console.log('ニュースが読み込まれていないため、バックアップデータを表示します');
        
        // バックアップニュースデータ
        const backupNews = [
            {
                id: 1,
                date: "2025-04-15",
                title: "新キャラクター「ピンキー」登場！",
                summary: "宇宙からやってきた不思議な猫型キャラクター「ピンキー」が仲間入り！特設ページでプロフィールを公開中です。",
                url: "#"
            },
            {
                id: 2,
                date: "2025-04-10",
                title: "コラボカフェ開催のお知らせ",
                summary: "4月20日から5月15日まで、渋谷のカフェ「スイートタイム」にてBUSONスタジオキャラクターズのコラボカフェを開催します！",
                url: "#"
            },
            {
                id: 3,
                date: "2025-04-01",
                title: "グッズ新発売のお知らせ",
                summary: "人気キャラクター「モフタロウ」のぬいぐるみなど、新グッズが発売開始！BOOTHとBASEにて販売中です。",
                url: "#"
            }
        ];
        
        // 強制的に表示
        initializeNews(backupNews);
    }
});
