'use client'

import { CinematicBackground } from './cinematic-background'
import { CinematicHeader } from './cinematic-header'
import { CinematicHero } from './cinematic-hero'
import { CyberThreatRadar } from './cyber-threat-radar'
import { CinematicFooter } from './cinematic-footer'
import type { HomepageData } from '@/lib/site-data'

export function LandingPage({ data }: { data: HomepageData }) {
  return (
    <div className="relative min-h-screen bg-[#030206] text-[#f4f6fa] selection:bg-amber-500/25 selection:text-white">
      {/* 1. Ambient Background */}
      <CinematicBackground />

      {/* 2. Professional Header */}
      <CinematicHeader />

      {/* 3. 3D Phoenix Natural Flight & Flaming Wing Wipe Hero */}
      <CinematicHero />

      {/* 4. Live Global Cybersecurity News & Daily Threat Intelligence Stream */}
      <CyberThreatRadar />

      {/* 5. Minimal Enterprise Footer */}
      <CinematicFooter />
    </div>
  )
}
