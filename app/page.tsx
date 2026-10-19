import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6 text-center bg-white">
      <p className="text-emerald-800 font-bold text-xs tracking-widest uppercase mb-6">
        — Welcome to the future of law
      </p>
      
      <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 mb-8 tracking-tight max-w-4xl leading-tight">
        Justice and clarity, <br /> now at your fingertips.
      </h1>
      
      <p className="text-lg md:text-xl text-gray-500 max-w-2xl mb-12 leading-relaxed">
        The premier bilingual platform connecting citizens with verified
        advocates, live legal news, and the complete digital law library of Pakistan.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link 
          href="/lawyers" 
          className="bg-emerald-800 text-white px-8 py-4 rounded-full font-bold hover:bg-emerald-900 transition-colors shadow-sm"
        >
          Find an Advocate
        </Link>
        <Link 
          href="/laws" 
          className="bg-white text-gray-900 border border-gray-200 px-8 py-4 rounded-full font-bold hover:border-gray-300 transition-colors shadow-sm"
        >
          Browse Laws
        </Link>
      </div>
    </div>
  )
}