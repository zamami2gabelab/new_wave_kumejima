import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
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
import { FreeRentals } from "./components/FreeRentals";
import { ContactCTA } from "./components/ContactCTA";
import { WizardLayout } from "./components/WizardLayout";
import { SeoHead } from "./components/SeoHead";
import { Button } from "./components/ui/button";
import {
  getPathForPage,
  resolveLegacyHashPage,
  resolvePageFromLocation,
  type SeoPage,
} from "./lib/seo";

type PlanDetails = {
  id: string;
  name: string;
  image: string;
  price: string;
  childPrice?: string;
  priceSuffix?: string;
  childPriceLabel?: string;
  duration: string;
  capacity: string;
  highlight: string;
  description: string;
  included: string[];
  hideIncluded?: boolean;
  schedule: { time: string; activity: string }[];
  items: string;
  cancellation: string;
  notes: string;
};

const CANCELLATION_POLICY =
  "7日前まで：無料\n3日前まで：30%\n前日：50%\n当日：100%\n\n※悪天候による中止の場合はキャンセル料無料";
const COMMON_INCLUDED = ["パラソルまたはテント", "ベッドまたはチェア"];
const COMMON_ITEMS =
  "水着（事前着用推奨）\nタオル\n日焼け止め\n飲み物\n\n※ラッシュガードや帽子があると快適です";
const COMMON_NOTES =
  "・4歳以上から参加可能です\n・潮位や海況によりスケジュールが変動する場合があります\n・宿泊先から港までの往復送迎は無料です\n・空港送迎は要相談です";

const standardPlans: PlanDetails[] = [
  {
    id: "nonbiri",
    name: "のんびりはての浜プラン",
    image: "image/plan_nonbiri.png",
    price: "6,000",
    childPrice: "4,500",
    duration: "半日(滞在2時間〜2時間半)",
    capacity: "1名〜",
    highlight: "定番",
    description: "はての浜上陸のみのシンプルな半日プランです。白い砂浜でのんびり過ごしたい方におすすめです。",
    included: ["はての浜上陸", "シュノーケル無料貸出", ...COMMON_INCLUDED],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "港からはての浜へ移動" },
      { time: "滞在", activity: "はての浜で自由時間（約2時間〜2時間半）" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
  {
    id: "activity",
    name: "はての浜アクティビティープラン",
    image: "image/bananaboat.png",
    price: "8,000",
    childPrice: "6,000",
    duration: "半日(滞在2時間〜2時間半)",
    capacity: "1名〜",
    highlight: "人気",
    description: "はての浜上陸に加えて、トーイングチューブ1種を楽しめる半日プランです。",
    included: ["はての浜上陸", "トーイングチューブ1種", "シュノーケル無料貸出", ...COMMON_INCLUDED],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "港からはての浜へ移動" },
      { time: "滞在", activity: "はての浜滞在とトーイングチューブ体験" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
  {
    id: "suinbou",
    name: "はての浜スインボーで遊ぼープラン",
    image: "image/suinbou.png",
    price: "9,000",
    childPrice: "7,000",
    duration: "半日(滞在2時間〜2時間半)",
    capacity: "1名〜",
    highlight: "新体験",
    description: "はての浜上陸とスインボーシュノーケルを組み合わせた半日プランです。",
    included: ["はての浜上陸", "スインボーシュノーケル", "シュノーケル無料貸出", ...COMMON_INCLUDED],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "港からはての浜へ移動" },
      { time: "滞在", activity: "はての浜滞在とスインボーシュノーケル体験" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
  {
    id: "premium",
    name: "はての浜プレミアムプラン（要相談）",
    image: "image/group.png",
    price: "150,000",
    priceSuffix: "円 / 10名まで",
    childPrice: "12,000",
    childPriceLabel: "追加1名",
    duration: "半日(滞在2時間〜2時間半)",
    capacity: "10名まで + 追加対応可",
    highlight: "要相談",
    description:
      "港からはての浜までのチャーター移動に加え、トーイングチューブ1種、スインボー、ソフトドリンク1杯、プロカメラマン撮影が付く特別プランです。",
    included: [
      "はての浜上陸（港からはての浜までチャーター）",
      "トーイングチューブ1種",
      "スインボー",
      "ソフトドリンク1杯",
      "プロカメラマン撮影",
      "シュノーケル無料貸出",
      ...COMMON_INCLUDED,
    ],
    schedule: [
      { time: "集合", activity: "泊フィッシャリーナ集合または宿泊先送迎" },
      { time: "出港", activity: "チャーター船でゆったり移動" },
      { time: "滞在", activity: "はての浜滞在、アクティビティ、撮影" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes:
      "・要相談プランです\n・10名まで150,000円、追加1名ごとに12,000円です\n・空港送迎は要相談です",
  },
  {
    id: "memorial",
    name: "メモリアルはての浜プラン",
    image: "image/couple.png",
    price: "10,000",
    childPrice: "8,000",
    duration: "半日(滞在2時間〜2時間半) + 帰港後体験",
    capacity: "1名〜",
    highlight: "体験付き",
    description:
      "はての浜上陸後、帰港してからインターネットには載っていない隠れ家店でのランチとレジンアート体験を楽しめるプランです。",
    included: ["はての浜上陸", "隠れ家店でのランチ", "レジンアート体験", "シュノーケル無料貸出", ...COMMON_INCLUDED],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "港からはての浜へ移動" },
      { time: "滞在", activity: "はての浜で自由時間" },
      { time: "帰港後", activity: "隠れ家店ランチとレジンアート体験" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
  {
    id: "jetcruise",
    name: "ジェットクルーズ",
    image: "image/jetcruising.png",
    price: "10,000",
    childPrice: "7,000",
    duration: "1時間",
    capacity: "1名〜",
    highlight: "映えスポット",
    description: "久米島近海の映えスポットを巡る1時間のジェットクルーズです。",
    included: ["久米島近海映えスポット巡り", ...COMMON_INCLUDED],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出発", activity: "ジェットで近海クルーズ" },
      { time: "終了", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: "濡れても良い服装\n日焼け止め\n飲み物",
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
];

const seasonalPlans: PlanDetails[] = [
  {
    id: "asobitsukushi",
    name: "はての浜遊びつくしプラン",
    image: "image/asobitsukushi.png",
    price: "15,000",
    childPrice: "13,000",
    duration: "滞在約6時間",
    capacity: "1名〜",
    highlight: "夏限定",
    description:
      "7月・8月限定の1日プランです。はての浜上陸、沖合シュノーケル、トーイングチューブ1種、スインボーに加え、ランチとソフトドリンクも付いています。",
    included: [
      "はての浜上陸",
      "沖合シュノーケル",
      "トーイングチューブ1種",
      "スインボー",
      "ランチ",
      "ソフトドリンク",
      ...COMMON_INCLUDED,
    ],
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "港からはての浜へ移動" },
      { time: "日中", activity: "約6時間の滞在で各種アクティビティを満喫" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: "・7月、8月限定のプランです\n" + COMMON_NOTES,
  },
];

const sunsetPlans: PlanDetails[] = [
  {
    id: "sunset-jet",
    name: "サンセットジェットクルーズ",
    image: "image/sunset.png",
    price: "10,000",
    childPrice: "7,000",
    duration: "1時間",
    capacity: "1日6名限定",
    highlight: "夕日",
    description: "水上バイクに乗りながら、爽快かつゆったりと最高の夕日を楽しむプランです。",
    included: ["サンセットジェットクルーズ", ...COMMON_INCLUDED],
    hideIncluded: true,
    schedule: [
      { time: "夕方", activity: "港集合・夕日クルーズへ出発" },
      { time: "日没前後", activity: "水上バイクでサンセットを堪能" },
      { time: "終了", activity: "帰港して解散" },
    ],
    items: "濡れても良い服装\nタオル\n日焼け止め",
    cancellation: CANCELLATION_POLICY,
    notes: "・1日6名限定です\n・所要時間は1時間です",
  },
  {
    id: "sunset-cruise",
    name: "サンセットクルーズ",
    image: "image/sunset.png",
    price: "6,000",
    childPrice: "5,000",
    duration: "1時間",
    capacity: "1日10名限定",
    highlight: "船上",
    description: "船の上で思い出に残る夕日を眺める、ゆったりしたサンセットクルーズです。",
    included: ["サンセットクルーズ", ...COMMON_INCLUDED],
    hideIncluded: true,
    schedule: [
      { time: "夕方", activity: "港集合・サンセットクルーズへ出発" },
      { time: "日没前後", activity: "船上から夕景を鑑賞" },
      { time: "終了", activity: "帰港して解散" },
    ],
    items: "軽い羽織り\n飲み物\n日焼け止め",
    cancellation: CANCELLATION_POLICY,
    notes: "・1日10名限定です\n・所要時間は1時間です",
  },
  {
    id: "sunset-sup",
    name: "サンセットサップ",
    image: "image/sunset.png",
    price: "5,000",
    childPrice: "4,000",
    duration: "1時間",
    capacity: "1日6名限定",
    highlight: "SUP",
    description: "ゆったりと海に浮かびながら、最高の夕日を楽しむサップ体験です。",
    included: ["サンセットサップ", ...COMMON_INCLUDED],
    hideIncluded: true,
    schedule: [
      { time: "夕方", activity: "港集合・サップ体験の準備" },
      { time: "日没前後", activity: "SUPに乗ってサンセットを満喫" },
      { time: "終了", activity: "解散" },
    ],
    items: "濡れても良い服装\nタオル\n飲み物",
    cancellation: CANCELLATION_POLICY,
    notes: "・1日6名限定です\n・所要時間は1時間です",
  },
];

const snorkelPlans: PlanDetails[] = [
  {
    id: "snorkel",
    name: "久米島近海シュノーケルプラン",
    image: "image/service2.png",
    price: "8,000",
    childPrice: "6,000",
    duration: "2時間半〜3時間",
    capacity: "1名〜",
    highlight: "近海",
    description: "久米島近海のポイントを巡りながら、場所ごとの魅力を楽しめるシュノーケルプランです。",
    included: ["久米島近海シュノーケル", ...COMMON_INCLUDED],
    hideIncluded: true,
    schedule: [
      { time: "集合", activity: "宿泊先送迎または泊フィッシャリーナ集合" },
      { time: "出港", activity: "その日のベストポイントへ移動" },
      { time: "体験", activity: "シュノーケルを満喫" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: COMMON_NOTES,
  },
  {
    id: "premium-snorkel",
    name: "久米島プレミアムシュノーケルプラン（10名迄）",
    image: "image/service1.png",
    price: "60,000",
    priceSuffix: "円 / 10名まで",
    duration: "2時間半〜3時間",
    capacity: "10名まで",
    highlight: "チャーター",
    description: "船チャーター、スインボー、ソフトドリンク1杯無料が付いたプレミアムシュノーケルプランです。",
    included: ["船チャーター", "スインボー", "ソフトドリンク1杯"],
    schedule: [
      { time: "集合", activity: "泊フィッシャリーナ集合または宿泊先送迎" },
      { time: "出港", activity: "チャーター船でポイントへ移動" },
      { time: "体験", activity: "プレミアムシュノーケル体験" },
      { time: "帰港", activity: "港到着後に解散または宿泊先送迎" },
    ],
    items: COMMON_ITEMS,
    cancellation: CANCELLATION_POLICY,
    notes: "・10名までの貸切料金です\n" + COMMON_NOTES,
  },
];

const allPlans = [...standardPlans, ...seasonalPlans, ...sunsetPlans, ...snorkelPlans];

const PLAN_ID_MAP: Record<string, string> = {
  nonbiri: "PLAN_NONBIRI",
  activity: "PLAN_ACTIVITY",
  suinbou: "PLAN_SUINBOU",
  premium: "PLAN_PREMIUM_HATENOHAMA",
  memorial: "PLAN_MEMORIAL_HATENOHAMA",
  jetcruise: "PLAN_JET_CRUISE",
  asobitsukushi: "PLAN_ASOBITSUKUSHI_SUMMER",
  "sunset-jet": "PLAN_SUNSET_JET",
  "sunset-cruise": "PLAN_SUNSET_CRUISE",
  "sunset-sup": "PLAN_SUNSET_SUP",
  snorkel: "PLAN_SNORKEL",
  "premium-snorkel": "PLAN_PREMIUM_SNORKEL",
};

const normalizePlanId = (planId?: string): string => {
  if (!planId) return "";
  if (planId.startsWith("PLAN_")) return planId;
  return PLAN_ID_MAP[planId] ?? "";
};

const carouselScroll = (element: HTMLDivElement | null, direction: "left" | "right") => {
  if (!element) return;
  const scrollAmount = 400;
  const maxScrollLeft = element.scrollWidth - element.clientWidth;
  const isAtStart = element.scrollLeft <= 0;
  const isAtEnd = element.scrollLeft >= maxScrollLeft - 1;

  if (direction === "left") {
    if (isAtStart) {
      element.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
    } else {
      element.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    }
    return;
  }

  if (isAtEnd) {
    element.scrollTo({ left: 0, behavior: "smooth" });
  } else {
    element.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
};

export default function App() {
  const [selectedPlan, setSelectedPlan] = useState<PlanDetails | null>(null);
  const [preselectedProductId, setPreselectedProductId] = useState("");
  const [currentPage, setCurrentPage] = useState<SeoPage>(() => {
    if (typeof window === "undefined") {
      return "home";
    }
    return resolvePageFromLocation(window.location.pathname, window.location.hash);
  });
  const planCarouselRef = useRef<HTMLDivElement>(null);
  const sunsetCarouselRef = useRef<HTMLDivElement>(null);
  const snorkelCarouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncPageFromLocation = () => {
      const resolvedPage = resolvePageFromLocation(window.location.pathname, window.location.hash);
      if (resolvedPage === "home" && window.location.pathname !== "/" && !window.location.hash) {
        window.history.replaceState(null, "", getPathForPage("home"));
      }
      setCurrentPage(resolvedPage);
    };

    const legacyPage = resolveLegacyHashPage(window.location.hash);
    if (legacyPage) {
      window.history.replaceState(null, "", getPathForPage(legacyPage));
      setCurrentPage(legacyPage);
    } else {
      syncPageFromLocation();
    }

    window.addEventListener("popstate", syncPageFromLocation);
    return () => window.removeEventListener("popstate", syncPageFromLocation);
  }, []);

  const navigateToPage = (page: SeoPage, replace = false) => {
    const nextPath = getPathForPage(page);
    const historyMethod = replace ? "replaceState" : "pushState";

    if (window.location.pathname !== nextPath || window.location.hash !== "") {
      window.history[historyMethod](null, "", nextPath);
    }

    setCurrentPage(page);
  };

  const handleBookingClick = (planId?: string) => {
    setPreselectedProductId(normalizePlanId(planId));
    navigateToPage("booking");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLineClick = () => {
    window.open("https://page.line.me/ltr9609x?oat_content=url&openQrModal=true", "_blank");
  };

  const handleBackToHome = () => {
    navigateToPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (currentPage === "booking") {
    return (
      <>
        <SeoHead page="booking" />
        <div className="min-h-screen bg-gray-50">
          <Header
            onBookingClick={handleBookingClick}
            onLineClick={handleLineClick}
            onBackToHome={handleBackToHome}
            isBookingForm={true}
          />
          <div className="pt-16">
            <WizardLayout preselectedProductId={preselectedProductId} />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SeoHead page="home" />
      <div className="min-h-screen bg-white">
        <Header
          onBookingClick={() => handleBookingClick()}
          onLineClick={handleLineClick}
          onBackToHome={handleBackToHome}
          isBookingForm={false}
        />

        <Hero onBookingClick={() => handleBookingClick()} onLineClick={handleLineClick} />

        <section className="py-16 px-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl mb-4">360度、透明な世界</h2>
            <p className="text-lg text-gray-300 mb-8">
              港から船で15分。
              <br className="md:hidden" />
              真っ白な砂浜と透き通る海だけの楽園へ。
            </p>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { src: "/image/service1.png", alt: "はての浜" },
                { src: "/image/service2.png", alt: "シュノーケル体験" },
                { src: "/image/service3.png", alt: "マリンアクティビティ" },
              ].map((image) => (
                <div key={image.src} className="h-64 rounded-lg overflow-hidden">
                  <img src={image.src} alt={image.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 px-4 bg-sky-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-sky-100 rounded-2xl p-6 md:p-8 shadow-sm">
              <h3 className="text-2xl text-sky-900 mb-4 text-center">ご案内</h3>
              <div className="space-y-3 text-gray-700 leading-relaxed">
                <p>島内ピックアップは行っておりません。</p>
                <p>宿泊先から泊フィッシャリーナまでの往復送迎は無料です。</p>
                <p>空港送迎をご希望の場合は要相談となります。</p>
                <p>全てのプランでパラソルまたはテント、ベッドまたはチェアをご用意しています。</p>
              </div>
            </div>
          </div>
        </section>

        <section id="plans" className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl mb-3">プラン一覧</h2>
              <p className="text-gray-600">半日プランから夏限定、サンセット、シュノーケルまでご用意しています</p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">通常プラン</h3>
              <div className="relative">
                <div ref={planCarouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {standardPlans.map((plan) => (
                    <div key={plan.id} className="flex-shrink-0 w-96">
                      <PlanCard plan={plan} onDetailsClick={() => setSelectedPlan(plan)} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => carouselScroll(planCarouselRef.current, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="通常プランを前へスクロール"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => carouselScroll(planCarouselRef.current, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="通常プランを次へスクロール"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">7月・8月限定 1日プラン</h3>
              <div className="flex justify-center">
                {seasonalPlans.map((plan) => (
                  <div key={plan.id} className="w-full max-w-md">
                    <PlanCard plan={plan} onDetailsClick={() => setSelectedPlan(plan)} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">サンセットプラン</h3>
              <div className="relative">
                <div ref={sunsetCarouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {sunsetPlans.map((plan) => (
                    <div key={plan.id} className="flex-shrink-0 w-96">
                      <PlanCard plan={plan} onDetailsClick={() => setSelectedPlan(plan)} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => carouselScroll(sunsetCarouselRef.current, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="サンセットプランを前へスクロール"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => carouselScroll(sunsetCarouselRef.current, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="サンセットプランを次へスクロール"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>

            <div className="mt-16">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">シュノーケルプラン</h3>
              <div className="relative">
                <div ref={snorkelCarouselRef} className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide justify-center">
                  {snorkelPlans.map((plan) => (
                    <div key={plan.id} className="flex-shrink-0 w-96">
                      <PlanCard plan={plan} onDetailsClick={() => setSelectedPlan(plan)} />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => carouselScroll(snorkelCarouselRef.current, "left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="シュノーケルプランを前へスクロール"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button
                  onClick={() => carouselScroll(snorkelCarouselRef.current, "right")}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md transition-all hover:shadow-lg z-10"
                  aria-label="シュノーケルプランを次へスクロール"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          </div>
        </section>

        <ContactCTA onLineClick={handleLineClick} />
        <FreeRentals />
        <Testimonials />
        <Safety />
        <BookingFlow />
        <FAQ onLineClick={handleLineClick} />
        <Access />

        <section
          className="py-20 px-4 relative bg-cover bg-center bg-no-repeat text-white"
          style={{ backgroundImage: "url(/image/top.png)" }}
        >
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
            <h2 className="text-3xl">さあ、天国の海へ</h2>
            <p className="text-xl text-white/90">半日プランからサンセットまで、久米島の海を思い切り楽しみましょう。</p>
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

        <footer className="py-12 px-4 bg-gray-900 text-white">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <h3 className="text-2xl mb-4">New Wave 久米島</h3>
            <p className="text-gray-400 text-sm">
              TEL: <a href="tel:098-987-1318" className="hover:text-white transition-colors">098-987-1318</a> <br />
              MAIL: <a href="mailto:yukocrest.mobile@gmail.com" className="hover:text-white transition-colors">yukocrest.mobile@gmail.com</a>
            </p>
            <div className="pt-8 border-t border-gray-800 text-gray-500 text-sm">
              © 2026 Hateno Hama Marine Service. All rights reserved.
            </div>
          </div>
        </footer>

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

        <FixedCTA onBookingClick={() => handleBookingClick()} onLineClick={handleLineClick} />
      </div>
    </>
  );
}
