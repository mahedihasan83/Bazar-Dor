import Link from "next/link";
export default function EmptyState({
  title = "কিছু খুঁজে পাওয়া যায়নি",
  text = "আপনি যে পাতাটি খুঁজছেন সেটি নেই বা সরানো হয়েছে।",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <p className="text-6xl font-bold text-primary">৪০৪</p>
      <h2 className="text-xl font-semibold mt-3">{title}</h2>
      <p className="text-base-content/60 mt-2">{text}</p>
      <Link href="/" className="btn btn-primary mt-6">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
