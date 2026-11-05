"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SocialButtons from "@/components/SocialButtons";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim();
    const email = String(f.get("email") || "").trim();
    const password = String(f.get("password") || "");
    if (!name || !email || !password) return toast.error("সব ঘর পূরণ করুন");
    if (password.length < 8)
      return toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
    setLoading(true);
    const { error } = await authClient.signUp.email({ name, email, password });
    setLoading(false);
    if (error)
      return toast.error(error.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে");
    toast.success("রেজিস্ট্রেশন সফল! এবার সাইন ইন করুন");
    router.push("/signin");
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300">
        <form onSubmit={submit} className="card-body gap-3">
          <h1 className="text-2xl font-bold">সাইন আপ</h1>
          <label className="form-control">
            <span className="text-sm mb-1 block">নাম</span>
            <input
              name="name"
              className="input input-bordered w-full"
              placeholder="আপনার নাম"
            />
          </label>
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
              placeholder="কমপক্ষে ৮ অক্ষর"
            />
          </label>
          <button className="btn btn-primary mt-2" disabled={loading}>
            {loading && <span className="loading loading-spinner loading-sm" />}{" "}
            রেজিস্টার করুন
          </button>
          <div className="divider text-xs my-1">অথবা</div>
          <SocialButtons />
          <p className="text-sm text-center mt-2">
            আগে থেকেই অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="text-primary font-medium hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
