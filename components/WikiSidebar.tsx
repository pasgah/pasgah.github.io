import Link from "next/link";
import { getCategoriesWithCount } from "@/lib/content";

export function WikiSidebar() {
  const cats = getCategoriesWithCount();

  return (
    <aside className="wiki-sidebar" aria-label="دسته‌بندی‌ها">
      <h2>دسته‌بندی‌ها</h2>
      <ul>
        {cats.map((c) => (
          <li key={c.slug}>
            <Link href={`/wiki/category/${c.slug}/`}>
              {c.name}
              <span className="count"> ({c.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      <h2>پیوندها</h2>
      <ul>
        <li>
          <Link href="/wiki/">همه مقالات</Link>
        </li>
        <li>
          <Link href="/search/">جستجوی پیشرفته</Link>
        </li>
        <li>
          <Link href="/about/">درباره ما</Link>
        </li>
      </ul>
    </aside>
  );
}
