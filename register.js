import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../../lib/AuthContext'
import Navbar from '../../components/Navbar'
import { useToast } from '../../components/Toast'

const ROLES = [
  { value: 'student', label: '🎓 Student', desc: 'College ya school mein hoon' },
  { value: 'freelancer', label: '💼 Freelancer', desc: 'Independent kaam karta hoon' },
  { value: 'professional', label: '🏢 Professional', desc: 'Job ke saath side income chahiye' },
  { value: 'researcher', label: '🔬 Researcher', desc: 'AI/ML research field mein hoon' },
]

export default function Register() {
  const { signUp } = useAuth()
  const router = useRouter()
  const { toast, ToastContainer } = useToast()

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  const handleNext = () => {
    if (!form.name.trim()) return toast('Apna naam daalo', 'error')
    if (!form.email.includes('@')) return toast('Valid email daalo', 'error')
    if (form.password.length < 6) return toast('Password kam se kam 6 characters ka hona chahiye', 'error')
    setStep(2)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      await signUp(form)
      toast('Account ban gaya! Welcome to CollabAI 🎉', 'success')
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      toast(err.message || 'Kuch galat ho gaya', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Join CollabAI — Free Register</title></Head>
      <ToastContainer />
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-2xl font-black text-white glow">C</div>
              <h1 className="text-2xl font-black text-slate-100 mb-2">CollabAI Join Karo</h1>
              <p className="text-slate-500 text-sm">Free hai. Credits se paise kamao.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full transition-colors ${s <= step ? 'bg-brand-500' : 'bg-surface-3'}`} />
              ))}
            </div>

            <div className="card p-8">
              {step === 1 ? (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Tumhara naam</label>
                    <input className="input-field" placeholder="Pradeep Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input className="input-field" type="email" placeholder="tum@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                    <input className="input-field" type="password" placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <button className="btn-primary w-full mt-2" onClick={handleNext}>Next →</button>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-3">Tum kaun ho?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {ROLES.map(r => (
                        <button key={r.value} onClick={() => setForm({ ...form, role: r.value })}
                          className={`p-4 rounded-xl border text-left transition-all ${form.role === r.value ? 'border-brand-500 bg-brand-500/10' : 'border-surface-border hover:border-slate-600 bg-surface-2'}`}>
                          <div className="font-semibold text-sm text-slate-200">{r.label}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{r.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button className="btn-primary w-full" onClick={handleSubmit} disabled={loading}>
                    {loading ? 'Account ban raha hai...' : 'Account Banao 🚀'}
                  </button>
                  <button className="w-full mt-3 text-slate-500 text-sm hover:text-slate-300 transition-colors" onClick={() => setStep(1)}>← Wapas jao</button>
                </div>
              )}
            </div>

            <p className="text-center text-slate-500 text-sm mt-6">
              Pehle se account hai?{' '}
              <Link href="/auth/login" className="text-brand-400 hover:text-brand-300 font-semibold">Login karo</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
