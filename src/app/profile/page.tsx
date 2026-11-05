
"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="max-w-md mx-auto p-12">
        <div className="skeleton h-64" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto p-12 text-center">
        <p>প্রথমে সাইন ইন করুন।</p>
        <Link href="/signin" className="btn btn-primary mt-4">
          সাইন ইন
        </Link>
      </div>
    );
  }

  const user = session.user;

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body items-center text-center gap-2">
          <div className="avatar avatar-placeholder">
            <div className="bg-primary text-primary-content w-20 rounded-full text-3xl">
              {user.image ? (
                <img src={user.image} alt="" />
              ) : (
                <span>{user.name?.[0]?.toUpperCase()}</span>
              )}
            </div>
          </div>

          <h1 className="text-2xl font-bold mt-2">{user.name}</h1>
          <p className="text-base-content/70">{user.email}</p>

          <Link href="/profile/update" className="btn btn-primary mt-4">
            তথ্য আপডেট করুন
          </Link>
        </div>
      </div>
    </div>
  );
}
