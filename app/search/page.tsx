import type { Metadata } from "next";
import { SearchBar } from "@/components/SearchBar";

export const metadata: Metadata = {
  title: "جستجو در دانشنامه",
  description:
    "جستجوی پیشرفته در مقالات دانشنامه آزاد ایندکسز در حوزه‌های فیزیک، تاریخ، فلسفه و فناوری.",
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <main className="container">
      <h1>جستجو در دانشنامه</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        عبارت مورد نظر خود را وارد کنید تا در میان تمام مقالات جستجو شود.
      </p>
      <SearchBar />
    </main>
  );
}
