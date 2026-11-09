import type { Metadata } from 'next'
import { Domine, Plus_Jakarta_Sans } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'

const domine = Domine({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-domine',
})

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
})

const baldwins = localFont({
  src: '../public/fonts/SS_Baldwins_Serif.ttf',
  variable: '--font-baldwins',
  display: 'swap',
})

const aster = localFont({
  src: '../public/fonts/New_Aster_LT_Std_Bold.otf',
  variable: '--font-aster',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Eaglets Schools | Enterprise Management System',
  description:
    'Academic, Administrative & Multi-Channel Fee Finance ERP for Eaglets Schools (Main Campus, Lahore)',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${domine.variable} ${plusJakartaSans.variable} ${baldwins.variable} ${aster.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f9ff] text-[#121c2a]">
        {children}
      </body>
    </html>
  )
}
