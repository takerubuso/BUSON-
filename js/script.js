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

            // その他のキャラクター情報を生成
            let otherInfoHTML = '<div class="character-other-info-container">';
            
            // キャラクター情報アイコンの定義
            const infoItems = [
                { key: 'personality', label: '性格', icon: 'images/icons/1.png' },
                { key: 'birthday', label: '誕生日', icon: 'images/icons/2.png' },
                { key: 'debutYear', label: 'デビュー年', icon: 'images/icons/3.png' },
                { key: 'hobbies', label: '趣味', icon: 'images/icons/4.png' },
                { key: 'skills', label: '特技', icon: 'images/icons/5.png' },
                { key: 'favoriteFood', label: '好きな食べ物', icon: 'images/icons/6.png' }
            ];
            
            infoItems.forEach(item => {
                if (character[item.key]) {
                    const value = Array.isArray(character[item.key]) 
                        ? character[item.key].join('、') 
                        : character[item.key];
                    
                    otherInfoHTML += `
                        <div class="info-item">
                            <div class="info-circle" data-info="${item.key}">
                                <img src="${item.icon}" alt="${item.label}" onerror="this.onerror=null; this.style.display='none';">
                                <div class="info-popup">${value}</div>
                            </div>
                            <p class="info-label-text">${item.label}</p>
                        </div>
                    `;
                }
            });
            
            otherInfoHTML += '</div>';

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
                    ${otherInfoHTML}
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
