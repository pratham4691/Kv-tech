import Link from 'next/link'
import { notFound } from 'next/navigation'

const newsMap: Record<string, { title: string; summary: string; content: string[] }> = {
  'building-security-awareness-across-campuses': {
    title: 'Building security awareness across campuses',
    summary: 'Security culture begins with practical learning, shared responsibility and everyday trust decisions.',
    content: [
      'Strong cybersecurity awareness starts by giving people everyday language to identify risk.',
      'When students, staff and institutions learn together, they become more effective at spotting suspicious behavior and reporting it early.',
      'The foundation of a resilient digital ecosystem is not fear; it is confidence built through education, verification and healthy skepticism.',
    ],
  },
  'recognizing-suspicious-messages-before-they-become-harm': {
    title: 'Recognizing suspicious messages before they become harm',
    summary: 'Quick verification steps help prevent scams and account compromise before a message can be acted on.',
    content: [
      'A suspicious message often creates urgency or uses a trusted style to trigger a quick action.',
      'A better response is to verify the sender through a known communication path and slow down before interacting with links or requests.',
      'Security awareness is most effective when it turns hesitation into a healthy protection habit.',
    ],
  },
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = newsMap[slug]

  if (!article) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
      <Link href="/news" className="text-sm text-cyan-200">← Back to news</Link>
      <p className="mt-6 text-xs uppercase tracking-[0.32em] text-cyan-200/80">News update</p>
      <h1 className="mt-4 text-4xl font-semibold text-white">{article.title}</h1>
      <p className="mt-5 text-lg text-slate-300">{article.summary}</p>

      <div className="mt-8 space-y-5 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
        {article.content.map((paragraph) => (
          <p key={paragraph} className="text-slate-200">{paragraph}</p>
        ))}
      </div>
    </main>
  )
}
