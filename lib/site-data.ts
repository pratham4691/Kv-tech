import { createSupabaseServerClient } from '@/lib/supabase/server'

export type HomepageData = {
  news: Array<{ title: string; summary: string; href: string; date: string }>
  updates: Array<{ title: string; summary: string; href: string; date: string }>
  activities: Array<{ title: string; institution: string; location: string; date: string; description: string }>
  network: Array<{ name: string; location: string; type: string; engagement: string; date: string }>
}

const fallbackHomepageData: HomepageData = {
  news: [
    {
      title: 'Building security awareness across campuses',
      summary: 'A practical introduction to the ideas shaping safer digital communities.',
      href: '/news/building-security-awareness-across-campuses',
      date: '2026-08-12',
    },
    {
      title: 'Recognizing suspicious messages before they become harm',
      summary: 'An awareness-first guide to social engineering, impersonation and phishing.',
      href: '/news/recognizing-suspicious-messages-before-they-become-harm',
      date: '2026-08-01',
    },
  ],
  updates: [
    {
      title: 'Security Alert: Smishing campaign targeting students',
      summary: 'Protect student accounts by verifying unexpected requests and reporting suspicious messages early.',
      href: '/awareness/safe-public-wifi-habits',
      date: '2026-08-15',
    },
    {
      title: 'Awareness campaign: safe public Wi-Fi habits',
      summary: 'Small habits can help prevent account compromise and reduce social engineering risks.',
      href: '/awareness/safe-public-wifi-habits',
      date: '2026-08-09',
    },
  ],
  activities: [
    {
      title: 'Cybersecurity Awareness Session',
      institution: 'XYZ College',
      location: 'Mangalore, Karnataka',
      date: '2026-08-10',
      description: 'Practical guidance on safer digital habits, phishing awareness and responsible online behavior.',
    },
    {
      title: 'Research Interaction',
      institution: 'Regional Research Collective',
      location: 'Bengaluru, Karnataka',
      date: '2026-07-27',
      description: 'Focused discussion on research ethics, digital trust and security culture in emerging institutions.',
    },
  ],
  network: [
    {
      name: 'XYZ College',
      location: 'Mangalore, Karnataka',
      type: 'College',
      engagement: 'Awareness Session',
      date: '2026-08-10',
    },
    {
      name: 'Regional Research Collective',
      location: 'Bengaluru, Karnataka',
      type: 'Research Organization',
      engagement: 'Research Collaboration',
      date: '2026-07-27',
    },
  ],
}

export async function getHomepageData(): Promise<HomepageData> {
  const supabase = await createSupabaseServerClient()

  if (!supabase) {
    return fallbackHomepageData
  }

  const [newsResult, activityResult, networkResult] = await Promise.all([
    supabase
      .from('news')
      .select('title, summary, slug, published_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(2),
    supabase
      .from('events')
      .select('title, institution, location, event_date, description')
      .eq('is_published', true)
      .order('event_date', { ascending: false })
      .limit(2),
    supabase
      .from('network_organizations')
      .select('name, location, organization_type, engagement_type, first_interaction_date')
      .eq('is_published', true)
      .order('first_interaction_date', { ascending: false })
      .limit(6),
  ])

  const news = (newsResult.data ?? []).map((item) => ({
    title: String(item.title),
    summary: item.summary ? String(item.summary) : 'Published awareness content',
    href: `/news/${String(item.slug)}`,
    date: item.published_at ? new Date(item.published_at).toISOString().slice(0, 10) : '2026-01-01',
  }))

  const activities = (activityResult.data ?? []).map((item) => ({
    title: String(item.title),
    institution: item.institution ? String(item.institution) : 'Institution',
    location: item.location ? String(item.location) : 'Location',
    date: item.event_date ? new Date(item.event_date).toISOString().slice(0, 10) : '2026-01-01',
    description: item.description ? String(item.description) : 'Published public session details.',
  }))

  const network = (networkResult.data ?? []).map((item) => ({
    name: String(item.name),
    location: item.location ? String(item.location) : 'Location',
    type: item.organization_type ? String(item.organization_type) : 'Institution',
    engagement: item.engagement_type ? String(item.engagement_type) : 'Awareness Session',
    date: item.first_interaction_date ? new Date(item.first_interaction_date).toISOString().slice(0, 10) : '2026-01-01',
  }))

  return {
    news: news.length ? news : fallbackHomepageData.news,
    updates: fallbackHomepageData.updates,
    activities: activities.length ? activities : fallbackHomepageData.activities,
    network: network.length ? network : fallbackHomepageData.network,
  }
}
