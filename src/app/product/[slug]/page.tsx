"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";
import EmptyState from "@/components/EmptyState";
import { authClient } from "@/lib/auth-client";
import { getProduct, useAsync } from "@/lib/api";
import { fmtChange, fmtPrice, toneClass } from "@/lib/format";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: p, loading, error } = useAsync(() => getProduct(slug), [slug]);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");
      router.replace(`/signin?redirect=/product/${slug}`);
    }
  }, [isPending, session, router, slug]);

  if (isPending || loading || !session) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-10 w-1/2" />
        <div className="skeleton h-24 w-full" />
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
          <div className="skeleton h-24" />
        </div>
        <div className="skeleton h-56 w-full" />
      </div>
    );
  }
  if (error || !p) return <EmptyState title="পণ্যটি পাওয়া যায়নি" />;

  const ch = fmtChange(p.change);
  const stats = [
    { label: "সর্বনিম্ন দাম", v: p.min },
    { label: "সর্বোচ্চ দাম", v: p.max },
    { label: "গড় দাম", v: p.avg },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← সব পণ্য
      </Link>

      <div className="card bg-base-100 border border-base-300 mt-3">
        <div className="card-body gap-3">
          <div className="flex items-start gap-4">
            <div className="text-6xl leading-none">{p.emoji}</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{p.name}</h1>
              {p.description && (
                <p className="text-base-content/70 mt-1">{p.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {p.tags.map((t) => (
                  <span key={t} className="badge badge-soft badge-primary">
                    {t}
                  </span>
                ))}
                {p.unit && (
                  <span className="badge badge-outline">{p.unit}</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-base-content/60">আজকের দাম</p>
              <p className="text-2xl font-bold">{fmtPrice(p.price)} টাকা</p>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${toneClass[ch.tone]}`}
              >
                {ch.text}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mt-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card bg-base-100 border border-base-300"
          >
            <div className="card-body p-4 gap-0">
              <p className="text-sm text-base-content/60">{s.label}</p>
              <p className="text-2xl font-bold text-primary">
                {fmtPrice(s.v)} টাকা
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-3">বাজারভিত্তিক আজকের দাম</h2>
      {p.markets.length === 0 ? (
        <p className="text-base-content/60">
          বাজারভিত্তিক দামের তথ্য পাওয়া যায়নি।
        </p>
      ) : (
        <div className="overflow-x-auto card bg-base-100 border border-base-300">
          <table className="table">
            <thead>
              <tr>
                <th>বাজার</th>
                <th className="text-right">দাম</th>
                <th className="text-right">পরিবর্তন</th>
              </tr>
            </thead>
            <tbody>
              {p.markets.map((m, i) => {
                const c = fmtChange(m.change);
                return (
                  <tr key={i}>
                    <td className="font-medium">{m.name}</td>
                    <td className="text-right">{fmtPrice(m.price)} টাকা</td>
                    <td className="text-right">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${toneClass[c.tone]}`}
                      >
                        {c.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
