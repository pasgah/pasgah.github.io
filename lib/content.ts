import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { categories, getCategoryBySlug } from "@/content/categories";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  categorySlug: string;
  categoryName: string;
  tags: string[];
  author: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  related: string[];
  content: string;
}

interface RawFrontmatter {
  title: string;
  description: string;
  category: string; // slug دسته‌بندی
  tags?: string[];
  author?: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime?: number;
  related?: string[];
}

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (entry.endsWith(".mdx")) files.push(full);
  }
  return files;
}

export function getAllArticles(): ArticleMeta[] {
  if (!fs.existsSync(ARTICLES_DIR)) return [];

  return walk(ARTICLES_DIR)
    .map((file) => {
      const raw = fs.readFileSync(file, "utf8");
      const { data, content } = matter(raw);
      const fm = data as RawFrontmatter;

      const slug = path
        .relative(ARTICLES_DIR, file)
        .replace(/\.mdx$/, "")
        .replace(/\\/g, "/");

      const cat = getCategoryBySlug(fm.category);

      return {
        slug,
        title: fm.title,
        description: fm.description,
        categorySlug: fm.category,
        categoryName: cat?.name ?? fm.category,
        tags: fm.tags ?? [],
        author: fm.author ?? "تیم ایندکسز",
        publishedAt: fm.publishedAt,
        updatedAt: fm.updatedAt ?? fm.publishedAt,
        readingTime: fm.readingTime ?? 5,
        related: fm.related ?? [],
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export function getArticleBySlug(slug: string): ArticleMeta | undefined {
  return getAllArticles().find((a) => a.slug === slug);
}

export function getArticlesByCategory(categorySlug: string): ArticleMeta[] {
  return getAllArticles().filter((a) => a.categorySlug === categorySlug);
}

export function getCategoriesWithCount(): Array<{
  slug: string;
  name: string;
  description: string;
  count: number;
}> {
  const all = getAllArticles();
  return categories.map((c) => ({
    ...c,
    count: all.filter((a) => a.categorySlug === c.slug).length,
  }));
}

export function getAllTags(): string[] {
  const set = new Set<string>();
  for (const a of getAllArticles()) for (const t of a.tags) set.add(t);
  return [...set];
}

export function getRelatedArticles(
  slug: string,
  limit = 4
): ArticleMeta[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];

  const all = getAllArticles().filter((a) => a.slug !== slug);

  const scored = all.map((a) => {
    let score = 0;
    if (a.categorySlug === current.categorySlug) score += 3;
    for (const t of a.tags) if (current.tags.includes(t)) score += 2;
    if (current.related.includes(a.slug.split("/").pop() ?? "")) score += 10;
    return { article: a, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

export function stripMdx(content: string): string {
  return content
    .replace(/^---[\s\S]*?---/m, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`]*`/g, "")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
