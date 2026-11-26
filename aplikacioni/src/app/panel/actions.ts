"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ndryshoOren } from "@/lib/lejet";
import { pergjigju } from "@/lib/kerkesat";

export async function ruajOren(formData: FormData) {
  let mesazh: string;
  try {
    mesazh = await ndryshoOren(String(formData.get("id") ?? ""), String(formData.get("ora") ?? ""));
  } catch {
    mesazh = "databaza";
  }
  if (mesazh === "ruajtur") {
    revalidatePath("/");
    revalidatePath("/udhetimi/2");
  }
  redirect("/panel?m=" + mesazh);
}

export async function pergjigjuKerkeses(formData: FormData) {
  const veprimi = formData.get("veprimi") === "refuzo" ? "refuzo" : "prano";
  let mesazh: string;
  try {
    mesazh = await pergjigju(Number(formData.get("id")), veprimi);
  } catch {
    mesazh = "databaza";
  }
  if (mesazh === "pranuar" || mesazh === "refuzuar") {
    revalidatePath("/");
    revalidatePath("/udhetimi/[id]", "page");
  }
  redirect("/panel?m=" + mesazh);
}
