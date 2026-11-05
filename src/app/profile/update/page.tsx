
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function UpdateProfilePage() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) {
      setName(session.user.name || "");
    }
  }, [session]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("নাম খালি রাখা যাবে না");
      return;
    }

    setLoading(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
      });

      if (error) {
        toast.error(error.message || "আপডেট ব্যর্থ হয়েছে");
        return;
      }

      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.push("/profile");
    } catch {
      toast.error("তথ্য আপডেট করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="max-w-md mx-auto p-12">
        <div className="skeleton h-48" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-12 text-center">
        <p>প্রথমে সাইন ইন করুন।</p>
        <button
          onClick={() => router.push("/signin")}
          className="btn btn-primary mt-4"
        >
          সাইন ইন
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <form
        onSubmit={submit}
        className="card bg-base-100 border border-base-300"
      >
        <div className="card-body gap-3">
          <h1 className="text-2xl font-bold">
            তথ্য আপডেট করুন
          </h1>

          <label className="form-control">
            <span className="text-sm mb-1 block">নাম</span>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input input-bordered w-full"
            />
          </label>

          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading && (
              <span className="loading loading-spinner loading-sm" />
            )}
            তথ্য আপডেট করুন
          </button>
        </div>
      </form>
    </div>
  );
}
