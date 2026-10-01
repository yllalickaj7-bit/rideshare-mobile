export function BadgeVende({ vende }: { vende: number }) {
  const cls =
    vende === 0
      ? "bg-destructive/15 text-destructive border-destructive/30"
      : vende === 1
        ? "bg-warning/15 text-warning border-warning/30"
        : "bg-success/15 text-success border-success/30";
  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${cls}`}>
      {vende === 0 ? "Plot" : `${vende} të lira`}
    </span>
  );
}
