"use client";

import Link from "next/link";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#EDAB00] text-black">
      <div className="max-w-5xl mx-auto px-8 py-12 md:px-12 md:py-16">
        <header className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 md:gap-12 mb-16">
          <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-black leading-[0.95] tracking-tight">
            500
          </h1>
          <div>
            <Link
              href="/"
              className="flex items-center gap-2.5 hover:opacity-70 transition-opacity"
            >
              <div className="w-5 h-5 bg-black" />
              <span className="text-xl font-black tracking-tight">
                Laboratory
              </span>
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 border-t border-black pt-8 pb-10">
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Error
          </h2>
          <div className="text-sm leading-relaxed space-y-4">
            <p>Something went wrong. This is unexpected.</p>
            <div className="flex gap-6">
              <button
                onClick={reset}
                className="font-semibold hover:underline"
              >
                Try Again
              </button>
              <Link
                href="/"
                className="font-semibold hover:underline"
              >
                Return to Laboratory
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
