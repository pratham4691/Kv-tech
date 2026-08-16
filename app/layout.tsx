import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
})

const siteUrl = 'https://kalkivault.example'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Kalki Vault — Cybersecurity Awareness, Research & Innovation',
    template: '%s — Kalki Vault',
  },
  description:
    'Kalki Vault is building a cybersecurity ecosystem focused on awareness, security research, education and future cybersecurity innovation.',
  keywords: [
    'cybersecurity',
    'security awareness',
    'security research',
    'threat intelligence',
    'Kalki Vault',
    'KV Technologies',
  ],
  authors: [{ name: 'Kalki Vault' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Kalki Vault — Cybersecurity Awareness, Research & Innovation',
    description:
      'Explore the threats shaping the digital world, understand how attacks happen, and build the knowledge required to stay ahead.',
    siteName: 'Kalki Vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalki Vault — Cybersecurity Awareness, Research & Innovation',
    description:
      'A cybersecurity ecosystem focused on awareness, research, education and innovation.',
  },
  robots: { index: true, follow: true },
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0b0e14',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-background`}
    >
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
