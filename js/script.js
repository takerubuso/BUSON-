document.addEventListener('DOMContentLoaded', function() {
    // フォーカス可能要素のエラーを回避するためのコード
    const sliderElements = document.querySelectorAll('.slider-content, .slider-prev, .slider-next');
    sliderElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // プレビュー要素にもtabindex属性を追加
    const previewElements = document.querySelectorAll('.slider-preview-left, .slider-preview-right');
    previewElements.forEach(element => {
        if (!element.hasAttribute('tabindex')) {
            element.setAttribute('tabindex', '0');
        }
    });
    
    // エラーハンドリングの強化
    window.addEventListener('error', function(event) {
        console.warn('エラーが発生しましたが、処理を継続します:', event.error);
        // エラーの伝播を停止
        event.stopPropagation();
        // デフォルトのエラーハンドリングを抑制
        event.preventDefault();
    }, true);
    
    // フォームフィールドとラベルの修正
    const formFields = document.querySelectorAll('input, textarea, select');
    formFields.forEach((field, index) => {
        if (!field.id) {
            field.id = `field-${index}`;
        }
        if (!field.name) {
            field.name = `field-${index}`;
        }
    });
    
    // ラベルのfor属性を修正
    const labels = document.querySelectorAll('label[for]');
    labels.forEach(label => {
        const forValue = label.getAttribute('for');
        const targetElement = document.getElementById(forValue);
        if (!targetElement) {
            // for属性が指す要素が存在しない場合、修正または削除
            const nearestField = label.nextElementSibling;
            if (nearestField && (nearestField.tagName === 'INPUT' || nearestField.tagName === 'TEXTAREA' || nearestField.tagName === 'SELECT')) {
                if (!nearestField.id) {
                    nearestField.id = `field-${forValue}`;
                }
                label.setAttribute('for', nearestField.id);
            } else {
                // 関連するフィールドが見つからない場合、for属性を削除
                label.removeAttribute('for');
            }
        }
    });
    
    // モバイルメニューの制御
    setupMobileMenu();
    
    // スライダーデータを読み込み
    loadData('data/slider.json', [
        {
            "image": "images/placeholder.jpg",
            "title": "新キャラクター「ピンキー」登場！",
            "description": "宇宙からやってきた不思議な猫型キャラクター",
            "url": "#characters"
        }
    ]).then(data => {
        initializeEnhancedSlider(data);
    });

    // キャラクターデータを読み込み
    loadData('data/characters.json', []).then(data => {
        if (data && data.length > 0) {
            initializeCharacters(data);
            setupCharacterModal(data); // モーダル設定を追加
        }
    });

    // グッズデータを読み込み
    loadData('data/goods.json', [
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
    ]).then(data => {
        initializeGoods(data);
        setupGoodsFilter();
    });

    // 書籍セクションの初期化
    initializeBooks();
    
    // LINEスタンプセクションの初期化
    initializeLineStamps();

    // ニュースデータを読み込み
    loadData('data/news.json', [
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
    ]).then(data => {
        // 最新の3つのニュースだけを表示
        const latestNews = data.slice(0, 3);
        initializeNews(latestNews);
    });
        
    // YouTubeデータの初期化
    initializeYouTube();
    
    // 漫画ブログデータの初期化
    initializeMangaBlog();
    
    // モバイルタッチイベントを設定
    setupMobileTouchEvents();
    
    // 画像の遅延読み込み設定
    setupLazyLoading();
});

// データ読み込み用の汎用関数
async function loadData(url, defaultData = []) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`データの読み込みに失敗: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`${url}の読み込みに失敗しました:`, error);
        return defaultData;
    }
}

// モバイルメニューの制御
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuButton && navMenu) {
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
}

// 画像の遅延読み込み
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        // 対象画像に適用
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // IntersectionObserverが使えない環境では通常の遅延読み込み
        const lazyImages = document.querySelectorAll('img[data-src]');
        window.addEventListener('scroll', function() {
            lazyImages.forEach(img => {
                if (isInViewport(img)) {
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                }
            });
        });
    }
}

// 要素が表示領域内かチェック
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 改良版スライダー初期化関数 - 修正版
function initializeEnhancedSlider(data) {
    console.log('スライダーデータを初期化しています:', data);
    
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const previewLeft = document.querySelector('.slider-preview-left .slider-preview-inner');
    const previewRight = document.querySelector('.slider-preview-right .slider-preview-inner');
    const prevButton = document.querySelector('.slider-prev');
    const nextButton = document.querySelector('.slider-next');
    
    // 要素チェック
    if (!sliderContainer || !slider) {
        console.error('スライダーコンテナまたはスライダー要素が見つかりません');
        return;
    }
    
    // データチェック
    if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('スライダーデータが無効です', data);
        data = [
            {
                "image": "images/placeholder.jpg",
                "title": "サンプルスライド",
                "description": "スライダーデータが読み込めませんでした",
                "url": "#"
            }
        ];
    }
    
    // スライダー内容をクリア
    slider.innerHTML = '';
    
    // スライドの複製を含むデータを準備（無限ループのため）
    let extendedData = [];
    
    // データが2つ以上ある場合のみループ処理を実装
    if (data.length > 1) {
        // 最後のアイテムをコピーして最初に追加
        extendedData.push({...data[data.length - 1]});
        // 元のデータをすべて追加
        extendedData = extendedData.concat(data);
        // 最初のアイテムをコピーして最後に追加
        extendedData.push({...data[0]});
    } else {
        extendedData = [...data]; // データ配列のコピーを作成
    }
    
    // スライドアイテムを作成
    extendedData.forEach((item, index) => {
        const sliderItem = document.createElement('div');
        sliderItem.className = 'slider-content';
        sliderItem.setAttribute('tabindex', '0');
        sliderItem.setAttribute('aria-label', `スライド ${index + 1}: ${item.title || ''}`);
        
        // 画像を背景として設定
        if (item.image) {
            sliderItem.style.backgroundImage = `url('${item.image}')`;
        } else {
            sliderItem.style.backgroundColor = '#ffd1dc'; // 画像がない場合はピンク色の背景
        }
        
        sliderItem.innerHTML = `
            <div class="slider-caption">
                <h3>${item.title || ''}</h3>
                <p>${item.description || ''}</p>
            </div>
        `;
        
        // クリックでリンク先に遷移
        if (item.url) {
            sliderItem.addEventListener('click', function() {
                window.location.href = item.url;
            });
            
            // キーボードアクセシビリティ
            sliderItem.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.location.href = item.url;
                }
            });
        }
        
        slider.appendChild(sliderItem);
    });
    
    // スライダーの操作処理
    let currentIndex = data.length > 1 ? 1 : 0; // 複数スライドの場合は最初のクローンの次（実際の最初のスライド）
    const slideWidth = 100; // 100%
    
    // 初期化時にトランジションなしで位置を設定
    slider.style.transition = 'none';
    slider.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    
    // 少し遅延してからトランジションを戻す
    setTimeout(() => {
        slider.style.transition = 'transform 0.5s ease';
    }, 50);
    
    // スライダーを更新する関数
    function updateSlider(withTransition = true) {
        if (withTransition) {
            slider.style.transition = 'transform 0.5s ease';
        } else {
            slider.style.transition = 'none';
        }
        slider.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        
        // プレビューを更新
        if (data.length > 1) {
            updatePreviews();
        }
    }
    
    // 前後の画像プレビューを更新する関数
    function updatePreviews() {
        // データが1つしかない場合はプレビューを非表示
        if (data.length <= 1) {
            const leftPreviewContainer = document.querySelector('.slider-preview-left');
            const rightPreviewContainer = document.querySelector('.slider-preview-right');
            if (leftPreviewContainer) leftPreviewContainer.style.display = 'none';
            if (rightPreviewContainer) rightPreviewContainer.style.display = 'none';
            return;
        }
        
        // 実際のデータのインデックスを計算
        let realIndex = currentIndex;
        if (realIndex <= 0) realIndex = data.length; // 最初のクローンの場合
        if (realIndex > data.length) realIndex = 1; // 最後のクローンの場合
        realIndex = (realIndex - 1) % data.length; // 0ベースのインデックスに変換
        
        const prevIndex = (realIndex - 1 + data.length) % data.length;
        const nextIndex = (realIndex + 1) % data.length;
        
        // プレビュー画像を設定
        if (previewLeft) {
            previewLeft.style.backgroundImage = `url('${data[prevIndex].image || 'images/placeholder.jpg'}')`;
            
            // 前のスライドに移動するクリックイベント
            const previewLeftContainer = document.querySelector('.slider-preview-left');
            if (previewLeftContainer) {
                previewLeftContainer.onclick = function() {
                    prevSlide();
                };
            }
        }
        
        if (previewRight) {
            previewRight.style.backgroundImage = `url('${data[nextIndex].image || 'images/placeholder.jpg'}')`;
            
            // 次のスライドに移動するクリックイベント
            const previewRightContainer = document.querySelector('.slider-preview-right');
            if (previewRightContainer) {
                previewRightContainer.onclick = function() {
                    nextSlide();
                };
            }
        }
    }
    
    // 次のスライドに移動
    function nextSlide() {
        if (data.length <= 1) return; // 1つしかない場合は何もしない
        
        currentIndex++;
        updateSlider();
        
        // 最後のクローンに到達した場合
        if (currentIndex >= extendedData.length - 1) {
            // トランジション完了後に最初のスライドに瞬時に戻す
            setTimeout(() => {
                currentIndex = 1;
                updateSlider(false);
            }, 500);
        }
    }
    
    // 前のスライドに移動
    function prevSlide() {
        if (data.length <= 1) return; // 1つしかない場合は何もしない
        
        currentIndex--;
        updateSlider();
        
        // 最初のクローンに到達した場合
        if (currentIndex <= 0) {
            // トランジション完了後に最後のスライドに瞬時に戻す
            setTimeout(() => {
                currentIndex = extendedData.length - 2;
                updateSlider(false);
            }, 500);
        }
    }
    
    // 矢印ボタンのCSSを修正
    if (prevButton && nextButton) {
        // 左右の余白を調整
        prevButton.style.left = '15px';
        nextButton.style.right = '15px';
        
        // z-indexを上げて最前面に
        prevButton.style.zIndex = '100';
        nextButton.style.zIndex = '100';
    }
    
    // 矢印ボタンのクリックイベント
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // イベントの伝播を停止
            prevSlide();
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // イベントの伝播を停止
            nextSlide();
        });
    }
    
    // 初期表示
    updateSlider(false);
    
    // 自動スライド（5秒間隔）- 複数スライドがある場合のみ
    let autoSlideInterval;
    
    function startAutoSlide() {
        if (data.length > 1) {
            autoSlideInterval = setInterval(() => {
                nextSlide();
            }, 5000);
        }
    }
    
    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }
    
    // 自動スライドを開始
    startAutoSlide();
    
    // スライダーにマウスが乗った時は自動スライドを一時停止
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    
    // スライダーからマウスが離れた時は自動スライドを再開
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    
    // タッチイベントにも対応
    let touchStartX = 0;
    let touchEndX = 0;
    
    sliderContainer.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoSlide();
    }, { passive: true });
    
    sliderContainer.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoSlide();
    }, { passive: true });
    
    function handleSwipe() {
        const SWIPE_THRESHOLD = 50;
        if (touchEndX < touchStartX - SWIPE_THRESHOLD) {
            nextSlide(); // 左にスワイプ -> 次のスライド
        } else if (touchEndX > touchStartX + SWIPE_THRESHOLD) {
            prevSlide(); // 右にスワイプ -> 前のスライド
        }
    }
    
    // キーボードナビゲーション
    sliderContainer.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // 初期の前後プレビュー表示
    if (data.length > 1) {
        updatePreviews();
    }
    
    // レスポンシブ対応（スマホサイズでプレビュー非表示）
    function updateResponsiveLayout() {
        const width = window.innerWidth;
        const previewContainers = document.querySelectorAll('.slider-preview-container');
        
        previewContainers.forEach(container => {
            if (width <= 480) {
                container.style.display = 'none'; // スマホではプレビュー非表示
            } else {
                container.style.display = 'flex'; // それ以外では表示
            }
        });
    }
    
    // 初期表示時とリサイズ時にレイアウト更新
    updateResponsiveLayout();
    window.addEventListener('resize', updateResponsiveLayout);
    
    // デバッグ情報
    console.log('スライダー初期化完了:', {
        スライド数: data.length,
        拡張スライド数: extendedData.length,
        現在のインデックス: currentIndex
    });
}

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
        card.setAttribute('tabindex', '0'); // タブフォーカス可能に
        
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
        
        // キーボードアクセシビリティ
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
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

    // ESCキーでモーダルを閉じる
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
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
                        <div class="info-circle" data-info="${iconInfo.key}" tabindex="0">
                            <img src="${iconInfo.icon}" alt="${iconInfo.label}" onerror="this.onerror=null; this.style.display='none';">
                            <div class="info-popup" role="tooltip">${value}</div>
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
                // クリックでポップアップを表示
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
                
                // キーボードアクセシビリティ
                circle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });

            // モーダルを表示
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // フォーカスを閉じるボタンに設定（キーボードナビゲーション用）
            closeButton.focus();
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
        
        // 価格をフォーマット - カンマなしの表示に修正
        const formattedPrice = item.price + '円（税込）';

        card.innerHTML = `
            <div class="goods-img">
                <img data-src="${imagePath}" src="${fallbackImagePath}" alt="${item.name}" 
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
    
    // 遅延読み込みを設定
    setupLazyLoading();
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
    loadData('data/books.json', [
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
    ]).then(data => {
        displayBooks(data);
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
        
        // 価格をフォーマット - カンマなしの表示に修正
        const formattedPrice = book.price + '円（税込）';
        
        card.innerHTML = `
            <div class="goods-img">
                <img data-src="${book.image}" src="images/placeholder.jpg" alt="${book.name}" 
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
    
    // 遅延読み込みを設定
    setupLazyLoading();
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
    loadData('data/line.json', [
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
    ]).then(data => {
        displayLineStamps(data);
        setupStampsFilter();
        // 画面サイズに応じたグリッドレイアウトの設定
        updateGridLayout();
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
                <img data-src="${stamp.image}" src="images/placeholder.jpg" alt="${stamp.name}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="stamp-info">
                <h3 title="${stamp.name}">${stamp.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${stamp.url}" class="button" target="_blank">詳しく見る</a>
            </div>
        `;
        stampsContainer.appendChild(card);
    });
    
    // 遅延読み込みを設定
    setupLazyLoading();
}

// 画面サイズに応じてグリッドレイアウトを更新
function updateGridLayout() {
    const stampsContainer = document.getElementById('stamps-container');
    if (!stampsContainer) return;
    
    const width = window.innerWidth;
    
    if (width <= 480) {
        // スマホサイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
    } else if (width <= 768) {
        // タブレットサイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
    } else {
        // PC/大画面サイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
}

// LINEスタンプフィルター機能
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

// リサイズ時にグリッドレイアウトを更新
window.addEventListener('resize', function() {
    updateGridLayout();
});

// ニュースの初期化
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

// YouTube動画を表示する関数
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

// 漫画ブログのカードデザインで表示する関数（画像とテキストのみ表示）
function displayMangaBlogCards() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 漫画ブログデータ（画像とテキスト）
    const mangaData = {
        image: "images/mangablog/header.PNG",
        title: "BUSONコンテンツ",
        description: "ほぼ毎日漫画更新中!!",
        url: "https://buson.blog.jp"
    };
    
    // 漫画ブログカードを生成（シンプルデザイン）
    const card = document.createElement('div');
    card.className = 'manga-card simple-design';
    
    card.innerHTML = `
        <a href="${mangaData.url}" target="_blank" class="manga-link">
            <div class="manga-img full-card">
                <img data-src="${mangaData.image}" src="images/placeholder.jpg" alt="${mangaData.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="manga-content">
                <h3>${mangaData.title}</h3>
                <p>${mangaData.description}</p>
            </div>
        </a>
    `;
    
    mangaContainer.appendChild(card);
    
    // 遅延読み込みを設定
    setupLazyLoading();
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
