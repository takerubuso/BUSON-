/**
 * BUSON STUDIO ウェブサイト設定ファイル
 * 
 * このファイルは管理者が変更できる設定を定義します。
 * サイト全体の設定や、各セクションの特定コンテンツを指定できます。
 */

const SITE_CONFIG = {
  // サイト全体の設定
  site: {
    title: 'BUSON STUDIO | キャラクター開発スタジオ',
    description: 'オリジナルキャラクターとグッズの制作・販売を行うBUSON STUDIOの公式サイトです。',
    keywords: 'BUSON STUDIO, キャラクター, グッズ, イラスト, 漫画',
    baseUrl: 'https://buson2025.com',
    defaultImagePath: 'images/placeholder.jpg'
  },
  
  // YouTube関連設定
  youtube: {
    channelId: 'UCtRCF2NLRULCmf-oLAF455w', // チャンネルID
    channelUrl: 'https://www.youtube.com/channel/UCtRCF2NLRULCmf-oLAF455w',
    defaultVideos: [
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
    ],
    updateInterval: 3600000 // データ更新間隔（ミリ秒） - デフォルト1時間
  },
  
  // 漫画ブログ関連設定
  mangaBlog: {
    url: 'https://buson.blog.jp',
    defaultImage: 'images/mangablog/header.PNG',
    title: 'BUSONコンテンツ',
    description: 'ほぼ毎日漫画更新中!!',
    updateInterval: 3600000 // データ更新間隔（ミリ秒） - デフォルト1時間
  },
  
  // SNSアカウント設定
  socialMedia: {
    twitter: 'https://twitter.com/busonStudio',
    instagram: 'https://www.instagram.com/buson2025/',
    youtube: 'https://www.youtube.com/channel/UCtRCF2NLRULCmf-oLAF455w',
    tiktok: 'https://www.tiktok.com/@buson2025'
  },
  
  // グッズカテゴリー設定
  goodsCategories: [
    { id: 'all', name: 'すべて' },
    { id: 'lifestyle', name: 'ライフスタイル' },
    { id: 'stationery', name: '文房具' },
    { id: 'plush', name: 'ぬいぐるみ' }, 
    { id: 'seasonal', name: '季節限定' }
  ],
  
  // デフォルトニュースデータ（APIが失敗した場合のフォールバック）
  defaultNews: [
    {
      id: 1,
      date: "2025-04-15",
      title: "【お知らせ】BUSON × 公正取引委員会 ― フリーランス法の公式広報にしきぶちゃんが登場しました",
      summary: "2024年11月1日に施行される「フリーランス法」の広報活動に協力することになりました。しきぶちゃんがメインビジュアルとして採用されています。",
      url: "kiji/20240617.html"
    },
    {
      id: 2,
      date: "2025-04-10",
      title: "コラボカフェ開催のお知らせ",
      summary: "4月20日から5月15日まで、渋谷のカフェ「スイートタイム」にてBUSONスタジオキャラクターズのコラボカフェを開催します！",
      url: "news-cafe.html"
    },
    {
      id: 3,
      date: "2025-04-01",
      title: "グッズ新発売のお知らせ",
      summary: "人気キャラクター「モフタロウ」のぬいぐるみなど、新グッズが発売開始！BOOTHとBASEにて販売中です。",
      url: "news-goods.html"
    }
  ],
  
  // フッターリンク
  footerLinks: {
    showSocial: true, // ソーシャルメディアアイコンを表示
    mainLinks: [
      { text: '会社情報', url: 'company.html' },
      { text: 'ニュースリリース', url: 'news.html' },
      { text: 'PR企業案件事例', url: 'buson-studio-business.html' },
      { text: 'BUSONスタジオのライセンスビジネス事例', url: 'license.html' },
      { text: 'よくあるご質問', url: 'faq.html' }
    ],
    subLinks: [
      { text: '重要なお知らせ', url: 'important.html' },
      { text: 'このサイトについて', url: 'about-site.html' },
      { text: 'ソーシャルメディアポリシー', url: 'social-policy.html' },
      { text: 'プライバシーポリシー', url: 'privacy.html' },
      { text: 'サイトマップ', url: 'sitemap.html' }
    ]
  }
};

// 他のJavaScriptファイルからアクセスできるようにする
window.SITE_CONFIG = SITE_CONFIG;
