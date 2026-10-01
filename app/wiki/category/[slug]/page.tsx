import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { WikiSidebar } from "@/components/WikiSidebar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { getArticlesByCategory } from "@/lib/content";
import { categories, getCategoryBySlug } from "@/content/categories";

const SITE_URL = "https://indexes.ir";

export const dynamicParams = false;

interface Props {
  params: { slug: string };
}

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) return {};

  const url = `${SITE_URL}/wiki/category/${cat.slug}/`;

  return {
    title: `دسته‌بندی ${cat.name}`,
    description: cat.description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      title: `دسته‌بندی ${cat.name} | ایندکسز`,
      description: cat.description,
      url,
      locale: "fa_IR",
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const cat = getCategoryBySlug(params.slug);
  if (!cat) notFound();

  const articles = getArticlesByCategory(cat.slug);
  const url = `${SITE_URL}/wiki/category/${cat.slug}/`;

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `دسته‌بندی ${cat.name}`,
    description: cat.description,
    url,
    inLanguage: "fa-IR",
    hasPart: articles.map((a) => ({
      "@type": "Article",
      headline: a.title,
      url: `${SITE_URL}/wiki/${a.slug}/`,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <div className="wiki-layout">
        <WikiSidebar />

        <main>
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "دانشنامه", href: "/wiki/" },
              { label: cat.name },
            ]}
          />

          <h1>دسته‌بندی: {cat.name}</h1>
          <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
            {cat.description}
          </p>

          {articles.length === 0 ? (
            <p>هنوز مقاله‌ای در این دسته‌بندی منتشر نشده است.</p>
          ) : (
            <div className="article-grid">
              {articles.map((a) => (
                <article key={a.slug} className="article-card">
                  <h3>
                    <Link href={`/wiki/${a.slug}/`}>{a.title}</Link>
                  </h3>
                  <p>{a.description}</p>
                </article>
              ))}
            </div>
          )}
        </main>

        <aside aria-hidden="true" />
      </div>
    </>
  );
}
