
import { parseNum } from "./format";

const first = (o: any, keys: string[]) => {
  for (const k of keys) {
    if (
      o?.[k] !== undefined &&
      o?.[k] !== null &&
      o?.[k] !== ""
    ) {
      return o[k];
    }
  }

  return undefined;
};

export type Market = {
  name: string;
  min: number;
  max: number;
  price: number;
  change: number;
};

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

export type Category = {
  slug: string;
  name: string;
  icon: string;
};

export const unwrap = (json: any): any[] => {
  if (Array.isArray(json)) return json;

  const d =
    json?.data ??
    json?.products ??
    json?.categories ??
    json?.items;

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

// Market normalization
const toMarket = (m: any): Market => {
  const min = parseNum(
    first(m, [
      "min",
      "minPrice",
      "min_price",
      "lowestPrice",
    ]),
  );

  const max = parseNum(
    first(m, [
      "max",
      "maxPrice",
      "max_price",
      "highestPrice",
    ]),
  );

  const actualPrice = parseNum(
    first(m, [
      "price",
      "todayPrice",
      "amount",
      "currentPrice",
    ]),
  );

  const price =
    Number.isFinite(actualPrice)
      ? actualPrice
      : Number.isFinite(min) && Number.isFinite(max)
        ? (min + max) / 2
        : Number.isFinite(min)
          ? min
          : Number.isFinite(max)
            ? max
            : NaN;

  return {
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

    min,
    max,
    price,
    change: 0,
  };
};

export const normalizeProduct = (raw: any): Product => {
  const sum = first(raw, [
    "priceSummary",
    "summary",
    "stats",
    "priceStats",
  ]);

  const src = {
    ...raw,
    ...(sum && typeof sum === "object" ? sum : {}),
  };

  // Category
  const catRaw = first(raw, [
    "category",
    "categorySlug",
    "category_slug",
  ]);

  const category =
    typeof catRaw === "object"
      ? String(catRaw?.slug ?? catRaw?.id ?? "")
      : String(catRaw ?? "");

  const categoryName =
    typeof catRaw === "object"
      ? String(
          first(catRaw, ["nameBn", "name"]) ?? category,
        )
      : String(
          first(raw, [
            "categoryNameBn",
            "categoryName",
            "categoryBn",
          ]) ?? category,
        );

  // Markets
  const mk = first(raw, [
    "markets",
    "bazars",
    "marketPrices",
    "prices",
    "bazarPrices",
    "market_prices",
  ]);

  const markets: Market[] = Array.isArray(mk)
    ? mk.map(toMarket)
    : [];

  // Today's price
  const price = parseNum(
    first(src, [
      "today",
      "price",
      "todayPrice",
      "currentPrice",
      "avgPrice",
      "avg",
      "average",
    ]),
  );

  // Price change
  const changeRaw = first(src, [
    "change",
    "changePercent",
    "change_percent",
    "percentChange",
    "changePct",
    "priceChange",
  ]);

  let change = parseNum(
    typeof changeRaw === "object" && changeRaw !== null
      ? first(changeRaw, ["pct", "percent", "value"])
      : changeRaw,
  );

  if (!Number.isFinite(change)) {
    change = 0;
  }

  const trend = String(
    typeof changeRaw === "object" && changeRaw !== null
      ? first(changeRaw, ["dir", "direction", "trend"])
      : first(raw, ["trend", "direction"]),
  ).toLowerCase();

  if (trend === "down" || trend.includes("কম")) {
    change = -Math.abs(change);
  } else if (
    trend === "up" ||
    trend.includes("বৃদ্ধি")
  ) {
    change = Math.abs(change);
  } else if (trend === "flat") {
    change = 0;
  }

  // Tags
  const tagsRaw = first(raw, ["tags", "categories"]);

  const tags = Array.isArray(tagsRaw)
    ? tagsRaw.map((t: any) =>
        typeof t === "object"
          ? String(t.nameBn ?? t.name)
          : String(t),
      )
    : categoryName
      ? [categoryName]
      : [];

  // Product image / emoji
  const imgOrEmoji = first(raw, [
    "image",
    "emoji",
    "icon",
    "thumbnail",
  ]);

  // Product minimum price
  const min = parseNum(
    first(src, [
      "minPrice",
      "min",
      "min_price",
      "lowestPrice",
    ]),
  );

  // Product maximum price
  const max = parseNum(
    first(src, [
      "maxPrice",
      "max",
      "max_price",
      "highestPrice",
    ]),
  );

  // Average price
  const avg = parseNum(
    first(src, [
      "avgPrice",
      "averagePrice",
      "avg",
      "average",
    ]),
  );

  // Fallback average from market prices
  const marketPrices = markets
    .flatMap((m) => [m.min, m.max])
    .filter((n) => Number.isFinite(n));

  const calculatedAvg =
    marketPrices.length > 0
      ? marketPrices.reduce((a, b) => a + b, 0) /
        marketPrices.length
      : NaN;

  return {
    id: String(
      first(raw, ["id", "_id"]) ??
        first(raw, ["slug"]) ??
        "",
    ),

    slug: String(
      first(raw, ["slug"]) ??
        first(raw, ["id", "_id"]) ??
        "",
    ),

    name: String(
      first(raw, [
        "nameBn",
        "name_bn",
        "bnName",
        "title",
        "name",
      ]) ?? "পণ্য",
    ),

    emoji: String(imgOrEmoji ?? "🛒"),

    unit: normUnit(
      first(raw, ["unit", "unitBn"]),
    ),

    price: Number.isFinite(price)
      ? price
      : Number.isFinite(avg)
        ? avg
        : calculatedAvg,

    change,

    category,
    categoryName,

    description: String(
      first(raw, [
        "description",
        "subtitle",
        "details",
        "marketSummary",
      ]) ?? "",
    ),

    tags,

    min: Number.isFinite(min)
      ? min
      : markets.length
        ? Math.min(
            ...markets
              .map((m) => m.min)
              .filter(Number.isFinite),
          )
        : NaN,

    max: Number.isFinite(max)
      ? max
      : markets.length
        ? Math.max(
            ...markets
              .map((m) => m.max)
              .filter(Number.isFinite),
          )
        : NaN,

    avg: Number.isFinite(avg)
      ? avg
      : Number.isFinite(price)
        ? price
        : calculatedAvg,

    markets,

    raw,
  };
};

export const normalizeCategory = (raw: any): Category => ({
  slug: String(
    first(raw, ["slug", "id", "_id", "categoryId"]) ?? "",
  ),

  name: String(
    first(raw, [
      "nameBn",
      "name_bn",
      "categoryNameBn",
      "title",
      "name",
    ]) ?? "",
  ),

  icon: String(
    first(raw, ["emoji", "icon"]) ?? "🛒",
  ),
});
