/**
 * BUSON STUDIO ウェブサイトのメインスクリプト
 * - 2025年4月最終更新
 */

document.addEventListener('DOMContentLoaded', function() {
    // スキップリンクの追加（アクセシビリティ向上）
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-link';
    skipLink.textContent = 'メインコンテンツにスキップ';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // メインコンテンツにID追加
    const mainElement = document.querySelector('main');
    if (mainElement) {
        mainElement.id = 'main-content';
        mainElement.setAttribute('tabindex', '-1');
    }
    
    // モバイルメニューの制御
    setupMobileMenu();
    
    // スライダーデータを読み込み
    loadData('data/slider.json', SITE_CONFIG.defaultSlider || [
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
            setupCharacterModal(data);
        }
    });

    // グッズデータを読み込み
    loadData('data/goods.json', []).then(data => {
        // カテゴリーを新しい設定に更新
        updateGoodsCategories(data);
        initializeGoods(data);
        setupGoodsFilter();
    });

    // 書籍セクションの初期化
    initializeBooks();
    
    // LINEスタンプセクションの初期化
    initializeLineStamps();

    // ニューススライダーを初期化
    initializeNewsSlider();
        
    // YouTubeセクションの初期化
    initializeYouTube();
    
    // 漫画ブログセクションの初期化
    initializeMangaBlog();
    
    // モバイルタッチイベントを設定
    setupMobileTouchEvents();
    
    // 画像の遅延読み込み設定
    setupLazyLoading();
    
    // リンクの安全性向上
    enhanceExternalLinks();
    
    // フォーム検証設定
    setupFormValidation();
});

/**
 * ニューススライダーの初期化と設定
 */
function initializeNewsSlider() {
    // ニュースデータを読み込み
    // パスから先頭の./を取り除く
    loadData('data/news.json', SITE_CONFIG.defaultNews || []).then(data => {
        console.log("読み込まれたニュースデータ:", data);
        // 日付でソート（新しい順）
        const sortedNews = sortNewsByDate(data);
        console.log("ソート後のニュースデータ:", sortedNews);
        displayNewsSlider(sortedNews);
    });
}

/**
 * 日付でニュースを新しい順にソート
 * @param {Array} newsData - ニュースデータ配列
 * @return {Array} ソート済みデータ
 */
function sortNewsByDate(newsData) {
    if (!Array.isArray(newsData)) return [];
    
    return [...newsData].sort((a, b) => {
        // 日付フォーマットの違いに対応（YYY-MM-DDとYYYY.MM.DDの両方に対応）
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA; // 降順（新しい順）
    });
}

/**
 * ニュースアイテムを生成する関数
 * @param {Array} newsData - ニュースデータ配列
 */
function displayNewsSlider(newsData) {
    const newsSlider = document.querySelector('.news-slider');
    const dotsContainer = document.querySelector('.news-dots-container');
    
    if (!newsSlider || !newsData || newsData.length === 0) {
        console.warn('ニュースデータまたはスライダーが見つかりません');
        return;
    }
    
    // スライダーをクリア
    newsSlider.innerHTML = '';
    
    // ドットコンテナをクリア
    if (dotsContainer) {
        dotsContainer.innerHTML = '';
    }
    
    // 表示するニュース数を最大3つに制限
    const displayNews = newsData.slice(0, 3);
    
    // ニュースアイテムを生成
    displayNews.forEach((item, index) => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.setAttribute('role', 'listitem');
        newsItem.setAttribute('aria-label', `ニュース ${index + 1}: ${item.title}`);
        
        // 日付フォーマットの処理 - 両方のフォーマットに対応
        let formattedDate = item.date;
        if (formattedDate.includes('-')) {
            // YYYY-MM-DD から YYYY.MM.DD へ変換
            formattedDate = formattedDate.replace(/-/g, '.');
        }
        
        // サムネイル画像のパスを設定（ない場合はデフォルト画像）
        // 明示的にthumbnailプロパティを確認
        const thumbnailPath = item.thumbnail || `images/news/thumbnail_${index + 1}.jpg`;
        
        // テキスト内容を一定長さに制限（文字数を制限する代わりにCSSでの切り詰めを使用）
        
        newsItem.innerHTML = `
            <div class="news-thumbnail">
                <img src="${thumbnailPath}" alt="${item.title}" onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="news-content">
                <p class="date">${formattedDate}</p>
                <h3>${item.title}</h3>
                <p>${item.summary}</p>
                <div class="read-more-container">
                    <a href="${item.url}" class="read-more">もっと見る</a>
                </div>
            </div>
        `;
        
        newsSlider.appendChild(newsItem);
        
        // ドットインジケーターの追加
        if (dotsContainer) {
            const dot = document.createElement('div');
            dot.className = 'news-dot';
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.setAttribute('data-index', index);
            dot.setAttribute('role', 'button');
            dot.setAttribute('tabindex', '0');
            dot.setAttribute('aria-label', `ニュース ${index + 1} に移動`);
            
            // クリックイベント
            dot.addEventListener('click', function() {
                goToSlide(index);
            });
            
            // キーボードアクセシビリティ
            dot.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
            
            dotsContainer.appendChild(dot);
        }
    });
    
    // スライダーの設定
    let currentIndex = 0;
    const slides = newsSlider.querySelectorAll('.news-item');
    const slideCount = slides.length;
    
    // 初期位置を設定
    updateSlider();
    
    // 前のスライドボタン
    const prevButton = document.querySelector('.news-prev');
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            prevSlide();
        });
    }
    
    // 次のスライドボタン
    const nextButton = document.querySelector('.news-next');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            nextSlide();
        });
    }
    
    // 前のスライドに移動
    function prevSlide() {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        updateSlider();
    }
    
    // 次のスライドに移動
    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        updateSlider();
    }
    
    // 特定のスライドに移動
    function goToSlide(index) {
        currentIndex = index;
        updateSlider();
    }
    
    // スライダーの表示を更新
    function updateSlider() {
        // スライド位置を更新
        newsSlider.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // アクセシビリティ - 現在のスライドを通知
        slides.forEach((slide, index) => {
            if (index === currentIndex) {
                slide.removeAttribute('aria-hidden');
            } else {
                slide.setAttribute('aria-hidden', 'true');
            }
        });
        
        // ドットの状態を更新
        const dots = dotsContainer.querySelectorAll('.news-dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
                dot.setAttribute('aria-current', 'true');
            } else {
                dot.classList.remove('active');
                dot.removeAttribute('aria-current');
            }
        });
    }
    
    // タッチスワイプ対応
    let touchStartX = 0;
    let touchEndX = 0;
    
    newsSlider.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    newsSlider.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
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
    newsSlider.tabIndex = 0;
    newsSlider.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });
    
    // 自動スライドは無効化
    // スライダーの状態を更新（初期表示用）
    updateSlider();
}

/**
 * グッズカテゴリーを最新の設定に更新
 * @param {Array} goodsData - グッズデータ配列
 */
function updateGoodsCategories(goodsData) {
    // カテゴリー対応マッピング - 古いカテゴリー名から新しいカテゴリー名へ
    const categoryMapping = {
        'fashion': 'lifestyle',
        'daily': 'lifestyle',
        'stationary': 'stationery',
        'collection': 'lifestyle',
        'plush': 'plush',
        'interior': 'lifestyle',
        'seasonal': 'seasonal'
    };
    
    // 各商品のカテゴリーを更新
    goodsData.forEach(item => {
        if (item.category in categoryMapping) {
            item.category = categoryMapping[item.category];
        } else if (item.category !== 'all') {
            // デフォルトはライフスタイル
            item.category = 'lifestyle';
        }
    });
}

/**
 * 外部リンクのセキュリティ強化
 */
function enhanceExternalLinks() {
    const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="' + window.location.hostname + '"])');
    
    externalLinks.forEach(link => {
        // rel属性が既に設定されているか確認
        const rel = link.getAttribute('rel');
        if (!rel || !rel.includes('noopener')) {
            // rel属性を追加または更新
            link.setAttribute('rel', rel ? rel + ' noopener noreferrer' : 'noopener noreferrer');
        }
        
        // target属性が設定されていない場合は_blankを追加
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
    });
}

/**
 * フォーム検証の設定
 */
function setupFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        // 必須入力フィールドにaria-required属性を追加
        const requiredFields = form.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            field.setAttribute('aria-required', 'true');
            
            // エラーメッセージ用の要素を追加
            const errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.id = field.id + '-error';
            errorElement.textContent = '入力してください。';
            field.parentNode.appendChild(errorElement);
            
            // aria-describedby属性を設定
            field.setAttribute('aria-describedby', errorElement.id);
            
            // 入力チェックイベント
            field.addEventListener('blur', function() {
                validateField(this);
            });
            
            field.addEventListener('input', function() {
                // 入力があれば検証エラーを消去
                if (this.value.trim() !== '') {
                    this.parentNode.classList.remove('has-error');
                }
            });
        });
        
        // フォーム送信イベント
        form.addEventListener('submit', function(e) {
            let isValid = true;
            
            // すべての必須フィールドを検証
            requiredFields.forEach(field => {
                if (!validateField(field)) {
                    isValid = false;
                }
            });
            
            // 検証に失敗したら送信を中止
            if (!isValid) {
                e.preventDefault();
                // エラーのある最初のフィールドにフォーカス
                form.querySelector('.has-error input, .has-error textarea, .has-error select').focus();
            }
        });
    });
}

/**
 * フィールド検証
 * @param {HTMLElement} field - 検証するフィールド要素
 * @return {boolean} 検証結果
 */
function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    if (isValid) {
        field.parentNode.classList.remove('has-error');
    } else {
        field.parentNode.classList.add('has-error');
    }
    
    return isValid;
}

/**
 * データ読み込み用の汎用関数
 * @param {string} url - データファイルのURL
 * @param {Array} defaultData - デフォルトデータ
 * @return {Promise} 読み込まれたデータまたはデフォルトデータ
 */
async function loadData(url, defaultData = []) {
    try {
        console.log(`データを読み込み中: ${url}`);
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`データの読み込みに失敗: ${response.status}`);
        }
        const data = await response.json();
        console.log(`データの読み込み成功: ${url}`, data);
        return data;
    } catch (error) {
        console.warn(`${url}の読み込みに失敗しました:`, error);
        console.log(`デフォルトデータを使用します:`, defaultData);
        return defaultData;
    }
}

/**
 * モバイルメニューの制御
 */
function setupMobileMenu() {
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('nav ul');
    
    if (mobileMenuButton && navMenu) {
        // クリックイベント
        mobileMenuButton.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // アクセシビリティ対応
            const isExpanded = navMenu.classList.contains('active');
            mobileMenuButton.setAttribute('aria-expanded', isExpanded);
            navMenu.setAttribute('aria-hidden', !isExpanded);
        });
        
        // キーボードイベント
        mobileMenuButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // 初期状態の設定
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-controls', 'mobile-menu');
        navMenu.id = 'mobile-menu';
        navMenu.setAttribute('aria-hidden', 'true');
        
        // メニュー内のリンクをクリックしたらメニューを閉じる
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    mobileMenuButton.classList.remove('active');
                    navMenu.classList.remove('active');
                    mobileMenuButton.setAttribute('aria-expanded', 'false');
                    navMenu.setAttribute('aria-hidden', 'true');
                }
            });
        });
        
        // 画面サイズ変更時の処理
        window.addEventListener('resize', function() {
            if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
                // 画面サイズが大きくなったらメニューを閉じる
                mobileMenuButton.classList.remove('active');
                navMenu.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
                navMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }
}

/**
 * 画像の遅延読み込み
 */
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

/**
 * 要素が表示領域内かチェック
 * @param {HTMLElement} element - 確認する要素
 * @return {boolean} 表示領域内かどうか
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 改良版スライダー初期化関数
 * @param {Array} data - スライダーデータ
 */
function initializeEnhancedSlider(data) {
    console.log('スライダーデータを初期化しています');
    
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
        sliderItem.setAttribute('role', 'button');
        sliderItem.setAttribute('aria-label', `スライド ${index + 1}: ${item.title || ''}${item.description ? ' - ' + item.description : ''}`);
        
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
        
        // アクセシビリティ - 現在のスライドを通知
        const currentSlide = slider.children[currentIndex];
        if (currentSlide) {
            Array.from(slider.children).forEach(slide => {
                slide.setAttribute('aria-hidden', 'true');
            });
            currentSlide.setAttribute('aria-hidden', 'false');
        }
        
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
            
            // アクセシビリティ - プレビュー説明
            const previewLeftContainer = document.querySelector('.slider-preview-left');
            if (previewLeftContainer) {
                previewLeftContainer.setAttribute('aria-label', `前のスライド: ${data[prevIndex].title || ''}`);
                
                // 前のスライドに移動するクリックイベント
                previewLeftContainer.onclick = function() {
                    prevSlide();
                };
            }
        }
        
        if (previewRight) {
            previewRight.style.backgroundImage = `url('${data[nextIndex].image || 'images/placeholder.jpg'}')`;
            
            // アクセシビリティ - プレビュー説明
            const previewRightContainer = document.querySelector('.slider-preview-right');
            if (previewRightContainer) {
                previewRightContainer.setAttribute('aria-label', `次のスライド: ${data[nextIndex].title || ''}`);
                
                // 次のスライドに移動するクリックイベント
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
    
    // 矢印ボタンの設定
    if (prevButton && nextButton) {
        // アクセシビリティ設定
        prevButton.setAttribute('role', 'button');
        nextButton.setAttribute('role', 'button');
        
        // クリックイベント
        prevButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // イベントの伝播を停止
            prevSlide();
        });
        
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
}

/**
 * キャラクターの初期化
 * @param {Array} data - キャラクターデータ
 */
function initializeCharacters(data) {
    const characterContainer = document.querySelector('.character-container');
    if (!characterContainer || !data || data.length === 0) return;

    // キャラクターカードをクリア
    characterContainer.innerHTML = '';

    // キャラクターカードを生成
    data.forEach((character, index) => {
        const card = document.createElement('div');
        card.className = 'character-card';
        card.setAttribute('data-character', character.name);
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', character.name);
        
        // カテゴリー属性を追加
        card.setAttribute('data-category', character.category || 'all');
        
        // 画像パスの生成
        const imagePath = character.image || 'images/character/placeholder.png';
        
        card.innerHTML = `
            <div class="character-img">
                <img src="${imagePath}" alt="${character.name}" onerror="this.onerror=null; this.src='images/character/placeholder.png';">
            </div>
            <h3>${character.name}</h3>
        `;
        characterContainer.appendChild(card);
    });
    
    // アクセシビリティ向上 - containerにrole="list"を追加
    characterContainer.setAttribute('role', 'list');
    characterContainer.setAttribute('aria-label', 'キャラクター一覧');
    
    // フィルター機能を初期化
    setupCharacterFilter();
}

/**
 * キャラクターフィルター機能
 */
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
            
            // アクセシビリティ - フィルター状態を通知
            const liveRegion = document.getElementById('filter-live-region');
            if (!liveRegion) {
                const newLiveRegion = document.createElement('div');
                newLiveRegion.id = 'filter-live-region';
                newLiveRegion.className = 'visually-hidden';
                newLiveRegion.setAttribute('aria-live', 'polite');
                document.body.appendChild(newLiveRegion);
            }
            
            const visibleCount = Array.from(characterCards).filter(card => {
                const category = card.getAttribute('data-category');
                const isVisible = filterValue === 'all' || category === filterValue;
                
                if (isVisible) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                return isVisible;
            }).length;
            
            // フィルター結果を通知
            document.getElementById('filter-live-region').textContent = 
                `${filterValue === 'all' ? 'すべての' : filterValue + 'カテゴリーの'} キャラクターを表示中。 ${visibleCount}件が該当します。`;
        });
    });
}

/**
 * キャラクターモーダルの設定
 * @param {Array} characters - キャラクターデータ
 */
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

    // モーダルのアクセシビリティ設定
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'characterModalTitle');
        modal.setAttribute('aria-hidden', 'true');
    }

    // 閉じるボタンのクリックイベント
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            closeModal();
        });
        
        // キーボードアクセシビリティ
        closeButton.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }

    // モーダル外のクリックで閉じる
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });

    // ESCキーでモーダルを閉じる
    window.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });

    // キャラクター移動ボタンのアクセシビリティ設定
    if (prevButton) {
        prevButton.setAttribute('aria-label', '前のキャラクター');
    }
    
    if (nextButton) {
        nextButton.setAttribute('aria-label', '次のキャラクター');
    }

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

    // モーダルを閉じる関数
    function closeModal() {
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = 'auto'; // スクロールを再有効化
        
        // フォーカスを元のカードに戻す
        if (currentCharacterIndex >= 0 && currentCharacterIndex < characterCards.length) {
            characterCards[currentCharacterIndex].focus();
        }
    }

    // キャラクターモーダルを表示する関数
    function showCharacterModal(index, characters) {
        const character = characters[index];

        if (character) {
            // 画像パスの生成
            const imagePath = character.image || 'images/character/placeholder.png';

            // ソーシャルリンクを生成
            const socialLinksHTML = character.socialLinks && character.socialLinks.length > 0
                ? character.socialLinks.map(link =>
                    `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>`
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
                        <div class="info-circle" data-info="${iconInfo.key}" tabindex="0" role="button" aria-label="${iconInfo.label}: ${value}">
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
                    <h2 id="characterModalTitle" class="character-name">${character.name}</h2>
                    <div class="character-image">
                        <img src="${imagePath}" alt="${character.name}" onerror="this.onerror=null; this.src='images/character/placeholder.png';">
                    </div>
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
                        
                        // ポップアップの状態を更新
                        this.setAttribute('aria-expanded', popup.style.display === 'block');
                    }
                });
                
                // キーボードアクセシビリティ
                circle.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
                
                // 初期状態設定
                circle.setAttribute('aria-expanded', 'false');
            });

            // モーダルを表示
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden'; // 背景スクロールを無効化
            
            // フォーカスを閉じるボタンに設定（キーボードナビゲーション用）
            if (closeButton) {
                closeButton.focus();
            }
        }
    }
}

/**
 * キャラクターモーダルのナビゲーションにタッチイベントを追加
 */
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

/**
 * グッズの初期化
 * @param {Array} data - グッズデータ
 */
function initializeGoods(data) {
    const goodsContainer = document.querySelector('.goods-container');
    if (!goodsContainer || !data || data.length === 0) {
        console.warn('グッズデータまたはコンテナが見つかりません');
        return;
    }

    // グッズカードをクリア
    goodsContainer.innerHTML = '';

    // グッズカードを生成
    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        card.setAttribute('role', 'listitem');
        
        // カテゴリ属性を追加
        card.setAttribute('data-category', item.category || 'lifestyle');

        // 画像パスの生成
        const imagePath = item.image || 'images/placeholder.jpg';
        
        // 価格をフォーマット
        const formattedPrice = item.price + '円（税込）';

        card.innerHTML = `
            <div class="goods-img">
                <img data-src="${imagePath}" src="images/placeholder.jpg" alt="${item.name}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="goods-info">
                <h3>${item.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${item.url}" class="button" target="_blank" rel="noopener noreferrer">詳しく見る</a>
            </div>
        `;
        goodsContainer.appendChild(card);
    });
    
    // 遅延読み込みを設定
    setupLazyLoading();
}

/**
 * グッズのフィルタリング機能
 */
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
            
            // フィルター状態を通知
            const liveRegion = document.getElementById('goods-filter-live-region');
            if (!liveRegion) {
                const newLiveRegion = document.createElement('div');
                newLiveRegion.id = 'goods-filter-live-region';
                newLiveRegion.className = 'visually-hidden';
                newLiveRegion.setAttribute('aria-live', 'polite');
                document.body.appendChild(newLiveRegion);
            }
            
            const visibleCount = Array.from(goodsCards).filter(card => {
                const category = card.getAttribute('data-category');
                const isVisible = filterValue === 'all' || category === filterValue;
                
                if (isVisible) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
                
                return isVisible;
            }).length;
            
            // フィルター結果を通知
            document.getElementById('goods-filter-live-region').textContent = 
                `${filterValue === 'all' ? 'すべての' : filterValue}カテゴリーのグッズを表示中。 ${visibleCount}件が該当します。`;
        });
    });
}

/**
 * 書籍セクションの初期化
 */
function initializeBooks() {
    loadData('data/books.json', []).then(data => {
        displayBooks(data);
        setupBooksFilter();
    });
}

/**
 * 書籍データの表示
 * @param {Array} data - 書籍データ
 */
function displayBooks(data) {
    const booksContainer = document.getElementById('books-container');
    if (!booksContainer) {
        console.warn('書籍コンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    booksContainer.innerHTML = '';
    
    // 書籍カードを生成
    data.forEach(book => {
        const card = document.createElement('div');
        card.className = 'goods-card';
        card.setAttribute('data-category', book.category || 'all');
        card.setAttribute('role', 'listitem');
        
        // 価格をフォーマット
        const formattedPrice = book.price + '円（税込）';
        
        card.innerHTML = `
            <div class="goods-img">
                <img data-src="${book.image}" src="images/placeholder.jpg" alt="${book.name}" 
                     onerror="this.onerror=null; this.src='images/placeholder.jpg';">
            </div>
            <div class="goods-info">
                <h3>${book.name}</h3>
                <p class="price">${formattedPrice}</p>
                <a href="${book.url}" class="button" target="_blank" rel="noopener noreferrer">詳しく見る</a>
            </div>
        `;
        booksContainer.appendChild(card);
    });
    
    // 遅延読み込みを設定
    setupLazyLoading();
}

/**
 * 書籍フィルター設定
 */
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
            
            // フィルター状態を通知
            const liveRegion = document.getElementById('books-filter-live-region');
            if (!liveRegion) {
                const newLiveRegion = document.createElement('div');
                newLiveRegion.id = 'books-filter-live-region';
                newLiveRegion.className = 'visually-hidden';
                newLiveRegion.setAttribute('aria-live', 'polite');
                document.body.appendChild(newLiveRegion);
            }
            
            const visibleCount = Array.from(bookCards).filter(card => 
                filterValue === 'all' || card.getAttribute('data-category') === filterValue
            ).length;
            
            // フィルター結果を通知
            document.getElementById('books-filter-live-region').textContent = 
                `${filterValue === 'all' ? 'すべての' : filterValue}カテゴリーの書籍を表示中。 ${visibleCount}件が該当します。`;
        });
    });
}

/**
 * LINEスタンプの初期化
 */
function initializeLineStamps() {
    loadData('data/line.json', []).then(data => {
        displayLineStamps(data);
        setupStampsFilter();
        // 画面サイズに応じたグリッドレイアウトの設定
        updateGridLayout();
    });
}

/**
 * LINEスタンプの表示
 * @param {Array} data - スタンプデータ
 */
function displayLineStamps(data) {
    const stampsContainer = document.getElementById('stamps-container');
    if (!stampsContainer) {
        console.warn('LINEスタンプコンテナが見つかりません');
        return;
    }
    
    // コンテナをクリア
    stampsContainer.innerHTML = '';
    
    // スタンプカードを生成
    data.forEach(stamp => {
        const card = document.createElement('div');
        card.className = 'stamp-card';
        card.setAttribute('data-category', stamp.category || 'all');
        card.setAttribute('role', 'listitem');
        
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
                <a href="${stamp.url}" class="button" target="_blank" rel="noopener noreferrer">詳しく見る</a>
            </div>
        `;
        stampsContainer.appendChild(card);
    });
    
    // 遅延読み込みを設定
    setupLazyLoading();
}

/**
 * 画面サイズに応じてグリッドレイアウトを更新
 */
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

/**
 * LINEスタンプフィルター機能
 */
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
            
            // フィルター状態を通知
            const liveRegion = document.getElementById('stamps-filter-live-region');
            if (!liveRegion) {
                const newLiveRegion = document.createElement('div');
                newLiveRegion.id = 'stamps-filter-live-region';
                newLiveRegion.className = 'visually-hidden';
                newLiveRegion.setAttribute('aria-live', 'polite');
                document.body.appendChild(newLiveRegion);
            }
            
            const visibleCount = Array.from(stampCards).filter(card => 
                filterValue === 'all' || card.getAttribute('data-category') === filterValue
            ).length;
            
            document.getElementById('stamps-filter-live-region').textContent = 
                `${filterValue === 'all' ? 'すべての' : filterValue}カテゴリーのスタンプを表示中。 ${visibleCount}件が該当します。`;
        });
    });
}

/**
 * リサイズ時にグリッドレイアウトを更新
 */
window.addEventListener('resize', function() {
    updateGridLayout();
});

/**
 * YouTube動画を表示する関数
 */
function initializeYouTube() {
    // SITE_CONFIGからYouTube設定を取得
    const youtubeConfig = SITE_CONFIG.youtube || {};
    const defaultVideos = youtubeConfig.defaultVideos || [];
    
    // 動画表示関数を呼び出し
    displayYouTubeVideos(defaultVideos);
}

/**
 * YouTube動画表示
 * @param {Array} videos - 動画データ配列
 */
function displayYouTubeVideos(videos) {
    const youtubeContainer = document.querySelector('.youtube-container');
    if (!youtubeContainer) return;
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'youtube-card';
        card.setAttribute('role', 'listitem');
        
        card.innerHTML = `
            <div class="youtube-embed">
                <iframe 
                    src="${video.url}" 
                    title="${video.title}" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
            <div class="youtube-info">
                <h3>${video.title}</h3>
                <p>${video.description || ''}</p>
            </div>
        `;
        
        youtubeContainer.appendChild(card);
    });
    
    // YouTubeボタンのリンクを設定
    const youtubeButton = document.querySelector('.youtube-button');
    if (youtubeButton && youtubeConfig.channelUrl) {
        youtubeButton.href = youtubeConfig.channelUrl;
    }
}

/**
 * 漫画ブログの表示
 */
function initializeMangaBlog() {
    const mangaContainer = document.querySelector('.manga-container');
    if (!mangaContainer) return;
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 漫画ブログカード（画像とテキスト情報を含む）を直接HTMLで挿入
    mangaContainer.innerHTML = `
        <div class="manga-card">
            <a href="https://buson.blog.jp" class="manga-link" target="_blank" rel="noopener noreferrer">
                <div class="manga-img">
                    <img src="images/mangablog/header.PNG" 
                         alt="BUSONコンテンツ" 
                         onerror="this.onerror=null; this.src='images/placeholder.jpg';">
                </div>
                <div class="manga-content">
                    <h4>BUSONコンテンツ</h4>
                    <p>ほぼ毎日漫画更新中!!</p>
                </div>
            </a>
        </div>
    `;
    
    // 漫画ブログボタンのリンクを設定
    const mangaButton = document.querySelector('.manga-button');
    if (mangaButton) {
        mangaButton.href = "https://buson.blog.jp";
    }
}
