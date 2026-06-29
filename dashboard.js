import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/AuthContext'
import Navbar from '../components/Navbar'
import { TASKS, TASK_TYPES, DIFFICULTY, creditsToRupees, CREDIT_THRESHOLD, canWithdraw } from '../lib/tasks'
import { supabase } from '../lib/supabase'

export default function Dashboard() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [activity, setActivity] = useState([])

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login')
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchSubmissions()
      fetchLeaderboard()
      fetchActivity()
    }
  }, [user])

  async function fetchSubmissions() {
    const { data } = await supabase.from('submissions').select('task_id, status, credits_awarded, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(10)
    setSubmissions(data ?? [])
  }

  async function fetchLeaderboard() {
    const { data } = await supabase.from('profiles').select('name, credits, tasks_completed').order('credits', { ascending: false }).limit(5)
    setLeaderboard(data ?? [])
  }

  async function fetchActivity() {
    const { data } = await supabase.from('submissions').select('profiles(name), task_id, credits_awarded, created_at').eq('status', 'approved').order('created_at', { ascending: false }).limit(8)
    setActivity(data ?? [])
  }

  if (loading || !profile) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="text-slate-400 animate-pulse">Loading dashboard...</div>
    </div>
  )

  const completedIds = submissions.filter(s => s.status === 'approved').map(s => s.task_id)
  const pendingCount = submissions.filter(s => s.status === 'pending').length
  const withdrawable = canWithdraw(profile.credits)
  const progressPct = Math.min((profile.credits / CREDIT_THRESHOLD) * 100, 100)

  return (
    <>
      <Head><title>Dashboard — CollabAI</title></Head>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Top stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-black text-slate-100">Namaste, {profile.name} 👋</h1>
                <p className="text-slate-500 text-sm mt-1">{profile.role} · {completedIds.length} tasks complete</p>
              </div>
              {withdrawable && (
                <Link href="/wallet" className="btn-primary text-sm py-2.5 px-5 animate-pulse-slow">
                  💸 Withdrawal Available!
                </Link>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Credits', value: profile.credits, sub: `≈ ₹${creditsToRupees(profile.credits)}`, icon: '🪙', color: 'text-brand-300' },
                { label: 'Tasks Complete', value: completedIds.length, sub: `${pendingCount} pending review`, icon: '✅', color: 'text-green-400' },
                { label: 'Accuracy Score', value: `${profile.accuracy_score ?? 0}%`, sub: 'Bonus milta hai 95%+ pe', icon: '🎯', color: 'text-blue-400' },
                { label: 'Withdrawal Level', value: `${Math.round(progressPct)}%`, sub: `${CREDIT_THRESHOLD - profile.credits > 0 ? CREDIT_THRESHOLD - profile.credits + ' credits aur chahiye' : 'Eligible!'}`, icon: '📈', color: 'text-amber-400' },
              ].map(stat => (
                <div key={stat.label} className="card p-5">
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className={`text-2xl font-black mb-1 ${stat.color}`}>{stat.value}</div>
                  <div className="text-slate-500 text-xs">{stat.label}</div>
                  <div className="text-slate-600 text-xs mt-1">{stat.sub}</div>
                </div>
              ))}
            </div>

            {/* Withdrawal progress bar */}
            <div className="card p-5 mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-slate-300">Withdrawal Progress</span>
                <span className="text-xs text-slate-500">{profile.credits} / {CREDIT_THRESHOLD} credits</span>
              </div>
              <div className="h-2 bg-surface-3 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-blue-500 rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
              </div>
              <div className="text-xs text-slate-500 mt-2">
                {withdrawable ? '🎉 Withdrawal available! Wallet page pe jao.' : `${CREDIT_THRESHOLD - profile.credits} aur credits chahiye automatic payout ke liye`}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tasks */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-slate-200 text-lg">Available Tasks</h2>
                <Link href="/tasks" className="text-brand-400 text-sm hover:text-brand-300">Saare dekho →</Link>
              </div>
              <div className="space-y-3">
                {TASKS.slice(0, 5).map(task => {
                  const type = TASK_TYPES[task.type]
                  const diff = DIFFICULTY[task.difficulty]
                  const done = completedIds.includes(task.id)
                  return (
                    <div key={task.id} className={`card p-5 transition-all ${done ? 'opacity-60' : 'hover:border-brand-500/30'}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="badge" style={{ background: type.bg, color: type.color }}>{type.icon} {type.label}</span>
                            <span className="text-xs font-semibold" style={{ color: diff.color }}>● {task.difficulty}</span>
                          </div>
                          <div className="font-bold text-slate-200 mb-1">{task.title}</div>
                          <div className="text-slate-400 text-sm line-clamp-1">{task.description}</div>
                          <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                            <span>⏱ {task.time}</span>
                            <span className="text-brand-300 font-bold">+{task.credits} credits</span>
                          </div>
                        </div>
                        {done ? (
                          <span className="text-green-400 text-sm font-semibold whitespace-nowrap">✓ Done</span>
                        ) : (
                          <Link href={`/tasks/${task.id}`} className="btn-primary text-xs py-2 px-4 whitespace-nowrap">Start →</Link>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Leaderboard */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-200 mb-4">🏆 Leaderboard</h3>
                <div className="space-y-3">
                  {leaderboard.map((u, i) => (
                    <div key={u.name} className="flex items-center gap-3">
                      <span className="text-sm font-bold w-5" style={{ color: i === 0 ? '#f59e0b' : i === 1 ? '#94a3b8' : i === 2 ? '#f59e0b99' : '#475569' }}>{i + 1}</span>
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">{u.name?.[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-200 truncate">{u.name}</div>
                        <div className="text-xs text-slate-500">{u.tasks_completed} tasks</div>
                      </div>
                      <div className="text-brand-300 font-bold text-sm">{u.credits}</div>
                    </div>
                  ))}
                  {leaderboard.length === 0 && <div className="text-slate-500 text-sm text-center py-4">Pehle task karo, leaderboard pe aao!</div>}
                </div>
              </div>

              {/* Recent activity */}
              <div className="card p-5">
                <h3 className="font-bold text-slate-200 mb-4">⚡ Recent Activity</h3>
                <div className="space-y-3">
                  {activity.slice(0, 5).map((a, i) => {
                    const task = TASKS.find(t => t.id === a.task_id)
                    return (
                      <div key={i} className="text-xs text-slate-400 flex items-start gap-2">
                        <span className="text-green-400 font-bold shrink-0 mt-0.5">+{a.credits_awarded}</span>
                        <span><span className="text-slate-300">{a.profiles?.name}</span> ne "{task?.title}" complete kiya</span>
                      </div>
                    )
                  })}
                  {activity.length === 0 && <div className="text-slate-500 text-sm text-center py-4">Koi activity nahi abhi</div>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
