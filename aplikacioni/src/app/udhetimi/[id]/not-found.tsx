import Link from "next/link";

export default function UdhetimiNukUGjet() {
  return (
    <main>
      <h1>Udhëtimi nuk u gjet</h1>
      <p>Ky udhëtim nuk ekziston ose është hequr.</p>
      <Link className="action" href="/">
        Kthehu te lista
      </Link>
    </main>
  );
}
