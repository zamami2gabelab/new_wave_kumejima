import { Clock, Users, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface CouplePlansProps {
  onBooking: (planId: string) => void;
  onBack: () => void;
}

const couplePlans = [
  {
    id: "PLAN_COUPLE_SPECIAL",
    rank: "1",
    name: "はての浜スペシャルペアプラン（1日）",
    duration: "6時間",
    capacity: "2名〜",
    price: "16,000",
    catchphrase: "二人きりの特別な1日を演出します",
    description:
      "カップルのためにデザインされた最高峰プラン。プライベート空間でメモリアルフォト撮影、ハートサンゴ見学、豪華な昼食…すべてが二人の思い出になります。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "トーイングチューブ2種類",
      "ハートサンゴ見学",
      "メモリアルフォト撮影",
      "昼食（カップル向けメニュー）",
      "ソフトドリンク飲み放題",
      "プライベート空間確保",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "専属カメラマンによるフォト撮影",
      "ハートサンゴで特別な時間",
      "二人だけの特別な空間",
      "プロポーズやアニバーサリーに最適"
    ]
  },
  {
    id: "PLAN_COUPLE_MARINE",
    rank: "2",
    name: "はての浜ペアマリン体験プラン（半日）",
    duration: "3.5時間",
    capacity: "2名〜",
    price: "12,000",
    catchphrase: "二人で海の興奮を共有",
    description:
      "マリンスポーツとロマンティックな体験が両立するプラン。はての浜の美しさを感じながら、二人で冒険を楽しみましょう。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "トーイングチューブ1種類",
      "ハートサンゴ見学",
      "ソフトドリンク一杯サービス",
      "プライベート空間確保",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "二人で楽しむマリンスポーツ",
      "ハートサンゴへの特別な案内",
      "プライベート感のある体験",
      "午前・午後どちらでも選択可能"
    ]
  },
  {
    id: "PLAN_COUPLE_BASIC",
    rank: "3",
    name: "はての浜ペアプラン（半日）",
    duration: "3時間",
    capacity: "2名〜",
    price: "8,000",
    catchphrase: "二人でのんびり、ロマンティックに",
    description:
      "シンプルだけど、最高にロマンティック。はての浜でハートサンゴを眺め、二人だけの時間を満喫するプランです。",
    included: [
      "沖合シュノーケル",
      "ハートサンゴ見学",
      "ソフトドリンク一杯サービス",
      "プライベート空間確保",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "ロマンティックな海の時間",
      "ハートサンゴで愛を確認",
      "リーズナブルな価格帯",
      "初めてのカップルにも最適"
    ]
  }
];

export function CouplePlans({ onBooking, onBack }: CouplePlansProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const firstChild = carouselRef.current.children[0] as HTMLElement;
      const cardWidth = firstChild?.getBoundingClientRect().width || 400;
      // gap-6 = 1.5rem = 24px
      const scrollAmount = cardWidth + 24;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      {/* ヘッダー */}
      <div className="text-white py-16 px-4 bg-cover bg-center relative" style={{ backgroundImage: 'url(/image/couple.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="mb-6 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            ← 戻る
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            今日という日を特別に…
          </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* イントロ */}
        <div className="mb-16 text-center">
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            二人だけの特別な時間を演出するプランをご用意しました。
            ハートサンゴでの特別な瞬間、美しいはての浜での思い出…
            大切な人とのロマンティックな時間をお過ごしください。
          </p>
        </div>

        {/* プランカード */}
        <div className="relative">
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {couplePlans.map((plan) => (
              <div key={plan.id} className="flex-shrink-0 w-full md:w-[min(100vw-4rem,1100px)] snap-start">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* 左側：プラン情報 */}
                      <div className="md:col-span-2 p-8 bg-white">
                        {/* プラン番号とタイトル */}
                        <div className="mb-4">
                          <div className="inline-block bg-rose-400 text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                            プラン {plan.rank}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-rose-400 font-semibold text-lg">
                            {plan.catchphrase}
                          </p>
                        </div>

                        {/* 説明 */}
                        <p className="text-gray-700 mb-6">{plan.description}</p>

                        {/* メタ情報 */}
                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-rose-400" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-rose-400" />
                            <span>{plan.capacity}</span>
                          </div>
                        </div>

                        {/* 含まれるもの */}
                        <div className="mb-6">
                          <h4 className="font-semibold text-gray-800 mb-3">
                            含まれるもの
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {plan.included.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle2 className="h-5 w-5 text-rose-400 flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* おすすめポイント */}
                        <div className="bg-pink-50 p-4 rounded-lg">
                          <h4 className="font-semibold text-gray-800 mb-2">
                            このプランのおすすめ
                          </h4>
                          <ul className="space-y-1">
                            {plan.highlights.map((highlight, idx) => (
                              <li key={idx} className="text-sm text-gray-700">
                                ✓ {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* 右側：価格と予約 */}
                      <div className="bg-gradient-to-b from-rose-400 to-pink-400 text-white p-8 flex flex-col justify-between">
                        <div>
                          <div className="text-center mb-8">
                            <p className="text-sm font-semibold mb-2">1名様</p>
                            <div className="text-4xl font-bold">
                              ¥{plan.price}
                            </div>
                            <p className="text-xs text-rose-100 mt-4 font-semibold">
                              ❤️ 二人で¥{(parseInt(plan.price.replace(/,/g, '')) * 2).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <Button
                          onClick={() => onBooking(plan.id)}
                          className="w-full bg-white text-rose-400 hover:bg-gray-100 font-semibold rounded-full py-3"
                        >
                          このプランで予約
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* ナビゲーションボタン */}
          <button
            onClick={() => scrollCarousel("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/* 特別な瞬間 */}
        <div className="mt-16 bg-gradient-to-r from-rose-100 to-pink-100 p-8 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">
            こんなシーンに最適です
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-3">
              <span className="text-3xl">💍</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">プロポーズ</h4>
                <p className="text-sm text-gray-700">
                  最高の瞬間を演出します。スペシャルペアプランがおすすめです。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-3xl">🎂</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  アニバーサリー
                </h4>
                <p className="text-sm text-gray-700">
                  特別な記念日を海で祝いましょう。メモリアルフォト付き。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-3xl">✨</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  新婚旅行
                </h4>
                <p className="text-sm text-gray-700">
                  沖縄での思い出作りに。プライベート空間で二人きりの時間。
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-3xl">🌅</span>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  日常からの脱出
                </h4>
                <p className="text-sm text-gray-700">
                  二人だけの特別な空間で、日常を忘れてリラックス。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* よくある質問 */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">よくあるご質問</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                プロポーズに使いたいのですが…
              </h4>
              <p className="text-gray-700">
                スペシャルペアプランがおすすめです。メモリアルフォト、特別な食事、
                プライベート空間が確保されます。事前にご相談いただければ、
                さらに特別な演出をお考えいたします。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                ハートサンゴは必ず見られますか？
              </h4>
              <p className="text-gray-700">
                ハートサンゴはシュノーケリングで見学します。天候や海況により
                見学できない場合もありますが、その場合は別のポイントをご案内します。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                泳ぐのが苦手ですが…
              </h4>
              <p className="text-gray-700">
                ペアプラン（基本プラン）でしたらアクティビティがないので、
                ゆっくりはての浜を散策できます。ライフジャケット着用で
                安全にシュノーケリングも楽しめます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
