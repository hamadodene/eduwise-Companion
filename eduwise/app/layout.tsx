import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from "@/components/user-provider"
import { Providers } from './provider'
import { Toaster } from "@/components/ui/toaster"


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Eduwise',
  description: 'Empower Your Learning',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <>
      <html lang="en">
        <head>
          <link rel="icon" href="/images/favicon.ico" />
          <link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700&display=swap" rel="stylesheet" />
        </head>
        <body className={inter.className} suppressHydrationWarning={true}>
          <UserProvider>
            <Providers>
              <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                {children}
                <Toaster />
              </ThemeProvider>
            </Providers>
          </UserProvider>
        </body>
      </html>
    </>
  )
}

