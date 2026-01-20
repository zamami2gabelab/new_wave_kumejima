import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { PlanCard } from "./components/PlanCard";
import { PlanModal } from "./components/PlanModal";
import { Testimonials } from "./components/Testimonials";
import { Safety } from "./components/Safety";
import { BookingFlow } from "./components/BookingFlow";
import { FAQ } from "./components/FAQ";
import { Access } from "./components/Access";
import { FixedCTA } from "./components/FixedCTA";
import { AdditionalOptions } from "./components/AdditionalOptions";
import { SingleMenus } from "./components/SingleMenus";
import { FreeRentals } from "./components/FreeRentals";
import { ContactCTA } from "./components/ContactCTA";
import { WizardLayout } from "./components/WizardLayout";
import { Button } from "./components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";

// プランデータ
const plans = [
  {
    id: "wakuwaku",
    name: "わくわくプラン",
    image: "image/wakuwaku.png",
    price: "12,000",
    childPrice: "8,000",
    duration: "3時間",
    capacity: "2名〜",
    highlight: "人気No.1",
    description: "はての浜上陸、シュノーケリング、マリンスポーツを1つ楽しめる基本プラン。初めての方におすすめです。",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "マリンスポーツ1種",
      "パラソル、チェアレンタル",
      "ライフジャケット",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発（約15分）" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "10:00", activity: "シュノーケリング体験" },
      { time: "11:00", activity: "マリンスポーツ体験" },
      { time: "11:45", activity: "自由時間" },
      { time: "12:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n\n※ウェットスーツは無料レンタル可能です",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・妊娠中の方はご参加いただけません\n・持病のある方は事前にご相談ください\n・天候により開催できない場合があります"
  },
  {
    id: "manzoku",
    name: "まんぞくプラン",
    image: "image/manzoku.png",
    price: "15,000",
    childPrice: "11,000",
    duration: "4時間",
    capacity: "2名〜",
    highlight: "スタッフおすすめ",
    description: "わくわくプランにうみがめ探索が追加された充実プラン。マリンスポーツを楽しみつつ、うみがめとの出会いを楽しみたい方に。",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "マリンスポーツ1種",
      "うみがめ探索",
      "パラソル、チェアレンタル",
      "ライフジャケット",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "10:00", activity: "シュノーケリング体験" },
      { time: "11:00", activity: "うみがめ探索" },
      { time: "11:30", activity: "マリンスポツ体験" },
      { time: "12:30", activity: "自由時間" },
      { time: "13:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n防水カメラ（推奨）\n\n※ウェットスーツは無料レンタル可能です",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・野生のうみがめを探すため、必ず会えるとは限りません\n・妊娠中の方はご参加いただけません\n・天候により開催できない場合があります"
  },
  {
    id: "asobihoudai",
    name: "遊び放題プラン",
    image: "image/asobihoudai.png",
    price: "18,000",
    childPrice: "15,000",
    duration: "6時間",
    capacity: "2名〜",
    highlight: "たくさん遊びたい！",
    description: "まんぞくプランにマリンスポーツが遊び放題になったプラン。1日中海を満喫したい方向けの贅沢プランです。",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "マリンスポーツ遊び放題",
      "うみがめ探索",
      "パラソル、チェアレンタル",
      "ライフジャケット",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "10:00", activity: "シュノーケリング" },
      { time: "11:00", activity: "うみがめ探索" },
      { time: "11:30", activity: "マリンスポーツ遊び放題" },
      { time: "14:00", activity: "自由時間・写真撮影" },
      { time: "15:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n帽子・サングラス\n着替え\n飲み物・軽食\n\n※長時間の滞在となるため水分補給をこまめに",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・日差しが強いため日焼け対策必須です\n・体力に自信のある方向けのプランです\n・天候により開催できない場合があます"
  },
  {
    id: "ikudake",
    name: "行くだけプラン",
    image: "image/ikudake.png",
    price: "8,000",
    childPrice: "6,000",
    duration: "3時間",
    capacity: "2名〜",
    highlight: "のんびり",
    description: "はての浜へ上陸して、のんびり過ごしたい方向けのシンプルプラン。",
    included: [
      "はての浜上陸",
      "パラソル、チェアレンタル",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "09:30", activity: "自由時間" },
      { time: "12:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n読書など好きなもの\n\n※アクティビティは含まれません",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・年齢制限はありません\n・写真撮影やのんびり過ごしたい方向けです\n・追加でアクティビティをご希望の場合は、遊び放題チケットや単品メニューをご利用ください\n・天候により開催できない場合があります"
  }
];

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // URLハッシュで予約フォームを表示するかチェック
  useEffect(() => {
    if (window.location.hash === "#booking") {
      setShowBookingForm(true);
    }
  }, []);

  const handleBookingClick = (planId?: string) => {
    // 予約フォームを表示
    setShowBookingForm(true);
    window.history.pushState(null, "", "#booking");
  };

  const handleLineClick = () => {
    window.open("https://page.line.me/ltr9609x?oat_content=url&openQrModal=true", "_blank");
  };

  const handleBackToHome = () => {
    setShowBookingForm(false);
    window.history.pushState(null, "", "#");
  };

  // 予約フォームページを表示
  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          onBookingClick={handleBookingClick}
          onLineClick={handleLineClick}
          onBackToHome={handleBackToHome}
          isBookingForm={true}
        />
        <div className="pt-16">
          <WizardLayout />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* ヘッダーセクション */}
      <Header 
        onBookingClick={() => handleBookingClick()}
        onLineClick={handleLineClick}
        onBackToHome={handleBackToHome}
        isBookingForm={false}
      />

      {/* ヒーローセクション */}
      <Hero 
        onBookingClick={() => handleBookingClick()}
        onLineClick={handleLineClick}
      />

      {/* 体験の予告 */}
      <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl mb-4">360度、透明な世界</h2>
          <p className="text-lg text-gray-300 mb-8">
            久米島から船で15分。<br className="md:hidden" />
            真っ白な砂浜と透き通る海だけの楽園へ。
          </p>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="h-64 rounded-lg overflow-hidden">
              <img 
                src="/image/service1.png"
                alt="はての浜"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <img 
                src="/image/service2.png"
                alt="SUP体験"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="h-64 rounded-lg overflow-hidden">
              <img 
                src="/image/service3.png"
                alt="楽しい思い出"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* プラン選択 */}
      <section id="plans" className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl mb-3">プランを選ぶ</h2>
            <p className="text-gray-600">あなたに合った体験を</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onDetailsClick={() => setSelectedPlan(plan)}
              />
            ))}
          </div>

          {/* CTA */}
          <ContactCTA onLineClick={handleLineClick} />
        </div>
      </section>

      {/* 追加オプション */}
      <AdditionalOptions onBookingClick={handleBookingClick} />

      {/* 単品メニュー */}
      <SingleMenus />

      {/* 無料レンタル品 */}
      {/* <FreeRentals /> */}

      {/* お客様の声 */}
      <Testimonials />

      {/* 安全への取り組み */}
      <Safety />

      {/* 予約の流れ */}
      <BookingFlow />

      {/* よくある質問 */}
      <FAQ onLineClick={handleLineClick} />

      {/* アクセス */}
      <Access />

      {/* 最終CTA */}
      <section className="py-20 px-4 relative bg-cover bg-center bg-no-repeat text-white" style={{ backgroundImage: 'url(/image/top.png)' }}>
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-3xl">さあ、天国の海へ</h2>
          <p className="text-xl text-white/90">
            一生忘れられない、最高の体験を。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button 
              onClick={() => handleBookingClick()}
              size="lg"
              className="flex-1 h-14 text-lg bg-[#F97316] hover:bg-[#EA580C] rounded-full"
            >
              <Calendar className="mr-2 h-5 w-5" />
              今すぐ予約
            </Button>
            <Button 
              onClick={handleLineClick}
              size="lg"
              variant="outline"
              className="flex-1 h-14 text-lg bg-white hover:bg-gray-50 text-gray-900 rounded-full border-0"
            >
              <MessageCircle className="mr-2 h-5 w-5" />
              LINEで相談
            </Button>
          </div>
        </div>
      </section>

      {/* フッター */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <h3 className="text-2xl mb-4">New Wave 久米島</h3>
          <p className="text-gray-400 text-sm">
            TEL: <a href="tel:098-987-1318" className="hover:text-white transition-colors">098-987-1318</a> <br>
            </br> MAIL: <a href="mailto:yukocrest.mobile@gmail.com" className="hover:text-white transition-colors">yukocrest.mobile@gmail.com</a>
          </p>
          <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm">
            © 2026 Hateno Hama Marine Service. All rights reserved.
          </div>
        </div>
      </footer>

      {/* モーダル */}
      <PlanModal
        plan={selectedPlan}
        open={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onBooking={() => {
          handleBookingClick(selectedPlan?.id);
          setSelectedPlan(null);
        }}
        onLineClick={handleLineClick}
      />

      {/* 固定CTA */}
      <FixedCTA
        onBookingClick={() => handleBookingClick()}
        onLineClick={handleLineClick}
      />
    </div>
  );
}