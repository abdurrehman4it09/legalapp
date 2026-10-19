import './globals.css'

export const metadata = {
  title: 'Pakistan Legal Platform.',
  description: 'The premier bilingual digital directory and legal news platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-white flex flex-col min-h-screen font-sans text-gray-900">
        
        <div className="flex-grow">
          {children}
        </div>

        {/* ULTRA-MINIMALIST FOOTER */}
        <footer className="bg-white py-16 border-t border-gray-100 mt-12">
          <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 tracking-tight">Pakistan Legal Platform<span className="text-emerald-800">.</span></h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bridging the gap between citizens and justice. The premier bilingual database for legal news, statutes, and verified advocates.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-emerald-800">Platform Links</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/" className="hover:text-emerald-800 transition">The Daily Brief (English)</a></li>
                <li><a href="/urdu" className="hover:text-emerald-800 transition font-bold" dir="rtl">روزنامہ بریف (اردو)</a></li>
                <li><a href="/laws" className="hover:text-emerald-800 transition">Digital Law Library</a></li>
                <li><a href="/lawyers" className="hover:text-emerald-800 transition">Verified Advocates Directory</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-emerald-800">Contact & Support</h4>
              <p className="text-gray-500 text-sm mb-2">support@paklegalplatform.com</p>
              <p className="text-gray-500 text-sm">Lahore, Punjab, Pakistan</p>
            </div>

          </div>
          
          <div className="max-w-5xl mx-auto px-6 mt-16 pt-8 border-t border-gray-100 text-center text-xs text-gray-400 tracking-widest uppercase">
            © {new Date().getFullYear()} Pakistan Legal Platform. All Rights Reserved.
          </div>
        </footer>

      </body>
    </html>
  )
}