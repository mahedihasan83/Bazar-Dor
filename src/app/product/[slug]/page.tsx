
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

import EmptyState from "@/components/EmptyState";
import { authClient } from "@/lib/auth-client";
import { getProduct, useAsync } from "@/lib/api";
import { fmtPrice } from "@/lib/format";

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const {
    data: p,
    loading,
    error,
  } = useAsync(() => getProduct(slug), [slug]);

  useEffect(() => {
    if (!isPending && !session) {
      toast.error("পণ্যের বিস্তারিত দেখতে সাইন ইন করুন");

      router.replace(`/signin?redirect=/product/${slug}`);
    }
  }, [isPending, session, router, slug]);

  // Loading
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

  // Error
  if (error || !p) {
    return <EmptyState title="পণ্যটি পাওয়া যায়নি" />;
  }

  const stats = [
    {
      label: "সর্বনিম্ন দাম",
      value: p.min,
    },
    {
      label: "সর্বোচ্চ দাম",
      value: p.max,
    },
    {
      label: "গড় দাম",
      value: p.avg,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Back Link */}
      <Link
        href="/"
        className="text-sm text-primary hover:underline"
      >
        ← সব পণ্য
      </Link>

      {/* Product Information */}
      <div className="card bg-base-100 border border-base-300 mt-3">
        <div className="card-body gap-3">

          <div className="flex flex-col sm:flex-row items-start gap-4">

            <div className="text-6xl leading-none">
              {p.emoji}
            </div>

            <div className="flex-1">
              <h1 className="text-3xl font-bold">
                {p.name}
              </h1>

              {p.description && (
                <p className="text-base-content/70 mt-1">
                  {p.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 mt-3">
                {p.tags.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="badge badge-soft badge-primary"
                  >
                    {t}
                  </span>
                ))}

                {p.unit && (
                  <span className="badge badge-outline">
                    {p.unit}
                  </span>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-base-content/60">
                আজকের দাম
              </p>

              <p className="text-2xl font-bold">
                {fmtPrice(p.price)} টাকা
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Price Statistics */}
      <div className="grid sm:grid-cols-3 gap-4 mt-4">

        {stats.map((s) => (
          <div
            key={s.label}
            className="card bg-base-100 border border-base-300"
          >
            <div className="card-body p-4 gap-0">

              <p className="text-sm text-base-content/60">
                {s.label}
              </p>

              <p className="text-2xl font-bold text-primary">
                {Number.isFinite(s.value)
                  ? `${fmtPrice(s.value)} টাকা`
                  : "তথ্য নেই"}
              </p>

            </div>
          </div>
        ))}

      </div>

      {/* Market Price Table */}
      <h2 className="text-xl font-bold mt-8 mb-3">
        বাজারভিত্তিক আজকের দাম
      </h2>

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

                <th className="text-right">
                  সর্বনিম্ন দাম
                </th>

                <th className="text-right">
                  সর্বোচ্চ দাম
                </th>
              </tr>
            </thead>

            <tbody>
              {p.markets.map((m, i) => (

                <tr key={`${m.name}-${i}`}>

                  <td className="font-medium">
                    {m.name}
                  </td>

                  <td className="text-right text-success font-semibold">
                    {Number.isFinite(m.min)
                      ? `${fmtPrice(m.min)} টাকা`
                      : "তথ্য নেই"}
                  </td>

                  <td className="text-right text-error font-semibold">
                    {Number.isFinite(m.max)
                      ? `${fmtPrice(m.max)} টাকা`
                      : "তথ্য নেই"}
                  </td>

                </tr>

              ))}
            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}
