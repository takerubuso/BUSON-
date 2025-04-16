// YouTube APIとの連携
// config.js として別ファイルで保存することを推奨
const YOUTUBE_CONFIG = {
  apiKey: 'YOUR_API_KEY', // 実際のAPIキーに置き換えてください
  channelId: 'UCtRCF2NLRULCmf-oLAF455w',
  featuredVideoId: 'YOUR_FEATURED_VIDEO_ID' // 管理者が指定する動画ID
};

// YouTube APIから動画データを取得する関数
async function fetchYouTubeVideos() {
  try {
    // 最新動画を取得
    const latestResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_CONFIG.apiKey}&channelId=${YOUTUBE_CONFIG.channelId}&part=snippet,id&order=date&maxResults=1&type=video`
    );
    const latestData = await latestResponse.json();
    
    // 人気動画を取得（再生回数順）
    const popularResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_CONFIG.apiKey}&channelId=${YOUTUBE_CONFIG.channelId}&part=snippet,id&order=viewCount&maxResults=1&type=video`
    );
    const popularData = await popularResponse.json();
    
    // 指定動画を取得
    const featuredResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_CONFIG.apiKey}&id=${YOUTUBE_CONFIG.featuredVideoId}&part=snippet`
    );
    const featuredData = await featuredResponse.json();
    
    // 3つの動画データを整形
    const videos = [
      {
        id: latestData.items[0]?.id?.videoId || '',
        title: latestData.items[0]?.snippet?.title || '最新動画',
        description: latestData.items[0]?.snippet?.description?.substring(0, 100) + '...' || 'チャンネルの最新動画です。',
        thumbnail: latestData.items[0]?.snippet?.thumbnails?.high?.url || '',
        type: '最新'
      },
      {
        id: popularData.items[0]?.id?.videoId || '',
        title: popularData.items[0]?.snippet?.title || '人気動画',
        description: popularData.items[0]?.snippet?.description?.substring(0, 100) + '...' || '最も再生数の多い動画です。',
        thumbnail: popularData.items[0]?.snippet?.thumbnails?.high?.url || '',
        type: '人気'
      },
      {
        id: YOUTUBE_CONFIG.featuredVideoId,
        title: featuredData.items[0]?.snippet?.title || 'おすすめ動画',
        description: featuredData.items[0]?.snippet?.description?.substring(0, 100) + '...' || '管理者のおすすめ動画です。',
        thumbnail: featuredData.items[0]?.snippet?.thumbnails?.high?.url || '',
        type: 'ピックアップ'
      }
    ];
    
    return videos;
  } catch (error) {
    console.error('YouTube API エラー:', error);
    // エラーの場合はデモデータを返す
    return [
      {
        id: 'DEMO_VIDEO_1',
        title: '最新動画',
        description: 'チャンネルの最新動画です。',
        type: '最新'
      },
      {
        id: 'DEMO_VIDEO_2',
        title: '人気動画',
        description: '最も再生数の多い動画です。',
        type: '人気'
      },
      {
        id: 'DEMO_VIDEO_3',
        title: 'おすすめ動画',
        description: '管理者のおすすめ動画です。',
        type: 'ピックアップ'
      }
    ];
  }
}

// YouTube動画をUIに表示する関数
async function displayYouTubeVideos() {
  const youtubeContainer = document.querySelector('.youtube-container');
  if (!youtubeContainer) return;
  
  // ローディング表示
  youtubeContainer.innerHTML = '<div class="loading">動画を読み込み中...</div>';
  
  try {
    // APIから動画データを取得
    const videos = await fetchYouTubeVideos();
    
    // コンテナをクリア
    youtubeContainer.innerHTML = '';
    
    // 動画カードを生成
    videos.forEach(video => {
      const card = document.createElement('div');
      card.className = 'youtube-card';
      
      card.innerHTML = `
        <div class="youtube-embed">
          <iframe 
            src="https://www.youtube.com/embed/${video.id}" 
            title="${video.title}" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </div>
        <div class="youtube-info">
          <h3>${video.title}</h3>
          <p>${video.description}</p>
          <span class="video-type">${video.type}</span>
        </div>
      `;
      
      youtubeContainer.appendChild(card);
    });
  } catch (error) {
    console.error('YouTube動画の表示に失敗しました:', error);
    youtubeContainer.innerHTML = '<div class="error">動画の読み込みに失敗しました。後でもう一度お試しください。</div>';
  }
}

// 漫画ブログのRSSフィードを取得する関数
async function fetchMangaBlogPosts() {
  try {
    // RSSをJSONに変換するサービスを使用
    const rssUrl = 'https://buson.blog.jp/index.rdf';
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();
    
    if (data.status !== 'ok') {
      throw new Error('RSSフィードの取得に失敗しました');
    }
    
    // 最新の3記事を取得
    const posts = data.items.slice(0, 3).map(item => {
      // 画像URLを抽出（RSSの内容によって調整が必要）
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const imgMatch = imgRegex.exec(item.description);
      const imgSrc = imgMatch ? imgMatch[1] : 'images/manga_default.jpg';
      
      return {
        title: item.title,
        date: new Date(item.pubDate).toISOString().split('T')[0],
        image: imgSrc,
        summary: item.description.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
        url: item.link
      };
    });
    
    return posts;
  } catch (error) {
    console.error('漫画ブログフィードの取得に失敗しました:', error);
    // エラーの場合はデモデータを返す
    return [
      {
        title: '最新漫画ブログ記事1',
        date: '2025-04-15',
        image: 'images/manga_default.jpg',
        summary: '最新の漫画ブログ記事です。',
        url: 'https://buson.blog.jp'
      },
      {
        title: '最新漫画ブログ記事2',
        date: '2025-04-10',
        image: 'images/manga_default.jpg',
        summary: '最新の漫画ブログ記事です。',
        url: 'https://buson.blog.jp'
      },
      {
        title: '最新漫画ブログ記事3',
        date: '2025-04-05',
        image: 'images/manga_default.jpg',
        summary: '最新の漫画ブログ記事です。',
        url: 'https://buson.blog.jp'
      }
    ];
  }
}

// 漫画ブログ記事をUIに表示する関数
async function displayMangaBlogPosts() {
  const mangaContainer = document.querySelector('.manga-container');
  if (!mangaContainer) return;
  
  // ローディング表示
  mangaContainer.innerHTML = '<div class="loading">漫画ブログを読み込み中...</div>';
  
  try {
    // APIから記事データを取得
    const posts = await fetchMangaBlogPosts();
    
    // コンテナをクリア
    mangaContainer.innerHTML = '';
    
    // 記事カードを生成
    posts.forEach(post => {
      const card = document.createElement('div');
      card.className = 'manga-card';
      
      // 日付をフォーマット
      const formattedDate = post.date.replace(/-/g, '.');
      
      card.innerHTML = `
        <div class="manga-img">
          <img src="${post.image}" alt="${post.title}" onerror="this.onerror=null; this.src='images/manga_default.jpg';">
        </div>
        <div class="manga-info">
          <p class="date">${formattedDate}</p>
          <h3>${post.title}</h3>
          <p>${post.summary}</p>
          <a href="${post.url}" class="read-more" target="_blank">もっと見る</a>
        </div>
      `;
      
      mangaContainer.appendChild(card);
    });
  } catch (error) {
    console.error('漫画ブログの表示に失敗しました:', error);
    mangaContainer.innerHTML = '<div class="error">ブログの読み込みに失敗しました。後でもう一度お試しください。</div>';
  }
}

// DOM読み込み完了時に実行
document.addEventListener('DOMContentLoaded', function() {
  // 他の初期化処理の後に実行
  displayYouTubeVideos();
  displayMangaBlogPosts();
});
