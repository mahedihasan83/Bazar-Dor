"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { getCategories, useAsync } from "@/lib/api";
import { banglaDate } from "@/lib/format";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const { data: cats } = useAsync(getCategories, []);
  const [date, setDate] = useState("");
  useEffect(() => setDate(banglaDate()), []);

  const logout = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছে");
    router.push("/");
  };

  const linkCls = (active: boolean) =>
    `whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-primary text-primary-content"
        : "hover:bg-base-200 text-base-content/80"
    }`;

  return (
    <header className="bg-base-100 border-b border-base-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <Link href="/" className="leading-tight">
          <span className="flex items-center gap-2 text-xl font-bold text-primary">
            <Image src="/logo-icon.png" alt="" width={20} height={20} /> বাজার
            দর
          </span>
          <span className="block text-xs text-base-content/60 min-h-4">
            {date}
          </span>
        </Link>

        <nav className="hidden md:flex flex-1 justify-center gap-1 flex-wrap">
          <Link href="/" className={linkCls(pathname === "/")}>
            সব পণ্য
          </Link>
          {cats?.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={linkCls(pathname === `/category/${c.slug}`)}
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isPending ? (
            <div className="skeleton h-8 w-24" />
          ) : session ? (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-9 rounded-full bg-primary text-primary-content grid place-items-center">
                  {session.user.image ? (
                    <img src={session.user.image} alt="" />
                  ) : (
                    <span>{session.user.name?.[0]?.toUpperCase()}</span>
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content bg-base-100 rounded-box z-10 mt-2 w-52 p-2 shadow border border-base-300"
              >
                <li className="menu-title truncate">{session.user.name}</li>
                <li>
                  <Link href="/profile">আমার প্রোফাইল</Link>
                </li>
                <li>
                  <button onClick={logout}>সাইন আউট</button>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link
                href="/signin"
                className="btn btn-sm sm:btn-md btn-outline btn-primary"
              >
                সাইন ইন
              </Link>
              <Link href="/signup" className="btn btn-sm sm:btn-md btn-primary">
                সাইন আপ
              </Link>
            </>
          )}
        </div>
      </div>

      {/* mobile / tablet category row */}
      <nav className="md:hidden border-t border-base-300 overflow-x-auto">
        <div className="flex gap-1 px-4 py-2 w-max">
          <Link href="/" className={linkCls(pathname === "/")}>
            সব পণ্য
          </Link>
          {cats?.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className={linkCls(pathname === `/category/${c.slug}`)}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
