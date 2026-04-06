import { useEffect } from "react";
import { getSeoPayload, type SeoPage } from "../lib/seo";

interface SeoHeadProps {
  page: SeoPage;
}

const ensureMeta = (attr: "name" | "property", value: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${value}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, value);
    document.head.appendChild(element);
  }
  return element;
};

const ensureLink = (rel: string) => {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }
  return element;
};

export function SeoHead({ page }: SeoHeadProps) {
  useEffect(() => {
    const payload = getSeoPayload(page);

    document.documentElement.lang = "ja";
    document.title = payload.title;

    ensureMeta("name", "description").content = payload.description;
    ensureMeta("name", "robots").content = payload.robots;
    ensureMeta("property", "og:site_name").content = "New Wave 久米島";
    ensureMeta("property", "og:locale").content = "ja_JP";
    ensureMeta("property", "og:type").content = "website";
    ensureMeta("property", "og:title").content = payload.title;
    ensureMeta("property", "og:description").content = payload.description;
    ensureMeta("property", "og:url").content = payload.canonicalUrl;
    ensureMeta("property", "og:image").content = payload.imageUrl;
    ensureMeta("name", "twitter:card").content = "summary_large_image";
    ensureMeta("name", "twitter:title").content = payload.title;
    ensureMeta("name", "twitter:description").content = payload.description;
    ensureMeta("name", "twitter:image").content = payload.imageUrl;

    ensureLink("canonical").href = payload.canonicalUrl;

    document.head
      .querySelectorAll('script[data-seo-jsonld="true"]')
      .forEach((element) => element.remove());

    payload.structuredData.forEach((entry) => {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.text = JSON.stringify(entry);
      document.head.appendChild(script);
    });
  }, [page]);

  return null;
}
