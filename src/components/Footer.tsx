export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-300 mt-10">
      <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between text-sm text-base-content/70">
        <p>
          <span className="font-semibold text-primary">বাজার দর</span> —
          প্রয়োজনীয় পণ্যের দাম এক নজরে।
        </p>
        <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
      </div>
    </footer>
  );
}
