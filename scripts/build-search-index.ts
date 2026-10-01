import fs from "fs";
import path from "path";
import matter from "gray-matter";

const ARTICLES_DIR = path.join(process.cwd(), "content/articles");
const OUT_FILE = path.join(process.cwd(), "public/search-index.json");

interface SearchItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  body: string;
}

function walk(dir: string): string[] {
  const files: string[] = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (fs.statSync(full).isDirectory()) files.push(...walk(full));
    else if (entry.endsWith(".mdx")) files.push(full);
  }
  return files;
}

function stripMdx(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function build() {
  const items: SearchItem[] = walk(ARTICLES_DIR).map((file) => {
    const raw = fs.readFileSync(file, "utf8");
    const { data, content } = matter(raw);
    const slug = path
      .relative(ARTICLES_DIR, file)
      .replace(/\.mdx$/, "")
      .replace(/\\/g, "/");

    return {
      slug,
      title: String(data.title ?? ""),
      description: String(data.description ?? ""),
      category: String(data.category ?? ""),
      tags: Array.isArray(data.tags) ? data.tags : [],
      body: stripMdx(content).slice(0, 800),
    };
  });

  const outDir = path.dirname(OUT_FILE);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  fs.writeFileSync(OUT_FILE, JSON.stringify(items));
  console.log(`✅ Search index built: ${items.length} articles → ${OUT_FILE}`);
}

build();
