'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

export default function ManageLawyers() {
  const [name, setName] = useState('')
  const [specialty, setSpecialty] = useState('')
  const [city, setCity] = useState('')
  const [intro, setIntro] = useState('')
  const [phone, setPhone] = useState('')
  const [imageUrl, setImageUrl] = useState('') // NEW: Image Link

  const [nameUrdu, setNameUrdu] = useState('')
  const [specialtyUrdu, setSpecialtyUrdu] = useState('')
  const [cityUrdu, setCityUrdu] = useState('')
  const [introUrdu, setIntroUrdu] = useState('')

  const [statusMsg, setStatusMsg] = useState('')
  const [lawyersList, setLawyersList] = useState<any[]>([])

  useEffect(() => { fetchLawyers() }, [])

  async function fetchLawyers() {
    const { data } = await supabase.from('lawyers').select('*').order('id', { ascending: false })
    if (data) setLawyersList(data)
  }

  async function addLawyer() {
    setStatusMsg('Saving...')
    const cleanPhone = phone.replace(/[^0-9]/g, '')
    const { error } = await supabase.from('lawyers').insert([{
      name, name_urdu: nameUrdu, specialty, specialty_urdu: specialtyUrdu, 
      city, city_urdu: cityUrdu, intro, intro_urdu: introUrdu, 
      phone: cleanPhone || '923000000000',
      image_url: imageUrl // NEW: Saves the photo link
    }])

    if (error) setStatusMsg('Failed to save.')
    else {
      setStatusMsg('Advocate Profile Added!')
      setName(''); setNameUrdu(''); setSpecialty(''); setSpecialtyUrdu(''); setCity(''); setCityUrdu(''); setIntro(''); setIntroUrdu(''); setPhone(''); setImageUrl('');
      fetchLawyers()
    }
  }

  async function deleteLawyer(id: number) {
    await supabase.from('lawyers').delete().eq('id', id)
    fetchLawyers()
  }

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans border-t-4 border-emerald-800">
      <div className="w-64 border-r border-gray-100 p-8 h-full fixed bg-white">
        <h2 className="text-xl font-bold mb-12 tracking-tight">Admin<span className="text-emerald-800">.</span></h2>
        <ul className="space-y-6 text-sm font-bold text-gray-400 uppercase tracking-widest">
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/dashboard">Dashboard</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin">Post News</Link></li>
          <li className="hover:text-emerald-800 transition cursor-pointer"><Link href="/admin/laws">Manage Laws</Link></li>
          <li className="text-emerald-800 border-b-2 border-emerald-800 inline-block pb-1">Manage Lawyers</li>
        </ul>
      </div>

      <div className="flex-1 p-12 ml-64 max-w-5xl">
        <header className="mb-12 border-b border-gray-100 pb-6">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Manage Lawyers</h1>
          <p className="text-gray-500 mt-2 text-lg">Add verified advocates with profile pictures.</p>
        </header>

        <div className="mb-16">
          <div className="grid grid-cols-2 gap-6 mb-8">
            <input type="text" placeholder="WhatsApp Phone (e.g., 923001234567)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={phone} onChange={e => setPhone(e.target.value)} />
            <input type="text" placeholder="Profile Picture URL (e.g., https://link-to-photo.jpg)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-12">
            <div>
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— English (LTR)</h4>
              <input type="text" placeholder="Name" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={name} onChange={e=>setName(e.target.value)}/>
              <input type="text" placeholder="Specialty" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={specialty} onChange={e=>setSpecialty(e.target.value)}/>
              <input type="text" placeholder="City" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={city} onChange={e=>setCity(e.target.value)}/>
              <textarea placeholder="Bio / Intro" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-32 focus:border-emerald-800 focus:bg-white outline-none transition" value={intro} onChange={e=>setIntro(e.target.value)}/>
            </div>
            <div dir="rtl">
              <h4 className="font-bold text-xs uppercase tracking-widest text-emerald-800 mb-6">— اردو (RTL)</h4>
              <input type="text" placeholder="نام" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={nameUrdu} onChange={e=>setNameUrdu(e.target.value)}/>
              <input type="text" placeholder="مہارت" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={specialtyUrdu} onChange={e=>setSpecialtyUrdu(e.target.value)}/>
              <input type="text" placeholder="شہر" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded focus:border-emerald-800 focus:bg-white outline-none transition" value={cityUrdu} onChange={e=>setCityUrdu(e.target.value)}/>
              <textarea placeholder="تعارف" className="w-full mb-4 p-4 bg-gray-50 border border-gray-100 rounded h-32 focus:border-emerald-800 focus:bg-white outline-none transition" value={introUrdu} onChange={e=>setIntroUrdu(e.target.value)}/>
            </div>
          </div>
          <button onClick={addLawyer} className="bg-emerald-800 text-white px-8 py-3 rounded font-bold tracking-wider hover:bg-emerald-900 transition">Add to Directory</button>
          {statusMsg && <p className="mt-4 font-bold text-emerald-800">{statusMsg}</p>}
        </div>

        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Registered Advocates</h3>
          <div className="space-y-4">
            {lawyersList.map((lawyer) => (
              <div key={lawyer.id} className="border-b border-gray-100 pb-4 flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  {lawyer.image_url ? (
                    <img src={lawyer.image_url} alt="Profile" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-sm">
                      {lawyer.name ? lawyer.name.charAt(0) : '?'}
                    </div>
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{lawyer.name}</h4>
                    <p className="text-sm text-gray-500">{lawyer.specialty} — {lawyer.city}</p>
                  </div>
                </div>
                <button onClick={() => deleteLawyer(lawyer.id)} className="text-xs text-red-500 font-bold uppercase tracking-widest hover:text-red-700 opacity-0 group-hover:opacity-100">Delete</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}