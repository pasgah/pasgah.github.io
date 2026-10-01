import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getAllArticles, getCategoriesWithCount } from "@/lib/content";

const SITE_URL = "https://indexes.ir";

export const metadata: Metadata = {
  title: "ایندکسز — دانشنامه آزاد فارسی",
  description:
    "دانشنامه‌ای آزاد، مشارکتی و به‌روز به زبان فارسی. مقالات علمی، تاریخی، فلسفی و فناوری با منابع معتبر.",
  alternates: { canonical: "/" },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ایندکسز",
  alternateName: "Indexes",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    areaServed: "IR",
    availableLanguage: ["Persian", "English"],
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ایندکسز",
  url: SITE_URL,
  inLanguage: "fa-IR",
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/search/?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function HomePage() {
  const articles = getAllArticles().slice(0, 6);
  const cats = getCategoriesWithCount();

  return (
    <>
      <JsonLd data={organizationSchema} />
      <JsonLd data={websiteSchema} />

      <main className="container">
        <section className="hero">
          <h1>ایندکسز — دانشنامه‌ی آزاد فارسی</h1>
          <p>
            ایندکسز یک دانشنامه‌ی مشارکتی است که مقالات علمی، تاریخی،
            فلسفی و فناوری را با منابع معتبر و ساختار استاندارد منتشر
            می‌کند. هدف ما ایجاد یک مرجع قابل اعتماد و آزاد برای
            فارسی‌زبانان است.
          </p>
        </section>

        <section aria-labelledby="cats-heading">
          <h2 id="cats-heading">دسته‌بندی‌ها</h2>
          <div className="article-grid">
            {cats.map((c) => (
              <Link
                key={c.slug}
                href={`/wiki/category/${c.slug}/`}
                className="article-card"
              >
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span className="count">{c.count} مقاله</span>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="latest-heading">
          <h2 id="latest-heading">آخرین مقالات</h2>
          <div className="article-grid">
            {articles.map((a) => (
              <article key={a.slug} className="article-card">
                <h3>
                  <Link href={`/wiki/${a.slug}/`}>{a.title}</Link>
                </h3>
                <p>{a.description}</p>
                <div>
                  {a.tags.slice(0, 3).map((t) => (
                    <span key={t} className="tag">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
          <p style={{ marginTop: "1.5rem" }}>
            <Link href="/wiki/">مشاهده‌ی همه‌ی مقالات →</Link>
          </p>
        </section>
      </main>
    </>
  );
}
