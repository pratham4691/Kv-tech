import Link from 'next/link'
import { notFound } from 'next/navigation'

const awarenessMap: Record<string, { title: string; summary: string; content: string[] }> = {
  'how-to-recognize-suspicious-messages': {
    title: 'How to recognize suspicious messages',
    summary: 'Verifying a message before acting is one of the strongest defensive habits in any digital environment.',
    content: [
      'Check the sender address and compare it with known business or institutional patterns.',
      'Look for urgency, unexpected attachments and requests for login details or passwords.',
      'Verify the request using a known communication channel instead of responding directly.',
    ],
  },
  'protecting-student-accounts': {
    title: 'Protecting student accounts',
    summary: 'Student accounts often contain both academic information and personal data, making strong habits essential.',
    content: [
      'Use unique, strong passwords and update them when a device or service indicates compromise.',
      'Turn on multi-factor authentication where available and store recovery information securely.',
      'Be careful with email links and shared devices that may not be fully trusted.',
    ],
  },
  'safe-public-wifi-habits': {
    title: 'Safe public Wi‑Fi habits',
    summary: 'Public networks can expose weak habits if users treat them as trusted by default.',
    content: [
      'Avoid logging into sensitive accounts on untrusted networks unless you are using a managed or verified connection.',
      'When possible, use a trusted VPN or secure corporate access workflow.',
      'Confirm the network name and avoid connecting to obviously fake or duplicate access points.',
    ],
  },
}

export default async function AwarenessArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const article = awarenessMap[slug]

  if (!article) {
    notFound()
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 md:px-10 lg:px-12">
      <Link href="/awareness" className="text-sm text-cyan-200">← Back to awareness</Link>
      <p className="mt-6 text-xs uppercase tracking-[0.32em] text-cyan-200/80">Awareness article</p>
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
