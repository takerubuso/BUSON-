'use client'
import React, { useState, useEffect } from 'react'
import { Search, ExternalLink, Filter, Globe, Zap, ShoppingCart, Calendar, Palette, Users, Twitter } from 'lucide-react'

// 型定義
interface CaseData {
  'タイムスタンプ': string;
  'サービス名・プロジェクト名を教えてください': string;
  'サイト・EC・SNSなどのURLを教えてください': string;
  'どのようなNFT活用をしているか、100文字以内で教えてください': string;
  '活用ジャンルを選択してください': string;
  'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': string;
  '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': string;
  'ステータス': string;
}

// OpenSheet APIからデータを取得する関数
async function fetchCasesFromSheet(): Promise<CaseData[]> {
  try {
    const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || 'YOUR_SHEET_ID_HERE'
    const response = await fetch(`https://opensheet.vercel.app/${SHEET_ID}/事例一覧`)
    if (!response.ok) {
      throw new Error('データの取得に失敗しました')
    }
    const data = await response.json()
    // 「公開」ステータスのものだけフィルタリング
    return data.filter((item: CaseData) => item['ステータス'] === '公開')
  } catch (error) {
    console.error('API Error:', error)
    // フォールバック用テストデータ
    return [
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'しきぶTeeショップ',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/tee-shop',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFTキャラクターを使ってオリジナルTシャツを販売中。高品質プリントで人気上昇中！',
        '活用ジャンルを選択してください': 'EC',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      },
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'メタバース展示会',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/meta-gallery',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFTアートをVR空間で展示。没入感のある新しいアート体験を提供します。',
        '活用ジャンルを選択してください': '展示',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      },
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'NFTライブ配信',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/nft-stream',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFTホルダー限定配信でコミュニティ形成。毎週金曜夜に開催中。',
        '活用ジャンルを選択してください': '配信',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      },
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'デジタルカフェ',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/digital-cafe',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFTアートを店内に展示しながら営業するカフェ。アートと食の融合空間。',
        '活用ジャンルを選択してください': 'イベント',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      },
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'NFTゲーミングチーム',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/gaming-team',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFTキャラでeスポーツチーム結成。大会での活躍と共にNFT価値向上を目指す。',
        '活用ジャンルを選択してください': 'ゲーム',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      },
      {
        'タイムスタンプ': '',
        'サービス名・プロジェクト名を教えてください': 'クリエイター教育プラットフォーム',
        'サイト・EC・SNSなどのURLを教えてください': 'https://example.com/creator-edu',
        'どのようなNFT活用をしているか、100文字以内で教えてください': 'NFT制作からマーケティングまで学べるオンライン講座を展開中。',
        '活用ジャンルを選択してください': '教育',
        'サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です': 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400',
        '運営責任者 (X旧Twitterアカウント)　記載例 @buson2025': '',
        'ステータス': '公開'
      }
    ]
  }
}

// ジャンルアイコンのマッピング
const genreIcons = {
  'EC': ShoppingCart,
  '展示': Palette,
  '配信': Zap,
  'イベント': Calendar,
  'ゲーム': Users,
  '教育': Globe,
  'キッチンカー': ShoppingCart,
  'グッズ': ShoppingCart,
  '飲食店': ShoppingCart,
  'その他': Globe
}

// Googleドライブ・X（Twitter）画像URL自動変換関数
function getImageUrl(url: string) {
  if (!url) return '';
  // Googleドライブ
  const driveMatch = url.match(/\/file\/d\/([^/]+)\//);
  if (driveMatch) {
    return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
  }
  // X（Twitter）
  if (url.startsWith('https://pbs.twimg.com/')) {
    return url.trim();
  }
  // その他
  return url.trim();
}

// OGP画像取得用コンポーネント
const OGPImage: React.FC<{ url: string; alt: string; className?: string }> = ({ url, alt, className }) => {
  const [ogImage, setOgImage] = useState<string | null>(null);
  useEffect(() => {
    if (!url) return;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setOgImage(data.data.image?.url || null);
      });
  }, [url]);
  if (!ogImage) return null;
  return <img src={ogImage} alt={alt} className={className} />;
};

// カードコンポーネント
const CaseCard: React.FC<{ case: CaseData }> = ({ case: caseData }) => {
  const IconComponent = genreIcons[caseData['活用ジャンルを選択してください'] as keyof typeof genreIcons] || Globe
  const imageUrl = getImageUrl(caseData['サムネイル用画像のURLを教えてください（Google Drive、Imgurなど） ※画像は400x300px程度の横長画像が推奨です']);
  const siteUrl = caseData['サイト・EC・SNSなどのURLを教えてください'];
  const xAccount = caseData['運営責任者 (X旧Twitterアカウント)　記載例 @buson2025']?.trim();
  // XアカウントURL生成
  let xUrl = '';
  if (xAccount && xAccount.startsWith('@')) {
    xUrl = `https://x.com/${xAccount.replace(/^@/, '')}`;
  } else if (xAccount && xAccount.startsWith('https://x.com/')) {
    xUrl = xAccount;
  }
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-100">
      <div className="aspect-video relative overflow-hidden flex items-center justify-center bg-white">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={caseData['サービス名・プロジェクト名を教えてください']}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400"
            }}
          />
        ) : siteUrl ? (
          <OGPImage url={siteUrl} alt={caseData['サービス名・プロジェクト名を教えてください']} className="w-full h-full object-contain" />
        ) : (
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400"
            alt="デフォルト画像"
            className="w-full h-full object-contain"
          />
        )}
        <div className="absolute top-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1 text-sm font-medium text-gray-700">
            <IconComponent size={14} />
            {caseData['活用ジャンルを選択してください']}
          </div>
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
          {caseData['サービス名・プロジェクト名を教えてください']}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {caseData['どのようなNFT活用をしているか、100文字以内で教えてください']}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">#{caseData['活用ジャンルを選択してください']}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <a 
              href={caseData['サイト・EC・SNSなどのURLを教えてください']}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>見る</span>
              <ExternalLink size={14} />
            </a>
            {xUrl && (
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                title="運営責任者Xアカウント"
              >
                <Twitter size={14} />
                <span>X（運営責任者）</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// メインページコンポーネント
export default function DirectoryPage() {
  const [cases, setCases] = useState<CaseData[]>([])
  const [filteredCases, setFilteredCases] = useState<CaseData[]>([])
  const [selectedGenre, setSelectedGenre] = useState('全て')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCasesFromSheet()
        setCases(data)
        setFilteredCases(data)
      } catch (error) {
        console.error('データ読み込みエラー:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // フィルタリング処理
  useEffect(() => {
    let filtered = cases
    
    if (selectedGenre !== '全て') {
      filtered = filtered.filter(c => c['活用ジャンルを選択してください'] === selectedGenre)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c['サービス名・プロジェクト名を教えてください'].toLowerCase().includes(searchTerm.toLowerCase()) ||
        c['どのようなNFT活用をしているか、100文字以内で教えてください'].toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    
    setFilteredCases(filtered)
  }, [cases, selectedGenre, searchTerm])

  const genres = ['全て', ...new Set(cases.map(c => c['活用ジャンルを選択してください']))]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">データを読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      {/* 背景画像 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url("/shikibu-bg.jpg")'
        }}
      ></div>
      {/* コンテンツ */}
      <div className="relative z-10">
        {/* ヘッダー */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                しきぶちゃんの二次創作店
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                しきぶちゃんNFTを活用している実際のプロジェクトを発見しよう
              </p>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* フィルター＆検索 */}
          <div className="mb-8 space-y-4">
            {/* 検索バー */}
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="サービス名や内容で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>

            {/* ジャンルフィルター */}
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <Filter size={20} className="text-gray-500" />
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedGenre === genre
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm border border-gray-200'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {/* 結果表示 */}
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredCases.length}件の事例が見つかりました
            </p>
          </div>

          {/* カードグリッド */}
          {filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCases.map((caseData, index) => (
                <CaseCard key={index} case={caseData} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                該当する事例が見つかりませんでした
              </h3>
              <p className="text-gray-600">
                検索条件を変更してもう一度お試しください
              </p>
            </div>
          )}

          {/* フッター */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-gray-600 mb-4">
                しきぶちゃんNFTで二次創作プロジェクトを運営している方は必須でご登録ください。
              </p>
              <a
                href={process.env.NEXT_PUBLIC_GOOGLE_FORM_URL || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
              >
                <span>事例を登録する</span>
                <ExternalLink size={16} />
              </a>
              <div className="mt-4">
                <a
                  href="https://shikibuworld.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <span>しきぶちゃんNFTを購入する</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}