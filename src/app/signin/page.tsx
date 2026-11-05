"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sp.get("reason") === "protected")
      toast.error("এই পাতা দেখতে আগে সাইন ইন করুন");
  }, [sp]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    if (!email || !password) return toast.error("ইমেইল ও পাসওয়ার্ড দিন");
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message || "ইমেইল বা পাসওয়ার্ড ভুল");
    toast.success("সফলভাবে সাইন ইন হয়েছে");
    const to = sp.get("redirect");
    router.push(to && to.startsWith("/") ? to : "/");
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300">
        <form onSubmit={submit} className="card-body gap-3">
          <h1 className="text-2xl font-bold">সাইন ইন</h1>
          <label className="form-control">
            <span className="text-sm mb-1 block">ইমেইল</span>
            <input
              name="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="you@example.com"
            />
          </label>
          <label className="form-control">
            <span className="text-sm mb-1 block">পাসওয়ার্ড</span>
            <input
              name="password"
              type="password"
              className="input input-bordered w-full"
              placeholder="••••••••"
            />
          </label>
          <button className="btn btn-primary mt-2" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm" />}{" "}
            সাইন ইন
          </button>
          <div className="divider text-xs my-1">অথবা</div>
          <SocialButtons />
          <p className="text-sm text-center mt-2">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="text-primary font-medium hover:underline"
            >
              সাইন আপ করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-md mx-auto p-12">
          <div className="skeleton h-80" />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
