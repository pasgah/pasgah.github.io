export interface Category {
  slug: string;
  name: string;
  description: string;
}

export const categories: Category[] = [
  {
    slug: "physics",
    name: "فیزیک",
    description:
      "مقالات مربوط به فیزیک کلاسیک، مکانیک کوانتومی، نسبیت، اخترفیزیک و ذرات بنیادی.",
  },
  {
    slug: "history",
    name: "تاریخ",
    description:
      "تاریخ ایران، خاورمیانه، جهان باستان، قرون وسطی و دوران معاصر با منابع معتبر.",
  },
  {
    slug: "technology",
    name: "فناوری",
    description:
      "هوش مصنوعی، برنامه‌نویسی، شبکه، امنیت سایبری و فناوری‌های نوظهور.",
  },
  {
    slug: "philosophy",
    name: "فلسفه",
    description:
      "فلسفه غرب، فلسفه اسلامی، منطق، معرفت‌شناسی و اخلاق.",
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function getCategoryByName(name: string): Category | undefined {
  return categories.find((c) => c.name === name);
}
