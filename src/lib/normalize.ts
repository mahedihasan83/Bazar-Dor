import { parseNum } from "./format";

/**
 * The API field names can vary, so every field is read through `first()`
 * with several possible keys. If your API uses different names, add them here.
 */
const first = (o: any, keys: string[]) => {
  for (const k of keys)
    if (o?.[k] !== undefined && o?.[k] !== null && o?.[k] !== "") return o[k];
  return undefined;
};

export type Market = { name: string; price: number; change: number };
export type Product = {
  id: string;
  slug: string;
  name: string;
  emoji: string;
  unit: string;
  price: number;
  change: number;
  category: string;
  categoryName: string;
  description: string;
  tags: string[];
  min: number;
  max: number;
  avg: number;
  markets: Market[];
  raw: any;
};
export type Category = { slug: string; name: string; icon: string };

export const unwrap = (json: any): any[] => {
  if (Array.isArray(json)) return json;
  const d = json?.data ?? json?.products ?? json?.categories ?? json?.items;
  return Array.isArray(d) ? d : [];
};

const UNITS: Record<string, string> = {
  kg: "কেজি",
  liter: "লিটার",
  litre: "লিটার",
  l: "লিটার",
  dozen: "ডজন",
  piece: "পিস",
  pcs: "পিস",
  pc: "পিস",
};
const normUnit = (u: any) => {
  if (!u) return "";
  const s = String(u).trim();
  if (s.startsWith("প্রতি")) return s;
  return `প্রতি ${UNITS[s.toLowerCase()] ?? s}`;
};

const toMarket = (m: any): Market => ({
  name: String(
    first(m, [
      "name",
      "market",
      "bazar",
      "bazarName",
      "marketName",
      "location",
      "title",
    ]) ?? "বাজার",
  ),
  price: parseNum(first(m, ["price", "todayPrice", "amount", "currentPrice"])),
  change: parseNum(first(m, ["changePercent", "change", "percentChange"])) || 0,
});

export const normalizeProduct = (raw: any): Product => {
  const sum = first(raw, ["priceSummary", "summary", "stats", "priceStats"]);
  const src = { ...raw, ...(sum && typeof sum === "object" ? sum : {}) };

  const catRaw = first(raw, ["category", "categorySlug", "category_slug"]);
  const category =
    typeof catRaw === "object"
      ? String(catRaw?.slug ?? catRaw?.id ?? "")
      : String(catRaw ?? "");
  const categoryName =
    typeof catRaw === "object"
      ? String(first(catRaw, ["nameBn", "name"]) ?? category)
      : String(first(raw, ["categoryName", "categoryBn"]) ?? category);

  const mk = first(raw, [
    "markets",
    "bazars",
    "marketPrices",
    "prices",
    "bazarPrices",
    "market_prices",
  ]);
  const markets: Market[] = Array.isArray(mk) ? mk.map(toMarket) : [];
  const mp = markets.map((m) => m.price).filter(Number.isFinite);

  const price = parseNum(
    first(src, [
      "price",
      "todayPrice",
      "currentPrice",
      "avgPrice",
      "avg",
      "average",
    ]),
  );
  let change = parseNum(
    first(raw, [
      "changePercent",
      "change_percent",
      "percentChange",
      "changePct",
      "change",
      "priceChange",
    ]),
  );
  if (!Number.isFinite(change)) change = 0;
  const trend = String(first(raw, ["trend", "direction"]) ?? "").toLowerCase();
  if (change > 0 && (trend.includes("down") || trend.includes("কম")))
    change = -change;

  const tagsRaw = first(raw, ["tags", "categories"]);
  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map((t: any) =>
        typeof t === "object" ? String(t.nameBn ?? t.name) : String(t),
      )
    : categoryName
      ? [categoryName]
      : [];

  const imgOrEmoji = first(raw, ["emoji", "icon", "image", "thumbnail"]);
  return {
    id: String(first(raw, ["id", "_id"]) ?? first(raw, ["slug"]) ?? ""),
    slug: String(first(raw, ["slug"]) ?? first(raw, ["id", "_id"]) ?? ""),
    name: String(
      first(raw, ["nameBn", "name_bn", "bnName", "title", "name"]) ?? "পণ্য",
    ),
    emoji: String(imgOrEmoji ?? "🛒"),
    unit: normUnit(first(raw, ["unit", "unitBn"])),
    price: Number.isFinite(price)
      ? price
      : mp.length
        ? mp.reduce((a, b) => a + b, 0) / mp.length
        : NaN,
    change,
    category,
    categoryName,
    description: String(
      first(raw, ["description", "subtitle", "details", "marketSummary"]) ?? "",
    ),
    tags,
    min:
      parseNum(first(src, ["minPrice", "min", "min_price", "lowestPrice"])) ||
      (mp.length ? Math.min(...mp) : NaN),
    max:
      parseNum(first(src, ["maxPrice", "max", "max_price", "highestPrice"])) ||
      (mp.length ? Math.max(...mp) : NaN),
    avg:
      parseNum(first(src, ["avgPrice", "averagePrice", "avg", "average"])) ||
      (mp.length ? mp.reduce((a, b) => a + b, 0) / mp.length : NaN),
    markets,
    raw,
  };
};

export const normalizeCategory = (raw: any): Category => ({
  slug: String(first(raw, ["slug", "id", "_id", "categoryId"]) ?? ""),
  name: String(first(raw, ["nameBn", "name_bn", "title", "name"]) ?? ""),
  icon: String(first(raw, ["emoji", "icon"]) ?? "🛒"),
});
