import type { Metadata } from 'next'
import Providers from '@/providers'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default:  'Repo Analyzer',
    template: '%s – Repo Analyzer',
  },
  description: 'Architecture intelligence for GitHub repositories.',
  icons: { icon: '/favicon.ico' },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-bg text-text antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}