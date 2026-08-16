import Link from 'next/link'

const newsItems = [
  {
    slug: 'building-security-awareness-across-campuses',
    title: 'Building security awareness across campuses',
    summary: 'Creating stronger digital habits starts with practical understanding, not fear-based messaging.',
  },
  {
    slug: 'recognizing-suspicious-messages-before-they-become-harm',
    title: 'Recognizing suspicious messages before they become harm',
    summary: 'Simple verification habits can prevent social engineering before the damage begins.',
  },
]

export default function NewsPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16 md:px-10 lg:px-12">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/80">News & updates</p>
      <h1 className="mt-4 text-4xl font-semibold text-white md:text-5xl">Latest updates from the Vault.</h1>
      <div className="mt-10 space-y-6">
        {newsItems.map((item) => (
          <article key={item.slug} className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-400">News</p>
            <h2 className="mt-4 text-2xl font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-slate-300">{item.summary}</p>
            <Link href={`/news/${item.slug}`} className="mt-5 inline-flex text-sm font-medium text-cyan-200">
              Read article →
            </Link>
          </article>
        ))}
      </div>
    </main>
  )
}
