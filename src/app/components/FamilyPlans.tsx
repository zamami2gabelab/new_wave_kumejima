import { Clock, Users, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface FamilyPlansProps {
  onBooking: (planId: string) => void;
  onBack: () => void;
}

const familyPlans = [
  {
    id: "PLAN_FAMILY_FULL",
    rank: "1",
    name: "ファミリーアクティビティープラン（1日）",
    duration: "6時間",
    capacity: "2名〜",
    adultPrice: "15,000",
    childPrice: "10,000",
    catchphrase: "はての浜を1日まるごと楽しむ！",
    description:
      "家族みんなで楽しめる1日フルプランです。はての浜上陸からシュノーケル、トーイングチューブまで、海の思い出を全部詰め込みました。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "トーイングチューブ2種類",
      "メモリアルフォト",
      "昼食",
      "ソフトドリンク飲み放題",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "写真撮影サービス付き",
      "家族向けメニュー準備",
      "子どもも楽しめるアクティビティ"
    ]
  },
  {
    id: "PLAN_FAMILY_HALF",
    rank: "2",
    name: "ファミリーアクティビティープラン（半日）",
    duration: "3.5時間",
    capacity: "2名〜",
    adultPrice: "10,000",
    childPrice: "8,000",
    catchphrase: "午前中で家族の笑顔を引き出す！",
    description:
      "午前中で効率よく、家族向けアクティビティを楽しむプランです。はての浜の美しさとマリンスポーツの興奮を両方味わえます。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "トーイングチューブ1種類",
      "ソフトドリンク一杯サービス",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "朝出発で午後は自由",
      "子ども向けレッスン付き",
      "気軽に参加できる"
    ]
  },
  {
    id: "PLAN_FAMILY_RELAX",
    rank: "3",
    name: "ファミリーゆったりプラン（半日）",
    duration: "3時間",
    capacity: "2名〜",
    adultPrice: "7,000",
    childPrice: "5,000",
    catchphrase: "ゆっくり、のんびり、家族時間！",
    description:
      "アクティビティは控えめに、家族でゆったりはての浜を楽しむプランです。小さなお子さんがいるファミリーにおすすめです。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "ソフトドリンク一杯サービス",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    highlights: [
      "小さな子どもも安心",
      "無理のないスケジュール",
      "写真撮影時間もたっぷり"
    ]
  }
];

export function FamilyPlans({ onBooking, onBack }: FamilyPlansProps) {
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* ヘッダー */}
      <div className="text-white py-16 px-4 bg-cover bg-center relative" style={{ backgroundImage: 'url(/image/family.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <button
            onClick={onBack}
            className="mb-6 text-sm font-semibold hover:opacity-80 transition-opacity"
          >
            ← 戻る
          </button>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
            波の向こうに、忘れられない1日を…
            </h1>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* イントロ */}
        <div className="mb-16 text-center">
          <p className="text-gray-700 text-lg max-w-2xl mx-auto">
            お子さんから大人まで、みんなが楽しめるプランをご用意しました。
            はての浜の美しさとマリンスポーツの興奮を、ご家族で共有できます。
          </p>
        </div>

        {/* プランカード */}
        <div className="relative">
          <div ref={carouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
            {familyPlans.map((plan) => (
              <div key={plan.id} className="flex-shrink-0 w-full md:w-[min(100vw-4rem,1100px)] snap-start">
                <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow h-full">
                  <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                      {/* 左側：プラン情報 */}
                      <div className="md:col-span-2 p-8 bg-white">
                        {/* プラン番号とタイトル */}
                        <div className="mb-4">
                          <div className="inline-block bg-[#F97316] text-white px-3 py-1 rounded-full text-sm font-semibold mb-2">
                            プラン {plan.rank}
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800 mb-2">
                            {plan.name}
                          </h3>
                          <p className="text-[#0EA5E9] font-semibold text-lg">
                            {plan.catchphrase}
                          </p>
                        </div>

                        {/* 説明 */}
                        <p className="text-gray-700 mb-6">{plan.description}</p>

                        {/* メタ情報 */}
                        <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-[#0EA5E9]" />
                            <span>{plan.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-[#0EA5E9]" />
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
                                <CheckCircle2 className="h-5 w-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                                <span className="text-sm text-gray-700">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* おすすめポイント */}
                        <div className="bg-blue-50 p-4 rounded-lg">
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
                      <div className="bg-gradient-to-b from-[#0EA5E9] to-[#06B6D4] text-white p-8 flex flex-col justify-between">
                        <div>
                          <div className="text-center mb-8">
                            <p className="text-sm font-semibold mb-2">大人 / 人</p>
                            <div className="text-4xl font-bold mb-4">
                              ¥{plan.adultPrice}
                            </div>
                            <p className="text-sm font-semibold mb-2">
                              小人（4-15歳）/ 人
                            </p>
                            <div className="text-3xl font-bold">
                              ¥{plan.childPrice}
                            </div>
                          </div>
                          <p className="text-xs text-blue-100 text-center">
                            0-3歳は無料
                          </p>
                        </div>

                        <Button
                          onClick={() => onBooking(plan.id)}
                          className="w-full bg-white text-[#0EA5E9] hover:bg-gray-100 font-semibold rounded-full py-3"
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

        {/* よくある質問 */}
        <div className="mt-16 bg-white p-8 rounded-lg shadow">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">よくあるご質問</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                小さな子どもでも参加できますか？
              </h4>
              <p className="text-gray-700">
                4歳以上であれば全てのプランに参加できます。0-3歳のお子さんは無料で同伴していただけます。
                ファミリーゆったりプランであれば、小さなお子さんがいても安心です。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                水が苦手な子どもでも大丈夫ですか？
              </h4>
              <p className="text-gray-700">
                もちろんです。ライフジャケットの着用やスタッフのサポートがあるので、
                初めての海でも安心です。ファミリーゆったりプランでしたら、
                海に入らずはての浜でのんびり過ごすこともできます。
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                食事についてはどうなっていますか？
              </h4>
              <p className="text-gray-700">
                1日プランに昼食が含まれています。半日プランはドリンクサービスのみとなっていますが、
                ご自身でお弁当をお持ちいただくこともできます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
