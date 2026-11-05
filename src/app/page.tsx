"use client";
import Hero from "@/components/Hero";
import Section from "@/components/Section";
import ProductGrid, { GridSkeleton } from "@/components/ProductGrid";
import { getProducts, useAsync } from "@/lib/api";

export default function Home() {
  const { data, loading, error } = useAsync(() => getProducts(), []);
  const all = data ?? [];
  const risers = all
    .filter((p) => p.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 6);
  const fallers = all
    .filter((p) => p.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 6);

  return (
    <>
      <Hero />
      <Section
        title="আজ দাম বেড়েছে ▲"
        subtitle="গতকালের তুলনায় সবচেয়ে বেশি বেড়েছে এমন ৬টি পণ্য"
      >
        {loading ? <GridSkeleton /> : <ProductGrid items={risers} />}
      </Section>
      <Section
        title="আজ দাম কমেছে ▼"
        subtitle="গতকালের তুলনায় সবচেয়ে বেশি কমেছে এমন ৬টি পণ্য"
      >
        {loading ? <GridSkeleton /> : <ProductGrid items={fallers} />}
      </Section>
      <Section
        id="সব-পণ্য"
        title="সব পণ্য"
        subtitle="বাজারে পাওয়া সব নিত্যপ্রয়োজনীয় পণ্যের আজকের দাম"
      >
        {loading ? (
          <GridSkeleton n={8} />
        ) : error ? (
          <p className="text-error">
            ডাটা লোড করা যায়নি। পরে আবার চেষ্টা করুন।
          </p>
        ) : (
          <ProductGrid items={all} />
        )}
      </Section>
    </>
  );
}
