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
    channelId: 'UCtRCF2NLRULCmf-oLAF455w', // チャンネルID（BUSONメイン）
    channelUrl: 'https://www.youtube.com/channel/UCtRCF2NLRULCmf-oLAF455w',
    channels: [
      {
        name: 'BUSON',
        url: 'https://www.youtube.com/channel/UCtRCF2NLRULCmf-oLAF455w',
        description: 'あるある漫画動画チャンネル',
        icon: 'images/profile.jpg'
      },
      {
        name: 'まるまーゆ',
        url: 'https://www.youtube.com/@まるまーゆ',
        description: 'まるい眉をしたやさしい仲間たちの世界',
        icon: 'images/marumayu/logo.png'
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
