import { useState, useEffect, useRef } from "react";
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
import { PlanCategoryLinks } from "./components/PlanCategoryLinks";
import { FamilyPlans } from "./components/FamilyPlans";
import { CouplePlans } from "./components/CouplePlans";
import { GroupPlans } from "./components/GroupPlans";
import { Button } from "./components/ui/button";
import { Calendar, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react";

// プランデータ
const plans = [
  {
    id: "nonbiri",
    name: "のんびりはての浜プラン",
    image: "image/plan_nonbiri.png",
    price: "6,000",
    childPrice: "4,500",
    duration: "3時間",
    capacity: "2名〜",
    highlight: "のんびり",
    description: "はての浜上陸のみのプランです。のんびりと砂浜で過ごしたい方向け。",
    included: [
      "はての浜上陸",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発（約15分）" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "09:45", activity: "自由時間" },
      { time: "16:00", activity: "帰港・解散" }
    ],
    items: "日焼け止め\n飲み物",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・妊娠中の方はご参加いただけません\n・潮の状況によりスケジュールが変更になる場合があります\n・天候により開催できない場合があります"
  },
  {
    id: "bananaboat",
    name: "はての浜バナナボートプラン",
    image: "image/bananaboat.png",
    price: "8,000",
    childPrice: "6,000",
    duration: "4時間",
    capacity: "2名〜",
    highlight: "定番",
    description: "沖合シュノーケルとバナナボートがセットになったプラン",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "バナナボート",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "10:00", activity: "シュノーケリング体験" },
      { time: "11:00", activity: "バナナボート体験" },
      { time: "11:30", activity: "自由時間" },
      { time: "13:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n防水カメラ（推奨）\n",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・妊娠中の方はご参加いただけません\n・潮の状況によりスケジュールが変更になる場合があります\n・天候により開催できない場合があります"
  },
  {
    id: "suinbou",
    name: "はての浜スインボーで遊ぼープラン",
    image: "image/suinbou.png",
    price: "10,000",
    childPrice: "8,000",
    duration: "6時間",
    capacity: "2名〜",
    highlight: "新体験",
    description: "沖合シュノーケルとスインボーがセットになったプラ",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "スインボー",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "10:00", activity: "シュノーケリング" },
      { time: "11:00", activity: "スインボー体験" },
      { time: "14:00", activity: "自由時間" },
      { time: "15:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n帽子・サングラス\n着替え\n飲み物・軽食\n\n※長時間の滞在となるため水分補給をこまめに",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・日差しが強いため日焼け対策必須です\n・潮の状況によりスケジュールが変更になる場合があります\n・天候により開催できない場合があます"
  },
  {
    id: "asobitsukushi",
    name: "はての浜遊びつくしプラン",
    image: "image/asobitsukushi.png",
    price: "20,000",
    childPrice: "18,000",
    duration: "3時間",
    capacity: "2名〜",
    highlight: "たくさん遊びたい",
    description: "沖合シュノーケルとトーイングチューブ全種類各1回ずつ遊べる贅沢プラン",
    included: [
      "はての浜上陸",
      "沖合ポイントシュノーケル",
      "往復船代",
      "保険料"
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "船で出発" },
      { time: "09:30", activity: "はての浜到着" },
      { time: "09:30", activity: "シュノーケリング" },
      { time: "10:00", activity: "トーイングチューブ体験" },
      { time: "15:00", activity: "帰港・解散" }
    ],
    items: "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n読書など好きなもの\n\n※アクティビティは含まれません",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・日差しが強いため日焼け対策必須です\n・潮の状況によりスケジュールが変更になる場合があります\n・天候により開催できない場合があます" 
  },
  {
    id: "jetcruising",
    name: "はての浜ジェットクルージングプラン",
    image: "image/jetcruising.png",
    price: "10,000",
    childPrice: "7,000",
    duration: "3時間",
    capacity: "2名〜",
    highlight: "爽快",
    description: "港から海をドライブするプランです。はての浜上陸は含まれません。",
    included: [
      "沖合ジェットクルージング",
    ],
    schedule: [
      { time: "09:00", activity: "泊港集合・受付" },
      { time: "09:15", activity: "ジェットクルージングで出発" },
      { time: "10:15", activity: "泊港到着" }
    ],
    items: "水着（事前着用推奨）\n日焼け止め\n",
    cancellation: "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料",
    notes: "・4歳以上から参加可能です\n・日差しが強いため日焼け対策必須です\n・潮の状況によりスケジュールが変更になる場合があります\n・天候により開催できない場合があます" 
  },

];

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentPage, setCurrentPage] = useState<"home" | "family" | "couple" | "group">("home");
  const planCarouselRef = useRef<HTMLDivElement>(null);
  const categoryCarouselRef = useRef<HTMLDivElement>(null);

  // URLハッシュで予約フォームを表示するかチェック
  useEffect(() => {
    const hash = window.location.hash;
    if (hash === "#booking") {
      setShowBookingForm(true);
    } else if (hash === "#family") {
      setCurrentPage("family");
    } else if (hash === "#couple") {
      setCurrentPage("couple");
    } else if (hash === "#group") {
      setCurrentPage("group");
    } else {
      setCurrentPage("home");
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
    setCurrentPage("home");
    window.history.pushState(null, "", "#");
  };

  const handleNavigateToPage = (page: "family" | "couple" | "group") => {
    setCurrentPage(page);
    window.history.pushState(null, "", `#${page}`);
    window.scrollTo(0, 0);
  };

  const scrollPlanCarousel = (direction: "left" | "right") => {
    if (planCarouselRef.current) {
      const scrollAmount = 400;
      if (direction === "left") {
        planCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        planCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const scrollCategoryCarousel = (direction: "left" | "right") => {
    if (categoryCarouselRef.current) {
      const scrollAmount = 400;
      if (direction === "left") {
        categoryCarouselRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        categoryCarouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // 各ページの表示処理
  if (currentPage === "family") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onBookingClick={handleBookingClick}
          onLineClick={handleLineClick}
          onBackToHome={handleBackToHome}
          isBookingForm={false}
        />
        <FamilyPlans
          onBooking={(planId) => handleBookingClick(planId)}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  if (currentPage === "couple") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onBookingClick={handleBookingClick}
          onLineClick={handleLineClick}
          onBackToHome={handleBackToHome}
          isBookingForm={false}
        />
        <CouplePlans
          onBooking={(planId) => handleBookingClick(planId)}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

  if (currentPage === "group") {
    return (
      <div className="min-h-screen bg-white">
        <Header 
          onBookingClick={handleBookingClick}
          onLineClick={handleLineClick}
          onBackToHome={handleBackToHome}
          isBookingForm={false}
        />
        <GroupPlans
          onBooking={() => handleBookingClick()}
          onBack={handleBackToHome}
        />
      </div>
    );
  }

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
            <p className="text-gray-600">すべてのプランでシュノーケル、フィン無料レンタルできます</p>
          </div>

          {/* 通常プラン */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              定番プラン
            </h3>
            
            <div className="relative">
              {/* スクロール可能なコンテナ */}
              <div
                ref={planCarouselRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollBehavior: "smooth" }}
              >
                {plans.map((plan) => (
                  <div key={plan.id} className="flex-shrink-0 w-96">
                    <PlanCard
                      plan={plan}
                      onDetailsClick={() => setSelectedPlan(plan)}
                    />
                  </div>
                ))}
              </div>

              {/* 左右のナビゲーションボタン */}
              <button
                onClick={() => scrollPlanCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                aria-label="前へスクロール"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => scrollPlanCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                aria-label="次へスクロール"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>

          
          {/* カテゴリーリンク */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
              目的別プラン
            </h3>
            <div className="relative">
              <div
                ref={categoryCarouselRef}
                className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollBehavior: "smooth" }}
              >
                {[
                  {
                    id: "family",
                    title: "家族におすすめ！",
                    subtitle: "波の向こうに、忘れられない1日を…",
                    icon: "",
                    backgroundImage: "/image/family.png",
                    onClick: () => handleNavigateToPage("family")
                  },
                  {
                    id: "couple",
                    title: "カップルにおすすめ！",
                    subtitle: "今日という日を特別に…",
                    icon: "",
                    backgroundImage: "/image/couple.png",
                    onClick: () => handleNavigateToPage("couple")
                  },
                  {
                    id: "group",
                    title: "団体様おすすめ！",
                    subtitle: "グループ専用の貸切プラン",
                    icon: "",
                    backgroundImage: "/image/group.png",
                    onClick: () => handleNavigateToPage("group")
                  }
                ].map((link) => (
                  <div key={link.id} className="flex-shrink-0 w-96">
                    <PlanCategoryLinks links={[link]} />
                  </div>
                ))}
              </div>

              {/* 左右のナビゲーションボタン */}
              <button
                onClick={() => scrollCategoryCarousel("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                aria-label="前へスクロール"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => scrollCategoryCarousel("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                aria-label="次へスクロール"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </section>

      
      {/* CTA */}
      <ContactCTA onLineClick={handleLineClick} />

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