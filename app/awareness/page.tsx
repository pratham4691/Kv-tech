import Link from 'next/link'

const articles = [
  { slug: 'how-to-recognize-suspicious-messages', title: 'How to recognize suspicious messages', summary: 'Learn how to detect impersonation and malicious intent before a message turns into a compromise.' },
  { slug: 'protecting-student-accounts', title: 'Protecting student accounts', summary: 'Build stronger habits around account security, verification and device hygiene.' },
  { slug: 'safe-public-wifi-habits', title: 'Safe public Wi‑Fi habits', summary: 'Use caution with untrusted networks and protect personal accounts while using public access.' },
]

export default function AwarenessPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-12">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">Awareness center</p>
      <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Cybersecurity awareness for a safer digital future.</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Awareness article</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{article.title}</h2>
            <p className="mt-3 text-slate-300">{article.summary}</p>
            <Link href={`/awareness/${article.slug}`} className="mt-5 inline-flex text-sm font-medium text-cyan-200">
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
