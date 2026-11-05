"use client";
import { useParams } from "next/navigation";
import { useState } from "react";
import Section from "@/components/Section";
import ProductGrid, { GridSkeleton } from "@/components/ProductGrid";
import SortSelect from "@/components/SortSelect";
import EmptyState from "@/components/EmptyState";
import { getCategories, getProducts, useAsync } from "@/lib/api";
import { SortMode, sortProducts } from "@/lib/format";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [sort, setSort] = useState<SortMode>("default");
  const { data, loading, error } = useAsync(() => getProducts(slug), [slug]);
  const { data: cats } = useAsync(getCategories, []);
  const cat = cats?.find((c) => c.slug === slug);

  if (!loading && (error || !data?.length)) {
    return (
      <EmptyState
        title="এই ক্যাটাগরিতে কোনো পণ্য নেই"
        text="ক্যাটাগরিটি সঠিক নয় অথবা এতে এখনো কোনো পণ্য যোগ হয়নি।"
      />
    );
  }

  return (
    <Section
      title={`${cat?.icon ?? ""} ${cat?.name ?? ""}`.trim() || "ক্যাটাগরি"}
      subtitle={
        data
          ? `মোট ${data.length.toLocaleString("bn-BD")}টি পণ্য`
          : "লোড হচ্ছে…"
      }
      right={<SortSelect value={sort} onChange={setSort} />}
    >
      {loading ? (
        <GridSkeleton n={8} />
      ) : (
        <ProductGrid items={sortProducts(data!, sort)} />
      )}
    </Section>
  );
}
