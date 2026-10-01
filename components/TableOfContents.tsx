import type { TocItem } from "@/lib/toc";

export function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="toc" aria-label="فهرست مطالب">
      <h2>فهرست مطالب</h2>
      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            style={{ paddingInlineStart: `${(item.level - 2) * 1}rem` }}
          >
            <a href={`#${item.id}`}>{item.text}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
