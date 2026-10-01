import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container" style={{ textAlign: "center", padding: "5rem 1rem" }}>
      <h1>۴۰۴ — صفحه پیدا نشد</h1>
      <p style={{ color: "var(--muted)", marginBottom: "2rem" }}>
        متأسفانه صفحه‌ای که به دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
      </p>
      <p>
        <Link href="/">بازگشت به صفحه‌ی اصلی</Link> ·{" "}
        <Link href="/wiki/">فهرست مقالات</Link>
      </p>
    </main>
  );
}
