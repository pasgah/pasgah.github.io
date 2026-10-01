import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { getAllArticles } from "@/lib/content";

const SITE_URL = "https://indexes.ir";

export const metadata: Metadata = {
  title: "فهرست مقالات",
  description:
    "فهرست کامل مقالات دانشنامه آزاد ایندکسز در حوزه‌های فیزیک، تاریخ، فلسفه و فناوری.",
  alternates: { canonical: "/wiki/" },
};

export default function WikiIndexPage() {
  const articles = getAllArticles();

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "فهرست مقالات ایندکسز",
    url: `${SITE_URL}/wiki/`,
    inLanguage: "fa-IR",
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `${SITE_URL}/wiki/${a.slug}/`,
    })),
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <main className="container">
        <h1>فهرست مقالات</h1>
        <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
          مجموعاً {articles.length} مقاله در دانشنامه ثبت شده است.
        </p>

        <div className="article-grid">
          {articles.map((a) => (
            <article key={a.slug} className="article-card">
              <h3>
                <Link href={`/wiki/${a.slug}/`}>{a.title}</Link>
              </h3>
              <p>{a.description}</p>
              <div>
                <Link
                  href={`/wiki/category/${a.categorySlug}/`}
                  className="tag"
                >
                  {a.categoryName}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>
    </>
  );
}
