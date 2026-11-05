import Image from "next/image";

export default function Hero() {
  return (
    <section className="bg-base-100 border-b border-base-300">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-sm font-medium text-primary">আজকের বাজার দর</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mt-2">
            নিত্যপ্রয়োজনীয় পণ্যের দাম, এক নজরে
          </h1>
          <p className="mt-4 text-base-content/70 max-w-md">
            চাল, ডাল, তেল, সবজি, মাছ-মাংস — সব পণ্যের আজকের দাম এবং আগের দিনের
            তুলনায় বাড়া-কমা দেখে নিন এক জায়গায়।
          </p>
          <a href="#সব-পণ্য" className="btn btn-primary mt-6">
            সব পণ্যের দাম দেখুন
          </a>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/bazar-hero.png"
            alt="ফল ও সবজির ঝুড়ি"
            width={315}
            height={263}
            priority
            className="w-full max-w-sm h-auto"
          />
        </div>
      </div>
    </section>
  );
}
