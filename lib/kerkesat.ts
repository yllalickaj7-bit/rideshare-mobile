import "server-only";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { getSql } from "../lib/db";
import { profiliIm } from "../lib/lejet";

export type Statusi = "ne_pritje" | "pranuar" | "refuzuar";
export type Gjendja = { vende: number; ora: string; kerkesa: Statusi | null };
export type KerkeseNePritje = { id: number; udhetimId: string; udhetari: string; nisja: string; ora: string };

const ID_UDHETIMI = /^[0-9]{1,6}$/;

// ID-ja nga sesioni, pa shkrim në databazë: përdoret në çdo rilexim çdo 5 sekonda.
async function idIme(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id && /^\d+$/.test(id) ? id : null;
}

export async function gjendjaLive(udhetimId: string): Promise<Gjendja | null> {
  if (!ID_UDHETIMI.test(udhetimId)) return null;
  const sql = getSql();
  const rows = await sql`SELECT vende, ora FROM udhetimet WHERE id = ${udhetimId}`;
  const u = rows[0];
  if (!u) return null;
  const uid = await idIme();
  let kerkesa: Statusi | null = null;
  if (uid) {
    const k = await sql`SELECT statusi FROM kerkesat WHERE udhetim_id = ${udhetimId} AND github_id = ${uid}`;
    kerkesa = (k[0]?.["statusi"] as Statusi | undefined) ?? null;
  }
  return { vende: Number(u["vende"]), ora: String(u["ora"]), kerkesa };
}

export type RezultatiDergimit = "dergua" | "ekziston" | "hyr" | "fushe" | "pa_vende" | "shofer";

export async function dergoKerkesen(udhetimId: string): Promise<RezultatiDergimit> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (!ID_UDHETIMI.test(udhetimId)) return "fushe";
  const sql = getSql();
  const trip = await sql`SELECT vende, shofer_id FROM udhetimet WHERE id = ${udhetimId}`;
  if (trip.length === 0) return "fushe";
  if (trip[0]?.["shofer_id"] === p.id) return "shofer";
  // Një deklaratë: kontrolli i vendeve dhe shtimi bëhen së bashku; UNIQUE ndalon dublikatin.
  const rows = await sql`INSERT INTO kerkesat (udhetim_id, github_id)
    SELECT ${udhetimId}, ${p.id}
    WHERE EXISTS (SELECT 1 FROM udhetimet WHERE id = ${udhetimId} AND vende > 0)
    ON CONFLICT (udhetim_id, github_id) DO NOTHING
    RETURNING id`;
  if (rows.length === 1) return "dergua";
  const ekziston = await sql`SELECT 1 FROM kerkesat WHERE udhetim_id = ${udhetimId} AND github_id = ${p.id}`;
  return ekziston.length > 0 ? "ekziston" : "pa_vende";
}

export async function kerkesatNePritjePerShofer(): Promise<KerkeseNePritje[]> {
  const p = await profiliIm();
  if (!p || p.roli !== "shofer") return [];
  const sql = getSql();
  const rows = await sql`SELECT k.id, k.udhetim_id, pr.emri, u.nisja, u.ora
    FROM kerkesat k
    JOIN udhetimet u ON u.id = k.udhetim_id
    JOIN profilet pr ON pr.github_id = k.github_id
    WHERE u.shofer_id = ${p.id} AND k.statusi = 'ne_pritje'
    ORDER BY k.krijuar`;
  return rows.map((r) => ({
    id: Number(r["id"]),
    udhetimId: String(r["udhetim_id"]),
    udhetari: String(r["emri"]),
    nisja: String(r["nisja"]),
    ora: String(r["ora"]),
  }));
}

export type RezultatiPergjigjes = "pranuar" | "refuzuar" | "hyr" | "ndaluar" | "fushe" | "pa_vende";

export async function pergjigju(kerkesaId: number, veprimi: "prano" | "refuzo"): Promise<RezultatiPergjigjes> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (p.roli !== "shofer") return "ndaluar";
  if (!Number.isInteger(kerkesaId) || kerkesaId < 1) return "fushe";
  const sql = getSql();
  if (veprimi === "refuzo") {
    const rows = await sql`UPDATE kerkesat k SET statusi = 'refuzuar'
      FROM udhetimet u
      WHERE k.id = ${kerkesaId} AND k.statusi = 'ne_pritje' AND u.id = k.udhetim_id AND u.shofer_id = ${p.id}
      RETURNING k.id`;
    return rows.length === 1 ? "refuzuar" : "ndaluar";
  }
  // FOR UPDATE e mban kërkesën të bllokuar: dy klikime njëkohësh nuk e zbresin vendin dy herë.
  // Vendi zbret vetëm nëse vende > 0, dhe kërkesa pranohet vetëm nëse vendi u zbrit.
  const rows = await sql`WITH k AS (
      SELECT k.id, k.udhetim_id FROM kerkesat k
      JOIN udhetimet u ON u.id = k.udhetim_id
      WHERE k.id = ${kerkesaId} AND k.statusi = 'ne_pritje' AND u.shofer_id = ${p.id}
      FOR UPDATE OF k
    ),
    vend AS (
      UPDATE udhetimet SET vende = vende - 1
      WHERE id IN (SELECT udhetim_id FROM k) AND vende > 0
      RETURNING id
    )
    UPDATE kerkesat SET statusi = 'pranuar'
    WHERE id IN (SELECT id FROM k) AND EXISTS (SELECT 1 FROM vend)
    RETURNING id`;
  if (rows.length === 1) return "pranuar";
  const mbetet = await sql`SELECT 1 FROM kerkesat k JOIN udhetimet u ON u.id = k.udhetim_id
    WHERE k.id = ${kerkesaId} AND k.statusi = 'ne_pritje' AND u.shofer_id = ${p.id} AND u.vende = 0`;
  return mbetet.length > 0 ? "pa_vende" : "ndaluar";
}
