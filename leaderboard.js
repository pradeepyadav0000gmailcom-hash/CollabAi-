import Head from 'next/head'
import Navbar from '../components/Navbar'
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { creditsToRupees } from '../lib/tasks'
import { useAuth } from '../lib/AuthContext'

const MEDALS = ['🥇', '🥈', '🥉']

export default function Leaderboard() {
  const { profile } = useAuth()
  const [leaders, setLeaders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('profiles').select('name, credits, tasks_completed, accuracy_score, role, joined_at')
      .order('credits', { ascending: false }).limit(50)
      .then(({ data }) => { setLeaders(data ?? []); setLoading(false) })
  }, [])

  return (
    <>
      <Head><title>Leaderboard — CollabAI</title></Head>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-slate-100 mb-2">🏆 Leaderboard</h1>
            <p className="text-slate-400">Sabse zyada credits kamane wale contributors</p>
          </div>

          {/* Top 3 podium */}
          {leaders.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-10">
              {[leaders[1], leaders[0], leaders[2]].map((u, i) => {
                const rank = [2, 1, 3][i]
                return (
                  <div key={u.name} className={`card p-5 text-center transition-all ${rank === 1 ? 'border-amber-500/40 bg-amber-500/5 glow' : ''}`}>
                    <div className="text-3xl mb-2">{MEDALS[rank - 1]}</div>
                    <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-lg font-bold text-white">{u.name?.[0]}</div>
                    <div className="font-bold text-slate-200 text-sm mb-1 truncate">{u.name}</div>
                    <div className="text-brand-300 font-black text-xl">{u.credits}</div>
                    <div className="text-slate-500 text-xs">credits</div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Full table */}
          <div className="card overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-5 py-3 border-b border-surface-border text-xs font-semibold text-slate-500 uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-4">Contributor</div>
              <div className="col-span-2 text-right">Credits</div>
              <div className="col-span-2 text-right hidden sm:block">Est. Value</div>
              <div className="col-span-2 text-right hidden sm:block">Tasks</div>
              <div className="col-span-1 text-right hidden md:block">Acc.</div>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-500 animate-pulse">Loading...</div>
            ) : leaders.map((u, i) => {
              const isYou = profile?.name === u.name
              return (
                <div key={u.name} className={`grid grid-cols-12 gap-2 px-5 py-4 border-b border-surface-border/50 items-center hover:bg-surface-2/50 transition-colors ${isYou ? 'bg-brand-500/5 border-l-2 border-l-brand-500' : ''}`}>
                  <div className="col-span-1 text-sm font-bold text-slate-400">
                    {i < 3 ? MEDALS[i] : <span className="text-slate-500">{i + 1}</span>}
                  </div>
                  <div className="col-span-4 flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white">{u.name?.[0]}</div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 text-sm truncate">{u.name} {isYou && <span className="text-brand-400 text-xs">(Tum)</span>}</div>
                      <div className="text-slate-500 text-xs capitalize">{u.role}</div>
                    </div>
                  </div>
                  <div className="col-span-2 text-right text-brand-300 font-black">{u.credits}</div>
                  <div className="col-span-2 text-right text-slate-400 text-sm hidden sm:block">₹{creditsToRupees(u.credits)}</div>
                  <div className="col-span-2 text-right text-slate-400 text-sm hidden sm:block">{u.tasks_completed}</div>
                  <div className="col-span-1 text-right text-green-400 text-sm font-semibold hidden md:block">{u.accuracy_score ?? 0}%</div>
                </div>
              )
            })}

            {leaders.length === 0 && !loading && (
              <div className="py-16 text-center text-slate-500">
                <div className="text-4xl mb-3">🏆</div>
                <div>Abhi koi leader nahi. Pehle ban jao!</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
