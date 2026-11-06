import VendtakimiArtes from "../../components/VendtakimiArtes";

const udhetimiFiktiv = { id: 2, shoferi: "Dritoni", nisja: "Ferizaj", ora: "08:15", vende: 2 };

export default function Java08Test() {
  return (
    <main>
      <h1>RideShare</h1>
      <p>Udhëtarja · Arta</p>
      <p>
        {udhetimiFiktiv.nisja} → Kolegji AAB · {udhetimiFiktiv.shoferi} · ID {udhetimiFiktiv.id} ·{" "}
        {udhetimiFiktiv.ora} · {udhetimiFiktiv.vende} vende
      </p>
      <VendtakimiArtes />
    </main>
  );
}
