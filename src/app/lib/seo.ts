export type SeoPage = "home" | "family" | "couple" | "group" | "booking";

const SITE_NAME = "New Wave 久米島";
const DEFAULT_IMAGE_PATH = "/image/top.png";
const DEFAULT_SITE_URL = "http://localhost:5173";

const PAGE_PATHS: Record<SeoPage, string> = {
  home: "/",
  family: "/family",
  couple: "/couple",
  group: "/group",
  booking: "/booking",
};

const LEGACY_HASH_PAGES: Record<string, SeoPage> = {
  "#family": "family",
  "#couple": "couple",
  "#group": "group",
  "#booking": "booking",
};

const normalizePathname = (pathname: string) => {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized === "" ? "/" : normalized;
};

const getBaseUrl = () => {
  const configured = import.meta.env.VITE_SITE_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  return DEFAULT_SITE_URL;
};

const buildLocalBusinessJsonLd = (baseUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  url: baseUrl,
  image: new URL(DEFAULT_IMAGE_PATH, baseUrl).toString(),
  description:
    "久米島からはての浜へのツアー、シュノーケリング、バナナボート、貸切渡船を提供するマリンアクティビティ事業者です。",
  telephone: "+81-98-987-1318",
  email: "yukocrest.mobile@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "宇根1724-13",
    addressLocality: "久米島町",
    addressRegion: "沖縄県",
    postalCode: "901-3105",
    addressCountry: "JP",
  },
  areaServed: "久米島・はての浜",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "08:00",
      closes: "20:00",
    },
  ],
  hasMap:
    "https://www.google.com/maps/place/%E3%80%92901-3105+%E6%B2%96%E7%B8%84%E7%9C%8C%E5%B3%B6%E5%B0%BB%E9%83%A1%E4%B9%85%E7%B1%B3%E5%B3%B6%E7%94%BA%E5%AE%87%E6%A0%B91724-13/",
});

const buildWebPageJsonLd = (
  canonicalUrl: string,
  title: string,
  description: string,
) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: title,
  description,
  url: canonicalUrl,
  isPartOf: {
    "@type": "WebSite",
    name: SITE_NAME,
    url: getBaseUrl(),
  },
});

export const resolveLegacyHashPage = (hash: string): SeoPage | null =>
  LEGACY_HASH_PAGES[hash] ?? null;

export const resolvePageFromLocation = (pathname: string, hash = ""): SeoPage => {
  const normalizedPath = normalizePathname(pathname);

  const matchedPath = (Object.entries(PAGE_PATHS) as Array<[SeoPage, string]>).find(
    ([, path]) => path === normalizedPath,
  );

  if (matchedPath) {
    return matchedPath[0];
  }

  return resolveLegacyHashPage(hash) ?? "home";
};

export const getPathForPage = (page: SeoPage) => PAGE_PATHS[page];

export const getSeoPayload = (page: SeoPage) => {
  const baseUrl = getBaseUrl();
  const canonicalUrl = new URL(getPathForPage(page), `${baseUrl}/`).toString();
  const imageUrl = new URL(DEFAULT_IMAGE_PATH, `${baseUrl}/`).toString();

  const pageMeta: Record<
    SeoPage,
    { title: string; description: string; robots?: string }
  > = {
    home: {
      title: "はての浜ツアー・久米島マリンアクティビティ予約 | New Wave 久米島",
      description:
        "久米島から船で約15分。はての浜ツアーやシュノーケル、バナナボート、貸切渡船を予約できる New Wave 久米島の公式サイトです。",
    },
    family: {
      title: "久米島の家族向け はての浜ツアー・マリンアクティビティ | New Wave 久米島",
      description:
        "家族旅行におすすめの久米島・はての浜ツアーを紹介。子連れでも参加しやすい半日・1日プランや無料レンタル付きプランを掲載しています。",
    },
    couple: {
      title: "久米島のカップル向け はての浜ツアー | New Wave 久米島",
      description:
        "カップル旅行や記念日におすすめの久米島・はての浜ツアー。ハートサンゴやフォト付きのロマンティックなマリンアクティビティを掲載しています。",
    },
    group: {
      title: "久米島の団体向け はての浜貸切渡船プラン | New Wave 久米島",
      description:
        "修学旅行、企業研修、サークル旅行向けの久米島・はての浜貸切渡船プラン。団体向けの貸切ツアー内容、料金、対応人数を掲載しています。",
    },
    booking: {
      title: "はての浜ツアー予約フォーム | New Wave 久米島",
      description:
        "New Wave 久米島の予約フォームです。はての浜ツアー、シュノーケル、バナナボート、団体プランのご予約にご利用ください。",
      robots: "noindex, nofollow",
    },
  };

  const meta = pageMeta[page];

  return {
    ...meta,
    canonicalUrl,
    imageUrl,
    robots: meta.robots ?? "index, follow",
    structuredData: [
      buildLocalBusinessJsonLd(baseUrl),
      buildWebPageJsonLd(canonicalUrl, meta.title, meta.description),
    ],
  };
};
