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
    keywords: 'BUSON STUDIO, キャラクター, グッズ, イラスト, 漫画'
  },
  
  // YouTube関連設定
  youtube: {
    apiKey: 'YOUR_API_KEY_HERE', // YouTube Data API キー
    channelId: 'UCtRCF2NLRULCmf-oLAF455w', // チャンネルID
    featuredVideoId: 'YOUR_FEATURED_VIDEO_ID', // おすすめ動画のID
    updateInterval: 3600000 // データ更新間隔（ミリ秒） - デフォルト1時間
  },
  
  // 漫画ブログ関連設定
  mangaBlog: {
    rssUrl: 'https://buson.blog.jp/index.rdf', // RSSフィードURL
    updateInterval: 3600000, // データ更新間隔（ミリ秒） - デフォルト1時間
    defaultImage: 'images/manga_default.jpg' // デフォルト画像
  },
  
  // SNSアカウント設定
  socialMedia: {
    facebook: 'https://www.facebook.com/busonStudio',
    twitter: 'https://twitter.com/busonStudio',
    instagram: 'https://www.instagram.com/busonStudio/',
    youtube: 'https://www.youtube.com/channel/UCtRCF2NLRULCmf-oLAF455w',
    tiktok: 'https://www.tiktok.com/@busonStudio'
  },
  
  // フッターリンク
  footerLinks: {
    showSocial: true, // ソーシャルメディアアイコンを表示
    mainLinks: [
      { text: '会社情報', url: '/company.html' },
      { text: 'ニュースリリース', url: '/news.html' },
      { text: 'BUSONスタジオのライセンスビジネス事例', url: '/license.html' },
      { text: 'よくあるご質問', url: '/faq.html' }
    ],
    subLinks: [
      { text: '重要なお知らせ', url: '/important.html' },
      { text: 'このサイトについて', url: '/about-site.html' },
      { text: 'ソーシャルメディアポリシー', url: '/social-policy.html' },
      { text: 'プライバシーポリシー', url: '/privacy.html' },
      { text: 'ウェブアクセシビリティ方針', url: '/accessibility.html' },
      { text: 'サイトマップ', url: '/sitemap.html' }
    ]
  }
};

// 他のJavaScriptファイルからアクセスできるようにする
if (typeof module !== 'undefined') {
  module.exports = SITE_CONFIG;
} else {
  // ブラウザ環境での使用
  window.SITE_CONFIG = SITE_CONFIG;
}
