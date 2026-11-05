import Link from "next/link";
import { Product } from "@/lib/normalize";
import { fmtChange, fmtPrice, toneClass } from "@/lib/format";

export default function ProductCard({ p }: { p: Product }) {
  const ch = fmtChange(p.change);
  const isImg = /^https?:|^\//.test(p.emoji);
  return (
    <Link
      href={`/product/${p.slug}`}
      className="card bg-base-100 border border-base-300 hover:border-primary hover:shadow-md transition"
    >
      <div className="card-body p-4 gap-1">
        <div className="text-4xl leading-none h-10">
          {isImg ? <img src={p.emoji} alt="" className="h-10" /> : p.emoji}
        </div>
        <h3 className="font-semibold text-lg mt-1">{p.name}</h3>
        <p className="text-sm text-base-content/60">{p.unit}</p>
        <div className="mt-2 flex items-end justify-between gap-2">
          <div>
            <p className="text-xs text-base-content/60">আজকের দাম</p>
            <p className="font-bold text-lg">{fmtPrice(p.price)} টাকা</p>
          </div>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-semibold ${toneClass[ch.tone]}`}
          >
            {ch.text}
          </span>
        </div>
      </div>
    </Link>
  );
}
