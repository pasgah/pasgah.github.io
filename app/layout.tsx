import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { SearchBar } from "@/components/SearchBar";

const vazir = Vazirmatn({
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazir",
});

const SITE_URL = "https://indexes.ir";
const SITE_NAME = "ایندکسز";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ایندکسز — دانشنامه آزاد فارسی",
    template: "%s | ایندکسز",
  },
  description:
    "ایندکسز، دانشنامه‌ای آزاد و مشارکتی به زبان فارسی؛ مقالات علمی، تاریخی، فرهنگی و فناوری با منابع معتبر و به‌روز.",
  keywords: [
    "دانشنامه",
    "دانشنامه آزاد",
    "ویکی‌پدیا فارسی",
    "مقالات علمی",
    "ایندکسز",
    "indexes",
  ],
  authors: [{ name: "تیم ایندکسز", url: SITE_URL }],
  creator: "ایندکسز",
  publisher: "ایندکسز",
  applicationName: SITE_NAME,
  category: "education",
  alternates: {
    canonical: "/",
    languages: { "fa-IR": "/" },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "ایندکسز — دانشنامه آزاد فارسی",
    description:
      "دانشنامه‌ای آزاد و مشارکتی به زبان فارسی با منابع معتبر.",
    images: [
      {
        url: `${SITE_URL}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: "ایندکسز — دانشنامه آزاد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ایندکسز — دانشنامه آزاد فارسی",
    description: "دانشنامه‌ای آزاد و مشارکتی به زبان فارسی.",
    images: [`${SITE_URL}/og-image.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    // کد Google Search Console خودت را اینجا بگذار
    // google: "xxxxx",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" className={vazir.variable}>
      <body>
        <header className="site-header" role="banner">
          <div className="container header-inner">
            <Link href="/" className="brand" aria-label="صفحه اصلی ایندکسز">
              <span className="brand-mark">ایندکسز</span>
              <span className="brand-tag">دانشنامه آزاد</span>
            </Link>
            <SearchBar />
            <nav aria-label="ناوبری اصلی" className="main-nav">
              <ul>
                <li>
                  <Link href="/wiki/">دانشنامه</Link>
                </li>
                <li>
                  <Link href="/about/">درباره</Link>
                </li>
                <li>
                  <Link href="/contact/">تماس</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {children}

        <footer className="site-footer" role="contentinfo">
          <div className="container">
            <p>
              © {new Date().getFullYear()} ایندکسز — تمامی محتوا تحت مجوز{" "}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/"
                rel="license noopener"
                target="_blank"
              >
                CC BY-SA 4.0
              </a>{" "}
              منتشر می‌شود.
            </p>
            <p>
              <Link href="/about/">درباره</Link> ·{" "}
              <Link href="/contact/">تماس</Link> ·{" "}
              <Link href="/sitemap.xml">نقشه سایت</Link>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
