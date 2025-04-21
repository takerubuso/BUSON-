document.addEventListener('DOMContentLoaded', function() {
    // デバッグ情報を表示
    console.log('ページ読み込み開始');
    
    // フォーカス可能要素のエラーを回避するためのコード - 修正版
    function setFocusableAttributes() {
        const sliderElements = document.querySelectorAll('.slider-content, .slider-prev, .slider-next');
        if (sliderElements.length > 0) {
            console.log('フォーカス可能要素を設定:', sliderElements.length);
            sliderElements.forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
            });
        } else {
            console.log('フォーカス可能要素が見つかりません');
        }
        
        // プレビュー要素にもtabindex属性を追加
        const previewElements = document.querySelectorAll('.slider-preview-left, .slider-preview-right');
        if (previewElements.length > 0) {
            previewElements.forEach(element => {
                if (!element.hasAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }
            });
        }
    }
    
    // エラーハンドリングの改善 - エラーを表示するようにする
    window.addEventListener('error', function(event) {
        console.error('エラーが発生しました:', event.error);
        // エラーのデバッグ情報を表示するだけにして、伝播は停止しない
        // イベントのデフォルト動作も妨げない
    }, true);
    
    // フォームフィールドとラベルの修正 - IDとnameをきちんと設定
    const formFields = document.querySelectorAll('input, textarea, select');
    console.log('フォームフィールド数:', formFields.length);
    formFields.forEach((field, index) => {
        if (!field.id) {
            const uniqueId = `field-${index}-${Math.random().toString(36).substring(2, 7)}`;
            field.id = uniqueId;
            console.log('フィールドID設定:', uniqueId);
        }
        if (!field.name) {
            field.name = field.id;
        }
    });
    
    // ラベルのfor属性を修正 - 修正版
    const labels = document.querySelectorAll('label[for]');
    console.log('ラベル数:', labels.length);
    labels.forEach(label => {
        const forValue = label.getAttribute('for');
        if (!forValue || forValue === 'FORM_ELEMENT') {
            label.removeAttribute('for'); // 不正な値は一旦削除
            
            // 隣接する入力要素を探す
            const nearestField = label.nextElementSibling;
            if (nearestField && (nearestField.tagName === 'INPUT' || nearestField.tagName === 'TEXTAREA' || nearestField.tagName === 'SELECT')) {
                if (!nearestField.id) {
                    const uniqueId = `field-${Math.random().toString(36).substring(2, 9)}`;
                    nearestField.id = uniqueId;
                }
                label.setAttribute('for', nearestField.id);
                console.log('ラベルfor属性を修正:', nearestField.id);
            }
        } else {
            const targetElement = document.getElementById(forValue);
            if (!targetElement) {
                console.log('ラベルが参照する要素が見つかりません:', forValue);
                label.removeAttribute('for');
            }
        }
    });
    
    // モバイルメニューの制御
    setupMobileMenu();
    
    // スライダーデータを読み込み - パスを修正
    loadData('slider.json', [
        {
            "image": "images/placeholder.jpg",
            "title": "新キャラクター「ピンキー」登場！",
            "description": "宇宙からやってきた不思議な猫型キャラクター",
            "url": "#characters"
        }
    ]).then(data => {
        console.log('スライダーデータ読み込み完了');
        initializeEnhancedSlider(data);
    }).catch(error => {
        console.error('スライダーデータ読み込みエラー:', error);
        // デフォルトデータで初期化
        initializeEnhancedSlider([
            {
                "image": "images/placeholder.jpg",
                "title": "新キャラクター「ピンキー」登場！",
                "description": "宇宙からやってきた不思議な猫型キャラクター",
                "url": "#characters"
            }
        ]);
    });

    // キャラクターデータを読み込み - パスを修正
    loadData('characters.json', []).then(data => {
        console.log('キャラクターデータ読み込み完了:', data.length);
        if (data && data.length > 0) {
            initializeCharacters(data);
            setupCharacterModal(data); // モーダル設定を追加
        } else {
            console.error('キャラクターデータが空です');
        }
    }).catch(error => {
        console.error('キャラクターデータ読み込みエラー:', error);
    });

    // グッズデータを読み込み - パスを修正
    loadData('goods.json', [
        {
            "id": 1,
            "name": "モフタロウ ぬいぐるみ",
            "image": "images/goods/1.png",
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
        console.log('グッズデータ読み込み完了:', data.length);
        initializeGoods(data);
        setupGoodsFilter();
    }).catch(error => {
        console.error('グッズデータ読み込みエラー:', error);
    });

    // 書籍セクションの初期化
    initializeBooks();
    
    // LINEスタンプセクションの初期化
    initializeLineStamps();

    // ニュースデータを読み込み - パスを修正
    loadData('news.json', [
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
        console.log('ニュースデータ読み込み完了:', data.length);
        // 最新の3つのニュースだけを表示
        const latestNews = data.slice(0, 3);
        initializeNews(latestNews);
    }).catch(error => {
        console.error('ニュースデータ読み込みエラー:', error);
    });
        
    // YouTubeデータの初期化
    initializeYouTube();
    
    // 漫画ブログデータの初期化
    initializeMangaBlog();
    
    // モバイルタッチイベントを設定
    setupMobileTouchEvents();
    
    // 画像の遅延読み込み設定
    setupLazyLoading();

    // フォーカス可能要素の設定実行
    setFocusableAttributes();
    
    console.log('ページ初期化完了');
});

// データ読み込み用の汎用関数 - エラーハンドリング改善版
async function loadData(url, defaultData = []) {
    console.log(`${url}の読み込みを開始`);
    
    try {
        // 相対パスをURLオブジェクトに変換して、絶対パスの確認
        const fullUrl = new URL(url, window.location.href);
        console.log('読み込み絶対パス:', fullUrl.href);
        
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error(`データの読み込みに失敗: ${response.status} ${response.statusText}`);
        }
        
        try {
            const data = await response.json();
            console.log(`${url}を正常に読み込みました:`, data);
            return data;
        } catch (parseError) {
            console.error(`${url}のJSONパースに失敗:`, parseError);
            throw new Error(`JSONの解析に失敗: ${parseError.message}`);
        }
    } catch (error) {
        console.error(`${url}の読み込みに失敗:`, error);
        console.log(`デフォルトデータを使用します:`, defaultData);
        return defaultData;
    }
}

// モバイルメニューの制御
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuButton && navMenu) {
        console.log('モバイルメニューを設定');
        mobileMenuButton.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    } else {
        console.log('モバイルメニュー要素が見つかりません');
    }
}

// 画像の遅延読み込み
function setupLazyLoading() {
    console.log('遅延読み込みを設定');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        console.log('画像読み込み:', src);
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        // 対象画像に適用
        const lazyImages = document.querySelectorAll('img[data-src]');
        console.log('遅延読み込み対象画像数:', lazyImages.length);
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // IntersectionObserverが使えない環境では通常の遅延読み込み
        console.log('IntersectionObserverが使用できないため、代替方法を使用');
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
    
    console.log('拡張スライダーデータ:', extendedData.length);
    
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
    console.log('モバイルタッチイベントを設定');
    
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
    } else {
        console.log('モーダルナビゲーションボタンが見つかりません');
    }
}

// キャラクターの初期化関数を修正（カテゴリ属性を追加）
function initializeCharacters(data) {
    console.log('キャラクターデータを初期化します');
    
    const characterContainer = document.querySelector('.character-container');
    if (!characterContainer) {
        console.error('キャラクターコンテナが見つかりません');
        return;
    }
    
    if (!data || data.length === 0) {
        console.error('キャラクターデータが空です');
        return;
    }

    // キャラクターカードをクリア
    characterContainer.innerHTML = '';
    console.log(`${data.length}個のキャラクターカードを作成します`);

    // キャラクターカードを生成
    data.forEach((character, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.setAttribute('data-character', character.name); // data属性を追加
        card.setAttribute('tabindex', '0'); // タブフォーカス可能に
        
        // カテゴリー属性を追加
        card.setAttribute('data-category', character.category || 'all');
        
        // 画像パスの生成
        const imagePath = character.image || 'images/character/1.png';
        console.log(`キャラクター${index+1}の画像パス:`, imagePath);
        
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
    console.log('キャラクター初期化完了');
}

// キャラクターフィルター機能を追加
function setupCharacterFilter() {
    console.log('キャラクターフィルターを設定');
    
    const filterButtons = document.querySelectorAll('.character-filter .filter-button');
    const characterCards = document.querySelectorAll('.character-card');
    
    if (filterButtons.length === 0) {
        console.log('フィルターボタンが見つかりません');
        return;
    }
    
    if (characterCards.length === 0) {
        console.log('キャラクターカードが見つかりません');
        return;
    }
    
    console.log(`${filterButtons.length}個のフィルターボタンと${characterCards.length}個のカードを設定`);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブボタンのスタイルを切り替え
            const activeButton = document.querySelector('.character-filter .filter-button.active');
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            console.log('フィルター適用:', filterValue);
            
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
    
    console.log('キャラクターフィルター設定完了');
}

// キャラクターモーダルの設定関数を修正（左右移動機能を追加）
function setupCharacterModal(characters) {
    console.log('キャラクターモーダルを設定');
    
    const modal = document.getElementById('characterModal');
    const modalContent = document.getElementById('modalCharacterContent');
    const closeButton = document.querySelector('.close-button');
    const prevButton = document.querySelector('.nav-prev');
    const nextButton = document.querySelector('.nav-next');

    if (!modal || !modalContent) {
        console.error('モーダル要素が見つかりません');
        return;
    }

    // 現在表示中のキャラクターインデックスを追跡
    let currentCharacterIndex = 0;

    // キャラクターカードにクリックイベントを追加
    const characterCards = document.querySelectorAll('.character-card');
    console.log(`${characterCards.length}個のキャラクターカードにクリックイベントを設定`);

    characterCards.forEach((card, index) => {
        card.addEventListener('click', function() {
            const characterName = this.getAttribute('data-character');
            console.log('キャラクターカードクリック:', characterName);
            
            // クリックされたカードのインデックスを保存
            currentCharacterIndex = characters.findIndex(char => char.name === characterName);
            if (currentCharacterIndex === -1) {
                currentCharacterIndex = 0;
                console.log('該当するキャラクターが見つからないため、最初のキャラクターを表示');
            }
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
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // スクロールを再有効化
        });
    }

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
    if (prevButton) {
        prevButton.addEventListener('click', function(e) {
            e.stopPropagation(); // イベントの伝播を停止
            currentCharacterIndex = (currentCharacterIndex - 1 + characters.length) % characters.length;
            showCharacterModal(currentCharacterIndex, characters);
        });
    }

    // 次のキャラクターボタン
    if (nextButton) {
        nextButton.addEventListener('click', function(e) {
            e.stopPropagation(); // イベントの伝播を停止
            currentCharacterIndex = (currentCharacterIndex + 1) % characters.length;
            showCharacterModal(currentCharacterIndex, characters);
        });
    }

    // キャラクターモーダルを表示する関数（インデックスベースに変更）
    function showCharacterModal(index, characters) {
        console.log('キャラクターモーダル表示:', index);
        
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
                    <p class="character-description">${character.profile || ''}</p>
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
            if (closeButton) {
                closeButton.focus();
            }
            
            console.log('キャラクターモーダル表示完了:', character.name);
        } else {
            console.error('指定されたインデックスのキャラクターが見つかりません:', index);
        }
    }
    
    console.log('キャラクターモーダル設定完了');
}

// グッズの初期化を修正
function initializeGoods(data) {
    console.log('グッズデータを初期化');
    
    const goodsContainer = document.querySelector('.goods-container');
    if (!goodsContainer) {
        console.error('グッズコンテナが見つかりません');
        return;
    }
    
    if (!data || data.length === 0) {
        console.error('グッズデータが空です');
        return;
    }

    // グッズカードをクリア
    goodsContainer.innerHTML = '';
    
    console.log(`${data.length}個のグッズカードを作成`);

    // グッズカードを生成
    data.forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        // カテゴリ属性を追加
        card.setAttribute('data-category', item.category || 'all');

        // 画像パスの生成
        const imagePath = item.image || 'images/placeholder.jpg';
        console.log(`グッズ${index+1}の画像パス:`, imagePath);
        
        // デフォルト画像のパスを調整
        const fallbackImagePath = 'images/placeholder.jpg';
        
        // 価格をフォーマット
        const formattedPrice = item.price ? item.price + '円（税込）' : '価格未設定';

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
    console.log('グッズ初期化完了');
}

// グッズのフィルタリング機能を追加
function setupGoodsFilter() {
    console.log('グッズフィルターを設定');
    
    const filterButtons = document.querySelectorAll('.goods-filter .filter-button');
    const goodsCards = document.querySelectorAll('.goods-card');
    
    if (filterButtons.length === 0) {
        console.log('グッズフィルターボタンが見つかりません');
        return;
    }
    
    if (goodsCards.length === 0) {
        console.log('グッズカードが見つかりません');
        return;
    }
    
    console.log(`${filterButtons.length}個のフィルターボタンと${goodsCards.length}個のカードを設定`);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブボタンのスタイルを切り替え
            const activeButton = document.querySelector('.goods-filter .filter-button.active');
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            console.log('フィルター適用:', filterValue);
            
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
    
    console.log('グッズフィルター設定完了');
}

// 書籍セクションの初期化を修正
function initializeBooks() {
    console.log('書籍データを初期化');
    
    // パスを修正
    loadData('books.json', [
        {
            id: 1,
            name: "しきぶちゃんの日常",
            image: "images/books/1.jpg",
            price: 1500,
            category: "paper",
            url: "https://example.com/book1"
        },
        {
            id: 2,
            name: "ピンキーの不思議な冒険",
            image: "images/books/2.jpg",
            price: 1200,
            category: "paper",
            url: "https://example.com/book2"
        },
        {
            id: 3,
            name: "クマゴローと森のともだち",
            image: "images/books/4.png",
            price: 1300,
            category: "ebook",
            url: "https://example.com/book3"
        }
    ]).then(data => {
        console.log('書籍データ読み込み完了:', data.length);
        displayBooks(data);
        setupBooksFilter();
    }).catch(error => {
        console.error('書籍データ読み込みエラー:', error);
        // デフォルトデータで初期化
        displayBooks([
            {
                id: 1,
                name: "しきぶちゃんの日常",
                image: "images/books/1.jpg",
                price: 1500,
                category: "paper",
                url: "https://example.com/book1"
            },
            {
                id: 2,
                name: "ピンキーの不思議な冒険",
                image: "images/books/2.jpg",
                price: 1200,
                category: "paper",
                url: "https://example.com/book2"
            },
            {
                id: 3,
                name: "クマゴローと森のともだち",
                image: "images/books/4.png",
                price: 1300,
                category: "ebook",
                url: "https://example.com/book3"
            }
        ]);
        setupBooksFilter();
    });
}

function displayBooks(data) {
    console.log(`${data.length}個の書籍カードを表示`);
    
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) {
        console.error('書籍コンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    booksContainer.innerHTML = '';
    
    // 書籍カードを生成
    data.forEach((book, index) => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        card.setAttribute('data-category', book.category || 'all');
        
        // 画像パスの生成
        const imagePath = book.image || 'images/placeholder.jpg';
        console.log(`書籍${index+1}の画像パス:`, imagePath);
        
        // 価格をフォーマット
        const formattedPrice = book.price ? book.price + '円（税込）' : '価格未設定';
        
        card.innerHTML = `
            <div class="goods-img">
                <img data-src="${imagePath}" src="images/placeholder.jpg" alt="${book.name}" 
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
    console.log('書籍表示完了');
}

function setupBooksFilter() {
    console.log('書籍フィルターを設定');
    
    const filterButtons = document.querySelectorAll('.books-filter .filter-button');
    const bookCards = document.querySelectorAll('#books-container .goods-card');
    
    if (filterButtons.length === 0) {
        console.log('書籍フィルターボタンが見つかりません');
        return;
    }
    
    if (bookCards.length === 0) {
        console.log('書籍カードが見つかりません');
        return;
    }
    
    console.log(`${filterButtons.length}個のフィルターボタンと${bookCards.length}個のカードを設定`);
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // アクティブなボタンのスタイルを切り替え
            const activeButton = document.querySelector('.books-filter .filter-button.active');
            if (activeButton) {
                activeButton.classList.remove('active');
            }
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            console.log('フィルター適用:', filterValue);
            
            bookCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    console.log('書籍フィルター設定完了');
}

// LINEスタンプの初期化
function initializeLineStamps() {
    console.log('LINEスタンプを初期化');
    
    // パスを修正
    loadData('line.json', [
        {
            id: 1,
            name: "しきぶちゃんスタンプ 基本セット",
            image: "images/line/stamp/1.jpeg",
            price: 120,
            category: "stamp",
            url: "https://line.me/S/sticker/"
        },
        {
            id: 2,
            name: "しきぶちゃん 日常会話セット",
            image: "images/line/stamp/2.png",
            price: 120,
            category: "stamp",
            url: "https://line.me/S/sticker/"
        },
        {
            id: 3,
            name: "ピンキー スタンプ",
            image: "images/line/emoji/1.png",
            price: 120,
            category: "emoji",
            url: "https://line.me/S/sticker/"
        },
        {
            id: 4,
            name: "クマゴロー＆ポポタン スタンプ",
            image: "images/line/theme/1.jpeg",
            price: 120,
            category: "theme",
            url: "https://line.me/S/sticker/"
        }
    ]).then(data => {
        console.log('LINEスタンプデータ読み込み完了:', data.length);
        displayLineStamps(data);
        setupStampsFilter();
        // 画面サイズに応じたグリッドレイアウトの設定
        updateGridLayout();
    }).catch(error => {
        console.error('LINEスタンプデータ読み込みエラー:', error);
        // デフォルトデータで初期化
        displayLineStamps([
            {
                id: 1,
                name: "しきぶちゃんスタンプ 基本セット",
                image: "images/line/stamp/1.jpeg",
                price: 120,
                category: "stamp",
                url: "https://line.me/S/sticker/"
            },
            {
                id: 2,
                name: "しきぶちゃん 日常会話セット",
                image: "images/line/stamp/2.png",
                price: 120,
                category: "stamp",
                url: "https://line.me/S/sticker/"
            },
            {
                id: 3,
                name: "ピンキー スタンプ",
                image: "images/line/emoji/1.png",
                price: 120,
                category: "emoji",
                url: "https://line.me/S/sticker/"
            }
        ]);
        setupStampsFilter();
        updateGridLayout();
    });
}

function displayLineStamps(data) {
    console.log(`${data.length}個のLINEスタンプカードを表示`);
    
    const stampsContainer = document.getElementById('stamps-container');
    if (!stampsContainer) {
        console.error('LINEスタンプコンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    stampsContainer.innerHTML = '';
    
    // スタンプカードを生成
    data.forEach((stamp, index) => {
        const card = document.createElement('div');
        card.className = 'stamp-card';
        card.setAttribute('data-category', stamp.category || 'all');
        
        // 画像パスの生成
        const imagePath = stamp.image || 'images/placeholder.jpg';
        console.log(`スタンプ${index+1}の画像パス:`, imagePath);
        
        // 価格をフォーマット
        const formattedPrice = stamp.price ? stamp.price + '円' : '価格未設定';
        
        card.innerHTML = `
            <div class="stamp-img">
                <img data-src="${imagePath}" src="images/placeholder.jpg" alt="${stamp.name}" 
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
    console.log('LINEスタンプ表示完了');
}

// 画面サイズに応じてグリッドレイアウトを更新
function updateGridLayout() {
    console.log('グリッドレイアウトを更新');
    
    const stampsContainer = document.getElementById('stamps-container');
    if (!stampsContainer) {
        console.log('スタンプコンテナが見つかりません');
        return;
    }
    
    const width = window.innerWidth;
    
    if (width <= 480) {
        // スマホサイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
        console.log('スマホサイズのレイアウトを適用: 2列');
    } else if (width <= 768) {
        // タブレットサイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        console.log('タブレットサイズのレイアウトを適用: 3列');
    } else {
        // PC/大画面サイズ
        stampsContainer.style.gridTemplateColumns = 'repeat(4, 1fr)';
        console.log('PCサイズのレイアウトを適用: 4列');
    }
}

// LINEスタンプフィルター機能
function setupStampsFilter() {
    console.log('LINEスタンプフィルターを設定');
    
    const filterButtons = document.querySelectorAll('.stamps-filter .filter-button');
    const stampCards = document.querySelectorAll('#stamps-container .stamp-card');
    
    if (filterButtons.length === 0) {
        console.log('スタンプフィルターボタンが見つかりません');
        return;
    }
    
    if (stampCards.length === 0) {
        console.log('スタンプカードが見つかりません');
        return;
    }
    
    console.log(`${filterButtons.length}個のフィルターボタンと${stampCards.length}個のカードを設定`);
    
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
            console.log('フィルター適用:', filterValue);
            
            stampCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    console.log('LINEスタンプフィルター設定完了');
}

// リサイズ時にグリッドレイアウトを更新
window.addEventListener('resize', function() {
    updateGridLayout();
});

// ニュースの初期化
function initializeNews(data) {
    console.log('ニュースデータを初期化');
    
    const newsContainer = document.querySelector('.news-container');
    if (!newsContainer) {
        console.error('ニュースコンテナが見つかりません');
        return;
    }
    
    if (!data || data.length === 0) {
        console.error('ニュースデータが空です');
        return;
    }

    // ニュースコンテナをクリア
    newsContainer.innerHTML = '';
    
    console.log(`${data.length}個のニュースアイテムを表示`);

    // ニュースアイテムを生成
    data.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        
        // 日付フォーマットを変換（YYYY-MM-DD → YYYY.MM.DD）
        const formattedDate = item.date ? item.date.replace(/-/g, '.') : '';
        console.log(`ニュース${index+1}の日付:`, formattedDate);
        
        newsItem.innerHTML = `
            <p class="date">${formattedDate}</p>
            <h3>${item.title || 'タイトルなし'}</h3>
            <p>${item.summary || '説明なし'}</p>
            <a href="${item.url || '#'}" class="read-more">もっと見る</a>
        `;
        newsContainer.appendChild(newsItem);
    });
    
    console.log('ニュース初期化完了');
}

// YouTube動画を表示する関数
function initializeYouTube() {
    console.log('YouTube動画を初期化');
    displaySimpleYouTubeVideos();
}

function displaySimpleYouTubeVideos() {
    const youtubeContainer = document.querySelector('.youtube-container');
    if (!youtubeContainer) {
        console.error('YouTubeコンテナが見つかりません');
        return;
    }
    
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
    
    console.log(`${videos.length}個のYouTube動画を表示`);
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    videos.forEach((video, index) => {
        const card = document.createElement('div');
        card.className = 'youtube-card';
        
        // Content Security Policy対応: evalの代わりにJSONParseを使用
        const videoTitle = video.title || '';
        const videoDesc = video.description || '';
        const videoUrl = video.url || '';
        
        console.log(`YouTube動画${index+1}:`, videoTitle);
        
        card.innerHTML = `
            <div class="youtube-embed">
                <iframe 
                    src="${videoUrl}" 
                    title="${videoTitle}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                ></iframe>
            </div>
            <div class="youtube-info">
                <h3>${videoTitle}</h3>
                <p>${videoDesc}</p>
            </div>
        `;
        
        youtubeContainer.appendChild(card);
    });
    
    console.log('YouTube動画表示完了');
}

// 漫画ブログのカードデザインで表示する関数（日付を非表示）
function initializeMangaBlog() {
    console.log('漫画ブログを初期化');
    displayMangaBlogCards();
}

function displayMangaBlogCards() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) {
        console.error('漫画ブログコンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 漫画ブログデータ
    const mangaData = {
        image: "images/mangablog/header.PNG",
        title: "BUSONコンテンツ",
        description: "ほぼ毎日漫画更新中!!",
        url: "https://buson.blog.jp"
    };
    
    console.log('漫画ブログカードを表示:', mangaData.title);
    
    // カードのスタイルを改良してより大きく表示
    const style = document.createElement('style');
    style.textContent = `
        .manga-card-improved {
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            width: 100%;
            margin-bottom: 20px;
        }
        
        .manga-card-improved:hover {
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .manga-card-improved a {
            display: block;
            text-decoration: none;
            width: 100%;
            height: 100%;
        }
        
        .manga-img-improved {
            position: relative;
            width: 100%;
            padding-top: 56.25%; /* 16:9比率 */
            overflow: hidden;
        }
        
        .manga-img-improved img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    `;
    document.head.appendChild(style);
    
    // 漫画ブログカードを生成（改良版）
    const card = document.createElement('div');
    card.className = 'manga-card-improved';
    
    card.innerHTML = `
        <a href="${mangaData.url}" target="_blank">
            <div class="manga-img-improved">
                <img src="${mangaData.image}" alt="${mangaData.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
        </a>
    `;
    
    mangaContainer.appendChild(card);
    console.log('漫画ブログカード表示完了');
    
    // テキスト内容を非表示にする
    setTimeout(() => {
        const textContent = document.querySelector('.manga-text-content');
        if (textContent) {
            textContent.style.display = 'none';
        }
    }, 100);
}

// ページ読み込み完了後にニュースを確認し、必要なら強制表示
window.addEventListener('load', function() {
    console.log('ページ読み込み完了イベント');
    
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
