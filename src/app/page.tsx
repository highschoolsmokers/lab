import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-900 text-white px-6 py-4">
        <h1 className="text-xl font-semibold">W.S. Gong</h1>
      </header>
      <nav className="bg-white border-b px-6 py-3">
        <ul className="flex gap-6 text-sm">
          <li>
            <Link href="/resume-lab" className="text-gray-900 font-medium hover:underline">
              Resume Lab
            </Link>
          </li>
        </ul>
      </nav>
      <main className="max-w-3xl mx-auto p-6">
        <h2 className="text-2xl font-semibold mb-4">Projects</h2>
        <div className="bg-white border rounded-lg p-6">
          <Link href="/resume-lab" className="block group">
            <h3 className="text-lg font-semibold group-hover:underline">Resume Lab</h3>
            <p className="text-sm text-gray-500 mt-1">Generate PDF resumes from data profiles</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
