document.addEventListener('DOMContentLoaded', function() {
    // スライダーデータを読み込み
    fetch('data/slider.json')
        .then(response => response.json())
        .then(data => {
            initializeSlider(data);
        })
        .catch(error => {
            console.error('スライダーデータの読み込みに失敗しました:', error);
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
        });

    // グッズデータを読み込み
    fetch('data/goods.json')
        .then(response => response.json())
        .then(data => {
            initializeGoods(data);
        })
        .catch(error => {
            console.error('グッズデータの読み込みに失敗しました:', error);
        });

    // ニュースデータを読み込み
    fetch('data/news.json')
        .then(response => response.json())
        .then(data => {
            initializeNews(data);
        })
        .catch(error => {
            console.error('ニュースデータの読み込みに失敗しました:', error);
        });

    // ドロップダウンメニューの動作（フッター用の追加コード）
    const dropdownTitles = document.querySelectorAll('.dropdown-title');

    dropdownTitles.forEach(title => {
        title.addEventListener('click', function() {
            const list = this.nextElementSibling;
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        });
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
        card.innerHTML = `
            <div class="character-img">${character.name}</div>
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
            // ソーシャルリンクを生成
            const socialLinksHTML = character.socialLinks && character.socialLinks.length > 0
                ? character.socialLinks.map(link =>
                    `<a href="${link.url}" target="_blank">${link.name}</a>`
                ).join('')
                : '';

            // その他のキャラクター情報を生成
            const otherInfoHTML = `
                <div class="character-other-info">
                    <div class="info-item">
                        <span class="info-label" data-info="personality">性格</span>
                        <div class="info-popup" id="personality-popup">${character.personality}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label" data-info="birthday">誕生日</span>
                        <div class="info-popup" id="birthday-popup">${character.birthday}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label" data-info="debutYear">デビュー年</span>
                        <div class="info-popup" id="debutYear-popup">${character.debutYear}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label" data-info="hobbies">趣味</span>
                        <div class="info-popup" id="hobbies-popup">${character.hobbies.join(', ')}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label" data-info="skills">特技</span>
                        <div class="info-popup" id="skills-popup">${character.skills.join(', ')}</div>
                    </div>
                    <div class="info-item">
                        <span class="info-label" data-info="favoriteFood">好きな食べ物</span>
                        <div class="info-popup" id="favoriteFood-popup">${character.favoriteFood}</div>
                    </div>
                </div>
            `;

            // モーダル内容を生成
            modalContent.innerHTML = `
                <div class="character-profile">
                    <div class="character-image">
                        ${character.image ? `<img src="${character.image}" alt="${character.name}">` : character.name}
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
            const infoLabels = document.querySelectorAll('.info-label');
            infoLabels.forEach(label => {
                label.addEventListener('click', function() {
                    const infoType = this.getAttribute('data-info');
                    const popup = document.getElementById(`${infoType}-popup`);
                    if (popup) {
                        // 既存のポップアップをすべて非表示にする
                        document.querySelectorAll('.info-popup').forEach(p => {
                            if (p !== popup) {
                                p.style.display = 'none';
                            }
                        });
                        // クリックされたポップアップの表示/非表示を切り替える
                        popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
                    }
                });
            });

            // モーダルを表示
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // 背景のスクロールを防止
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

        // 価格をフォーマット
        const formattedPrice = item.price.toLocaleString() + '円';

        card.innerHTML = `
            <div class="goods-img">${item.name}</div>
            <div class="goods-info">
                <h3>${item.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${item.url}" class="button">購入する</a>
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
