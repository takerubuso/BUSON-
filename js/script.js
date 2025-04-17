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
                    "url": "https://suzuri.jp/buson2025/15723649/acrylic-keychain/50x50mm/clear"
                },
                {
                    "id": 2,
                    "name": "ピンキー アクリルキーホルダー",
                    "image": "images/placeholder.jpg",
                    "price": 800,
                    "url": "https://booth.pm/"
                },
                {
                    "id": 3,
                    "name": "キャラクター マスキングテープ",
                    "image": "images/placeholder.jpg",
                    "price": 550,
                    "url": "https://booth.pm/"
                }
            ];
            initializeGoods(dummyData);
        });

    // 書籍セクションの初期化
    initializeBooks();

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
        sliderItem.style.cursor = 'pointer'; // クリック可能な見た目にする
    }
    
    sliderItem.innerHTML = `
        <div class="slider-caption">
            <h3>${data[0].title}</h3>
            <p>${data[0].description}</p>
        </div>
    `;
    
    // スライダーのリンク先を設定
    sliderItem.addEventListener('click', function() {
        if (data[currentIndex].url) {
            window.location.href = data[currentIndex].url;
        }
    });
    
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
        
        // クリックイベントを更新
        sliderItem.onclick = function() {
            if (data[currentIndex].url) {
                window.location.href = data[currentIndex].url;
            }
        };
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

// 書籍セクションの初期化を修正
function initializeBooks() {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) {
        console.error('書籍コンテナが見つかりません');
        return;
    }
    
    // プレースホルダー画像のパス
    const placeholderImage = 'images/placeholder.jpg';
    
    // サンプル書籍データ
    const booksData = [
        {
            id: 1,
            name: "しきぶちゃんの日常",
            image: "images/books/book1.jpg",
            price: 1500,
            url: "https://example.com/book1"
        },
        {
            id: 2,
            name: "ピンキーの不思議な冒険",
            image: "images/books/book2.jpg",
            price: 1200,
            url: "https://example.com/book2"
        },
        {
            id: 3,
            name: "クマゴローと森のともだち",
            image: "images/books/book3.jpg",
            price: 1300,
            url: "https://example.com/book3"
        },
        {
            id: 4,
            name: "BUSON STUDIO キャラクターコレクション",
            image: "images/books/book4.jpg",
            price: 2500,
            url: "https://example.com/book4"
        }
    ];
    
    // 書籍カードを生成
    booksData.forEach(book => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        
        // 価格をフォーマット
        const formattedPrice = book.price.toLocaleString() + '円（税込）';
        
        card.innerHTML = `
            <div class="goods-img">
                <img src="${book.image}" alt="${book.name}" 
                     onerror="this.onerror=null; this.src='${placeholderImage}';">
            </div>
            <div class="goods-info">
                <h3>${book.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${book.url}" class="button" target="_blank">詳しく見る</a>
            </div>
        `;
        booksContainer.appendChild(card);
    });
    
    console.log('書籍を表示しました');
}
