import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../components/Toast'
import { supabase } from '../lib/supabase'
import { creditsToRupees, CREDIT_THRESHOLD, canWithdraw } from '../lib/tasks'

export default function Wallet() {
  const { user, profile, refreshProfile } = useAuth()
  const router = useRouter()
  const { toast, ToastContainer } = useToast()
  const [history, setHistory] = useState([])
  const [upiId, setUpiId] = useState('')
  const [requesting, setRequesting] = useState(false)
  const [withdrawals, setWithdrawals] = useState([])

  useEffect(() => {
    if (!user) router.push('/auth/login')
    else { fetchHistory(); fetchWithdrawals() }
  }, [user, router])

  async function fetchHistory() {
    const { data } = await supabase.from('submissions').select('task_id, credits_awarded, status, submitted_at').eq('user_id', user.id).order('submitted_at', { ascending: false }).limit(20)
    setHistory(data ?? [])
  }

  async function fetchWithdrawals() {
    const { data } = await supabase.from('withdrawals').select('*').eq('user_id', user.id).order('requested_at', { ascending: false })
    setWithdrawals(data ?? [])
  }

  async function handleWithdraw() {
    if (!upiId.trim()) return toast('UPI ID daalo', 'error')
    if (!canWithdraw(profile?.credits)) return toast(`${CREDIT_THRESHOLD} credits chahiye withdrawal ke liye`, 'error')

    setRequesting(true)
    try {
      const amount = creditsToRupees(profile.credits)
      await supabase.from('withdrawals').insert({
        user_id: user.id,
        credits: profile.credits,
        amount_inr: parseFloat(amount),
        upi_id: upiId,
        status: 'pending',
        requested_at: new Date().toISOString(),
      })
      // Reset credits after withdrawal request
      await supabase.from('profiles').update({ credits: 0 }).eq('id', user.id)
      await refreshProfile()
      await fetchWithdrawals()
      toast(`Withdrawal request submit ho gayi! ₹${amount} milega jaldi. 🎉`, 'success')
      setUpiId('')
    } catch (err) {
      toast('Error aaya. Dobara try karo.', 'error')
    } finally {
      setRequesting(false)
    }
  }

  if (!profile) return null

  const eligible = canWithdraw(profile.credits)
  const progressPct = Math.min((profile.credits / CREDIT_THRESHOLD) * 100, 100)

  return (
    <>
      <Head><title>Wallet & Earnings — CollabAI</title></Head>
      <ToastContainer />
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl font-black text-slate-100 mb-8">💸 Wallet & Earnings</h1>

          {/* Balance card */}
          <div className="card p-8 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-blue-500/5 pointer-events-none" />
            <div className="relative">
              <div className="text-slate-400 text-sm mb-1">Current Balance</div>
              <div className="text-5xl font-black gradient-text mb-1">{profile.credits}</div>
              <div className="text-slate-400">credits · ≈ ₹{creditsToRupees(profile.credits)}</div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                  <span>Withdrawal Progress</span>
                  <span>{profile.credits} / {CREDIT_THRESHOLD} credits</span>
                </div>
                <div className="h-3 bg-surface-3 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${eligible ? 'bg-green-500' : 'bg-gradient-to-r from-brand-500 to-blue-500'}`} style={{ width: `${progressPct}%` }} />
                </div>
                {eligible ? (
                  <div className="text-green-400 text-sm font-semibold mt-2">✅ Withdrawal ke liye eligible ho!</div>
                ) : (
                  <div className="text-slate-500 text-sm mt-2">{CREDIT_THRESHOLD - profile.credits} aur credits chahiye</div>
                )}
              </div>
            </div>
          </div>

          {/* Withdrawal form */}
          <div className="card p-6 mb-6">
            <h2 className="font-bold text-slate-200 mb-2">Withdrawal Request</h2>
            <p className="text-slate-400 text-sm mb-5">
              {eligible
                ? 'Tumhare credits automatically process honge. UPI ID daalo.'
                : `${CREDIT_THRESHOLD} credits ke baad withdrawal milega. Abhi ${CREDIT_THRESHOLD - profile.credits} aur chahiye.`}
            </p>

            {eligible ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">UPI ID</label>
                  <input className="input-field" placeholder="yourname@upi" value={upiId} onChange={e => setUpiId(e.target.value)} />
                </div>
                <div className="bg-amber-950/40 border border-amber-500/20 rounded-xl p-4 text-sm text-amber-300">
                  ⚠️ Yeh payout tab process hoga jab CollabAI profitable ho. Credits ab bhi record mein rahenge.
                </div>
                <button className="btn-primary w-full" onClick={handleWithdraw} disabled={requesting}>
                  {requesting ? 'Request send ho rahi hai...' : `₹${creditsToRupees(profile.credits)} Withdraw Karo`}
                </button>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="text-4xl mb-3">🎯</div>
                <div className="text-slate-400 text-sm">Tasks karo aur credits kamao!</div>
                <a href="/tasks" className="btn-primary inline-block mt-4 text-sm">Tasks Dekho →</a>
              </div>
            )}
          </div>

          {/* Withdrawal history */}
          {withdrawals.length > 0 && (
            <div className="card p-6 mb-6">
              <h2 className="font-bold text-slate-200 mb-4">Withdrawal History</h2>
              <div className="space-y-3">
                {withdrawals.map(w => (
                  <div key={w.id} className="flex items-center justify-between py-3 border-b border-surface-border/50">
                    <div>
                      <div className="text-slate-300 text-sm font-semibold">₹{w.amount_inr}</div>
                      <div className="text-slate-500 text-xs">{w.credits} credits · {w.upi_id}</div>
                    </div>
                    <span className={`badge text-xs ${w.status === 'paid' ? 'bg-green-500/20 text-green-400' : w.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-surface-3 text-slate-400'}`}>
                      {w.status === 'paid' ? '✅ Paid' : w.status === 'pending' ? '⏳ Pending' : w.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transaction history */}
          <div className="card p-6">
            <h2 className="font-bold text-slate-200 mb-4">Credits History</h2>
            {history.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">Koi transaction nahi abhi tak. Pehla task karo!</div>
            ) : (
              <div className="space-y-3">
                {history.map((s, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-surface-border/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${s.status === 'approved' ? 'bg-green-400' : 'bg-amber-400'}`} />
                      <div>
                        <div className="text-slate-300 text-sm font-medium">{s.task_id}</div>
                        <div className="text-slate-500 text-xs">{new Date(s.submitted_at).toLocaleDateString('en-IN')}</div>
                      </div>
                    </div>
                    <div className={`font-bold text-sm ${s.status === 'approved' ? 'text-green-400' : 'text-amber-400'}`}>
                      +{s.credits_awarded}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
