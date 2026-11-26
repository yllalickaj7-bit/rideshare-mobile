import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <div className="empty">
        <h1>Udhëtimi nuk u gjet</h1>
        <p>Lidhja mund të jetë e vjetër ose udhëtimi nuk ekziston më.</p>
        <Link href="/" className="action">← Te lista e udhëtimeve</Link>
      </div>
    </main>
  );
}
