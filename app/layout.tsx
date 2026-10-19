import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pakistan Legal Platform | Digital Legal Directory',
  description: 'Find verified lawyers, legal statutes, and case updates across Pakistan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-white text-gray-900`}>
        {/* Navigation Bar */}
        <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl text-emerald-800 tracking-tight">
              Pakistan Legal Platform
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium text-gray-600">
              <Link href="/lawyers" className="hover:text-emerald-800 transition-colors">
                Lawyers
              </Link>
              <Link href="/laws" className="hover:text-emerald-800 transition-colors">
                Laws
              </Link>
              <Link href="/urdu" className="hover:text-emerald-800 transition-colors">
                اردو
              </Link>
              <Link
                href="/admin"
                className="bg-emerald-800 text-white px-3 py-1.5 rounded-md hover:bg-emerald-900 transition-colors text-xs uppercase tracking-wider"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-6 text-center text-xs text-gray-500 uppercase tracking-widest">
            © 2026 Pakistan Legal Platform. All Rights Reserved.
          </div>
        </footer>
      </body>
    </html>
  )
}