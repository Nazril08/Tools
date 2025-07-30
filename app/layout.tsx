import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'yeyo',
  description: '',
  generator: '',
  icons: {
    icon: '/image.png?v=2',
    shortcut: '/image.png?v=2',
    apple: '/image.png?v=2',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/image.png?v=2" type="image/png" />
        <link rel="shortcut icon" href="/image.png?v=2" type="image/png" />
        <link rel="apple-touch-icon" href="/image.png?v=2" />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
