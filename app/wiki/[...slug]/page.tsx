import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

import { JsonLd } from "@/components/JsonLd";
import { WikiSidebar } from "@/components/WikiSidebar";
import { TableOfContents } from "@/components/TableOfContents";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  getAllArticles,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/content";
import { extractToc } from "@/lib/toc";

const SITE_URL = "https://indexes.ir";

export const dynamicParams = false;

interface Props {
  params: { slug: string[] };
}

export async function generateStaticParams() {
  return getAllArticles().map((a) => ({
    slug: a.slug.split("/"),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug.join("/"));
  if (!article) return {};

  const url = `${SITE_URL}/wiki/${article.slug}/`;

  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: article.author }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.description,
      url,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      authors: [article.author],
      tags: article.tags,
      locale: "fa_IR",
      siteName: "ایندکسز",
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.description,
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const slug = params.slug.join("/");
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const related = getRelatedArticles(slug, 4);
  const toc = extractToc(article.content);
  const url = `${SITE_URL}/wiki/${article.slug}/`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    author: {
      "@type": "Person",
      name: article.author,
    },
    publisher: {
      "@type": "Organization",
      name: "ایندکسز",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    inLanguage: "fa-IR",
    url,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    keywords: article.tags.join(", "),
    articleSection: article.categoryName,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "خانه",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "دانشنامه",
        item: `${SITE_URL}/wiki/`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.categoryName,
        item: `${SITE_URL}/wiki/category/${article.categorySlug}/`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
      },
    ],
  };

  return (
    <>
      <JsonLd data={articleSchema} />
      <JsonLd data={breadcrumbSchema} />

      <div className="wiki-layout">
        <WikiSidebar />

        <main>
          <Breadcrumb
            items={[
              { label: "خانه", href: "/" },
              { label: "دانشنامه", href: "/wiki/" },
              {
                label: article.categoryName,
                href: `/wiki/category/${article.categorySlug}/`,
              },
              { label: article.title },
            ]}
          />

          <article>
            <header>
              <h1>{article.title}</h1>
              <p className="article-meta">
                <span>
                  آخرین ویرایش:{" "}
                  {new Date(article.updatedAt).toLocaleDateString(
                    "fa-IR",
                    { year: "numeric", month: "long", day: "numeric" }
                  )}
                </span>
                <span>·</span>
                <span>نویسنده: {article.author}</span>
                <span>·</span>
                <span>زمان مطالعه: {article.readingTime} دقیقه</span>
              </p>

              <div>
                {article.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </header>

            <div className="prose">
              <MDXRemote
                source={article.content}
                options={{
                  mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [
                      rehypeSlug,
                      [
                        rehypeAutolinkHeadings,
                        {
                          behavior: "wrap",
                          properties: {
                            className: ["heading-anchor"],
                          },
                        },
                      ],
                    ],
                  },
                }}
              />
            </div>

            {related.length > 0 && (
              <footer style={{ marginTop: "3rem" }}>
                <h2>مقالات مرتبط</h2>
                <div className="article-grid">
                  {related.map((r) => (
                    <article key={r.slug} className="article-card">
                      <h3>
                        <Link href={`/wiki/${r.slug}/`}>{r.title}</Link>
                      </h3>
                      <p>{r.description}</p>
                    </article>
                  ))}
                </div>
              </footer>
            )}
          </article>
        </main>

        <TableOfContents items={toc} />
      </div>
    </>
  );
}
