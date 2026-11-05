"use client";
import { SortMode } from "@/lib/format";

export default function SortSelect({
  value,
  onChange,
}: {
  value: SortMode;
  onChange: (v: SortMode) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="font-medium">সাজান:</span>
      <span className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value as SortMode)}
          className="appearance-none bg-base-100 border border-base-300 rounded-lg pl-3 pr-9 py-2 text-sm focus:outline-2 focus:outline-primary"
        >
          <option value="default">ডিফল্ট</option>
          <option value="asc">দাম: কম থেকে বেশি</option>
          <option value="desc">দাম: বেশি থেকে কম</option>
        </select>
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </label>
  );
}
