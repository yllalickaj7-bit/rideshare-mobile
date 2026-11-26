import "server-only";
import { getSql } from "../lib/db";
import { profiliIm } from "../lib/lejet";

// ID-ja e udhëtimit vjen nga klienti, ndaj serveri e verifikon para çdo shkrimi.
const ID_UDHETIMI = /^[0-9]{1,6}$/;

export async function preferuaratEMia(): Promise<string[]> {
  const p = await profiliIm();
  if (!p) return [];
  const sql = getSql();
  const rows = await sql`SELECT udhetim_id FROM te_preferuarat WHERE github_id = ${p.id} ORDER BY krijuar`;
  return rows.map((r) => String(r["udhetim_id"]));
}

// Idempotente: ruajtja dy herë ose heqja dy herë jep të njëjtin rezultat, pa dublikatë.
export async function vendosPreferuar(udhetimId: string, ruaj: boolean): Promise<"ok" | "hyr" | "fushe"> {
  const p = await profiliIm();
  if (!p) return "hyr";
  if (!ID_UDHETIMI.test(udhetimId)) return "fushe";
  const sql = getSql();
  if (ruaj) {
    const ekziston = await sql`SELECT 1 FROM udhetimet WHERE id = ${udhetimId}`;
    if (ekziston.length === 0) return "fushe";
    await sql`INSERT INTO te_preferuarat (github_id, udhetim_id) VALUES (${p.id}, ${udhetimId})
      ON CONFLICT (github_id, udhetim_id) DO NOTHING`;
  } else {
    await sql`DELETE FROM te_preferuarat WHERE github_id = ${p.id} AND udhetim_id = ${udhetimId}`;
  }
  return "ok";
}
