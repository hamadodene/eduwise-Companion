import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { UserProvider } from "@/components/user-provider"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (   
    <>
      <html lang="en">
        <head />
        <body className={inter.className} suppressHydrationWarning={true}>
            <ThemeProvider attribute="class" defaultTheme="system"  enableSystem>
              <UserProvider>
                {children}
              </UserProvider> 
            </ThemeProvider>
        </body>
      </html>
    </>
  )
}

