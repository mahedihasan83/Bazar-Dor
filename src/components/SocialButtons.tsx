"use client";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function SocialButtons() {
  const go = async (provider: "google" | "github") => {
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: "/",
    });
    if (error) toast.error(error.message || "সোশ্যাল লগইন ব্যর্থ হয়েছে");
  };
  return (
    <div className="grid grid-cols-2 gap-3">
      <button
        type="button"
        onClick={() => go("google")}
        className="btn btn-outline"
      >
        Google
      </button>
      <button
        type="button"
        onClick={() => go("github")}
        className="btn btn-outline"
      >
        GitHub
      </button>
    </div>
  );
}
