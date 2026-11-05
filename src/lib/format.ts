const BN = "০১২৩৪৫৬৭৮৯";
export const toBn = (v: string | number) =>
  String(v).replace(/\d/g, (d) => BN[+d]);
export const fromBn = (s: string) =>
  s.replace(/[০-৯]/g, (d) => String(BN.indexOf(d)));

/** Parses numbers, "1,850", "১,৮৫০ টাকা" etc. into a real number. */
export const parseNum = (v: any): number => {
  if (typeof v === "number") return v;
  if (v === null || v === undefined) return NaN;
  return parseFloat(
    fromBn(String(v))
      .replace(/,/g, "")
      .replace(/[^\d.\-]/g, ""),
  );
};

export const fmtPrice = (n: number) =>
  Number.isFinite(n)
    ? toBn(n.toLocaleString("en-US", { maximumFractionDigits: 2 }))
    : "—";

export type Tone = "up" | "down" | "flat";
export const fmtChange = (c: number): { text: string; tone: Tone } => {
  if (!Number.isFinite(c) || Math.abs(c) < 0.05)
    return { text: `—${toBn("0.0")}%`, tone: "flat" };
  const t = toBn(Math.abs(c).toFixed(1));
  return c > 0
    ? { text: `▲ ${t}%`, tone: "up" }
    : { text: `▼ ${t}%`, tone: "down" };
};

export const toneClass: Record<Tone, string> = {
  up: "text-success bg-success/10",
  down: "text-error bg-error/10",
  flat: "text-base-content/60 bg-base-300/60",
};

export type SortMode = "default" | "asc" | "desc";
export const sortProducts = <T extends { price: number }>(
  list: T[],
  mode: SortMode,
): T[] => {
  if (mode === "default") return list;
  const copy = [...list];
  copy.sort((a, b) => (mode === "asc" ? a.price - b.price : b.price - a.price));
  return copy;
};

export const banglaDate = () =>
  new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
