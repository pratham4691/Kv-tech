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
    default: 'Kalki Vault — Autonomous Defensive Intelligence & Cryptographic Architecture',
    template: '%s — Kalki Vault',
  },
  description:
    'Kalki Vault constructs zero-exposure cryptographic enclaves and autonomous incident severance systems for the post-quantum horizon.',
  keywords: [
    'cybersecurity',
    'zero trust',
    'post-quantum cryptography',
    'autonomous defense',
    'Kalki Vault',
  ],
  authors: [{ name: 'Kalki Vault' }],
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: 'Kalki Vault — Autonomous Defensive Intelligence & Cryptographic Architecture',
    description:
      'Zero-exposure cryptographic enclaves and autonomous incident severance systems.',
    siteName: 'Kalki Vault',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kalki Vault — Autonomous Defensive Intelligence & Cryptographic Architecture',
    description:
      'Zero-exposure cryptographic enclaves and autonomous incident severance systems.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#030508',
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
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} bg-[#030508]`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Italiana&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#030508]">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
