import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#EBEBEB] text-black">
      <div className="max-w-5xl mx-auto px-8 py-12 md:px-12 md:py-16">
        {/* Header */}
        <header className="mb-16">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight">
            Laboratory
          </h1>
        </header>

        {/* Projects */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 border-t border-black pt-8 pb-10">
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Projects
          </h2>
          <div className="space-y-6">
            <Link href="/resume-generator" className="group block">
              <h3 className="text-lg font-black group-hover:underline">
                Resume Generator
              </h3>
              <p className="text-sm leading-relaxed mt-1">
                Generate PDF resumes from structured data profiles. Edit contact
                details, education, experience, and skills through a form
                interface, then export to a formatted PDF.
              </p>
            </Link>
          </div>
        </section>

        {/* Design */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 border-t border-black pt-8 pb-10">
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Design
          </h2>
          <div className="space-y-6">
            <Link href="/swiss-style" className="group block">
              <h3 className="text-lg font-black group-hover:underline">
                Die Neue Grafik Design
              </h3>
              <p className="text-sm leading-relaxed mt-1">
                A page built on the Swiss International Typographic Style grid.
                Bold sans-serif type, asymmetric layouts, and structured content
                sections inspired by Die Neue Grafik.
              </p>
            </Link>
          </div>
        </section>

        {/* Contact */}
        <section className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-6 md:gap-12 border-t border-black pt-8">
          <h2 className="text-xl md:text-2xl font-black leading-tight">
            Contact
          </h2>
          <div className="space-y-6">
            <Link href="/contact" className="group block">
              <h3 className="text-lg font-black group-hover:underline">
                Contact Form
              </h3>
              <p className="text-sm leading-relaxed mt-1">
                Three Swiss-style contact form variants with reactive
                typography, live letter preview, and drag-to-attach.
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
