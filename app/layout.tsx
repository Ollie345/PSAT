import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Prostate Symptom Assessment',
  description: 'Prostate Assessment',
  generator: 'Cursor',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
