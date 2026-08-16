import { LandingPage } from '@/components/landing-page'
import { getHomepageData } from '@/lib/site-data'

export default async function HomePage() {
  const data = await getHomepageData()

  return <LandingPage data={data} />
}
