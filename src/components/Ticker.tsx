"use client";
import { getProducts, useAsync } from "@/lib/api";
import { fmtChange, fmtPrice, toneClass } from "@/lib/format";

export default function Ticker() {
  const { data, loading } = useAsync(() => getProducts(), []);
  if (loading) return <div className="skeleton h-9 w-full rounded-none" />;
  if (!data?.length) return null;
  const items = [...data, ...data];
  return (
    <div
      className="marquee overflow-hidden bg-neutral text-neutral-content text-sm"
      aria-label="দামের তালিকা"
    >
      <div className="marquee-track py-2">
        {items.map((p, i) => {
          const ch = fmtChange(p.change);
          return (
            <span
              key={i}
              className="flex items-center gap-2 px-5 whitespace-nowrap"
            >
              <span>{p.emoji}</span>
              <span className="font-medium">{p.name}</span>
              <span>
                {fmtPrice(p.price)} টাকা/{p.unit.replace("প্রতি ", "")}
              </span>
              <span
                className={`rounded px-1.5 text-xs ${ch.tone === "up" ? "text-green-300" : ch.tone === "down" ? "text-red-300" : "text-gray-300"}`}
              >
                {ch.text}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
