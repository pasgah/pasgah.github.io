export interface TocItem {
  id: string;
  text: string;
  level: number;
}

const HEADING_RE = /^(#{2,4})\s+(.+?)\s*$/gm;

export function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/[\s\u200c]+/g, "-")
    .replace(/[^\p{L}\p{N}\-]/gu, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function extractToc(content: string): TocItem[] {
  const items: TocItem[] = [];
  let match: RegExpExecArray | null;

  while ((match = HEADING_RE.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/[#*`_]/g, "").trim();
    if (!text) continue;
    items.push({ id: slugifyHeading(text), text, level });
  }

  return items;
}
