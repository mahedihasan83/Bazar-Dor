import { Product } from "@/lib/normalize";
import ProductCard from "./ProductCard";

export const gridCls =
  "grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4";

export function GridSkeleton({ n = 6 }: { n?: number }) {
  return (
    <div className={gridCls}>
      {Array.from({ length: n }).map((_, i) => (
        <div key={i} className="skeleton h-40 w-full" />
      ))}
    </div>
  );
}

export default function ProductGrid({ items }: { items: Product[] }) {
  return (
    <div className={gridCls}>
      {items.map((p) => (
        <ProductCard key={p.id || p.slug} p={p} />
      ))}
    </div>
  );
}
