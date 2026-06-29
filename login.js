import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../lib/AuthContext'
import Navbar from '../../components/Navbar'
import { useToast } from '../../components/Toast'

export default function Login() {
  const { signIn } = useAuth()
  const router = useRouter()
  const { toast, ToastContainer } = useToast()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.email || !form.password) return toast('Email aur password daalo', 'error')
    setLoading(true)
    try {
      await signIn(form)
      router.push('/dashboard')
    } catch (err) {
      toast('Email ya password galat hai', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Login — CollabAI</title></Head>
      <ToastContainer />
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white glow">C</div>
              <h1 className="text-2xl font-black text-slate-100 mb-2">Wapas aao!</h1>
              <p className="text-slate-500 text-sm">Apne credits check karo aur tasks karo</p>
            </div>

            <div className="card p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input className="input-field" type="email" placeholder="tum@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input className="input-field" type="password" placeholder="••••••••" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
              </div>
              <button className="btn-primary w-full mt-2" onClick={handleSubmit} disabled={loading}>
                {loading ? 'Login ho raha hai...' : 'Login Karo →'}
              </button>
            </div>

            <p className="text-center text-slate-500 text-sm mt-6">
              Account nahi hai?{' '}
              <Link href="/auth/register" className="text-brand-400 hover:text-brand-300 font-semibold">Free Join Karo</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
