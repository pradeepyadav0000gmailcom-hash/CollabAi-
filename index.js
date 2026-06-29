import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import { TASKS, TASK_TYPES, DIFFICULTY } from '../lib/tasks'
import { useAuth } from '../lib/AuthContext'

const ALL_TYPES = ['All', ...Object.keys(TASK_TYPES)]
const ALL_DIFF = ['All', 'Beginner', 'Intermediate', 'Advanced']

export default function Tasks() {
  const { user } = useAuth()
  const [typeFilter, setTypeFilter] = useState('All')
  const [diffFilter, setDiffFilter] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = TASKS.filter(t => {
    const matchType = typeFilter === 'All' || t.type === typeFilter
    const matchDiff = diffFilter === 'All' || t.difficulty === diffFilter
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.description.toLowerCase().includes(search.toLowerCase())
    return matchType && matchDiff && matchSearch
  })

  return (
    <>
      <Head><title>Tasks — CollabAI</title></Head>
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-100 mb-2">AI Tasks</h1>
            <p className="text-slate-400">Task complete karo → Credits kamao → Real money lo</p>
          </div>

          {/* Filters */}
          <div className="space-y-4 mb-8">
            <input className="input-field max-w-sm" placeholder="🔍 Task search karo..." value={search} onChange={e => setSearch(e.target.value)} />
            <div className="flex gap-2 flex-wrap">
              {ALL_TYPES.map(t => {
                const info = TASK_TYPES[t]
                return (
                  <button key={t} onClick={() => setTypeFilter(t)}
                    className={`badge text-xs py-1.5 px-3 transition-all cursor-pointer border ${typeFilter === t ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-surface-border text-slate-400 hover:border-slate-600'}`}>
                    {info ? `${info.icon} ${info.label}` : 'All Types'}
                  </button>
                )
              })}
            </div>
            <div className="flex gap-2">
              {ALL_DIFF.map(d => (
                <button key={d} onClick={() => setDiffFilter(d)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${diffFilter === d ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-surface-border text-slate-400 hover:border-slate-600'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Task grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(task => {
              const type = TASK_TYPES[task.type]
              const diff = DIFFICULTY[task.difficulty]
              return (
                <div key={task.id} className="card p-6 flex flex-col hover:border-brand-500/30 transition-all group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="badge text-xs" style={{ background: type.bg, color: type.color }}>{type.icon} {type.label}</span>
                    <span className="text-xs font-bold" style={{ color: diff.color }}>● {task.difficulty}</span>
                  </div>

                  <h3 className="font-bold text-slate-200 text-base mb-2 group-hover:text-white transition-colors">{task.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{task.description}</p>

                  <div className="border-t border-surface-border pt-4 flex items-center justify-between">
                    <div>
                      <div className="text-brand-300 font-black text-lg">+{task.credits}</div>
                      <div className="text-slate-500 text-xs">credits · {task.time}</div>
                    </div>
                    {user ? (
                      <Link href={`/tasks/${task.id}`} className="btn-primary text-sm py-2 px-5">Start →</Link>
                    ) : (
                      <Link href="/auth/register" className="btn-secondary text-sm py-2 px-5">Join to Start</Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-semibold">Koi task nahi mila</div>
              <div className="text-sm mt-1">Filter change karo ya search clear karo</div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
