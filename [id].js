import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Navbar from '../../components/Navbar'
import { useToast } from '../../components/Toast'
import { getTaskById, TASK_TYPES, DIFFICULTY, creditsToRupees } from '../../lib/tasks'
import { useAuth } from '../../lib/AuthContext'
import { supabase } from '../../lib/supabase'

export default function TaskPage() {
  const router = useRouter()
  const { id } = router.query
  const { user, profile, refreshProfile } = useAuth()
  const { toast, ToastContainer } = useToast()

  const task = getTaskById(id)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadyDone, setAlreadyDone] = useState(false)

  useEffect(() => {
    if (!user) router.push('/auth/login')
  }, [user, router])

  useEffect(() => {
    if (user && id) checkIfDone()
  }, [user, id])

  async function checkIfDone() {
    const { data } = await supabase.from('submissions').select('id').eq('user_id', user.id).eq('task_id', id).single()
    if (data) setAlreadyDone(true)
  }

  const handleChange = (key, value) => setAnswers(a => ({ ...a, [key]: value }))

  const handleSubmit = async () => {
    if (!user || !task) return
    const allFilled = task.fields.every(f => answers[f.label]?.trim?.() || (f.type === 'select' && answers[f.label]))
    if (!allFilled) return toast('Saare fields fill karo', 'error')

    setSubmitting(true)
    try {
      const { error } = await supabase.from('submissions').insert({
        user_id: user.id,
        task_id: task.id,
        task_type: task.type,
        answers: answers,
        status: 'pending',
        credits_awarded: task.credits,
        submitted_at: new Date().toISOString(),
      })
      if (error) throw error

      // Auto-approve and add credits (in production: admin reviews first)
      await supabase.from('submissions').update({ status: 'approved' }).eq('user_id', user.id).eq('task_id', task.id)
      await supabase.from('profiles').update({
        credits: (profile?.credits ?? 0) + task.credits,
        tasks_completed: (profile?.tasks_completed ?? 0) + 1,
      }).eq('id', user.id)

      await refreshProfile()
      setSubmitted(true)
      toast(`+${task.credits} credits mile! 🎉`, 'success')
    } catch (err) {
      toast('Submit karne mein error aaya. Try karo phir.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (!task) return (
    <div className="min-h-screen bg-surface flex items-center justify-center text-slate-400">
      Task nahi mila...
    </div>
  )

  const type = TASK_TYPES[task.type]
  const diff = DIFFICULTY[task.difficulty]

  return (
    <>
      <Head><title>{task.title} — CollabAI</title></Head>
      <ToastContainer />
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

          {/* Back */}
          <Link href="/tasks" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 text-sm mb-8 transition-colors">
            ← Tasks pe wapas jao
          </Link>

          {/* Task Header */}
          <div className="card p-8 mb-6">
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <span className="badge" style={{ background: type.bg, color: type.color }}>{type.icon} {type.label}</span>
              <span className="text-sm font-bold" style={{ color: diff.color }}>● {task.difficulty}</span>
              <span className="text-slate-500 text-sm">⏱ {task.time}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-100 mb-3">{task.title}</h1>
            <p className="text-slate-400 leading-relaxed mb-6">{task.description}</p>

            {/* Reward box */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="bg-brand-500/10 border border-brand-500/30 rounded-xl px-5 py-3 text-center">
                <div className="text-brand-300 font-black text-xl">+{task.credits}</div>
                <div className="text-slate-500 text-xs">Credits</div>
              </div>
              <div className="bg-surface-2 border border-surface-border rounded-xl px-5 py-3 text-center">
                <div className="font-bold text-slate-200">≈ ₹{creditsToRupees(task.credits)}</div>
                <div className="text-slate-500 text-xs">Estimated Value</div>
              </div>
            </div>
          </div>

          {alreadyDone && !submitted ? (
            <div className="card p-8 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-xl font-black text-slate-100 mb-2">Yeh task already complete hai!</h2>
              <p className="text-slate-400 mb-6">Dusra task karo aur aur credits kamao.</p>
              <Link href="/tasks" className="btn-primary">More Tasks Dekho →</Link>
            </div>
          ) : submitted ? (
            <div className="card p-10 text-center animate-fade-in">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-black text-green-400 mb-2">+{task.credits} Credits Mile!</h2>
              <p className="text-slate-400 mb-2">Task successfully submit ho gaya.</p>
              <p className="text-slate-500 text-sm mb-8">Review ke baad final approval milega. Credits already credited hain.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Link href="/dashboard" className="btn-primary">Dashboard Dekho</Link>
                <Link href="/tasks" className="btn-secondary">Aur Tasks Karo</Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Instructions */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-200 mb-4">📋 Instructions</h2>
                <ol className="space-y-2">
                  {task.instructions.map((inst, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-400 text-sm">
                      <span className="text-brand-400 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Sample */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-200 mb-4">💡 Example</h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Input</div>
                    <div className="bg-surface-2 rounded-lg p-4 text-slate-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">{task.sample_input}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-2">Expected Output</div>
                    <div className="bg-green-950/40 border border-green-500/20 rounded-lg p-4 text-green-300 text-sm font-mono leading-relaxed whitespace-pre-wrap">{task.sample_output}</div>
                  </div>
                </div>
              </div>

              {/* Form */}
              <div className="card p-6">
                <h2 className="font-bold text-slate-200 mb-6">✍️ Apna Kaam Submit Karo</h2>
                <div className="space-y-5">
                  {task.fields.map(field => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-slate-300 mb-2">{field.label}</label>
                      {field.type === 'select' ? (
                        <select className="input-field" value={answers[field.label] ?? ''} onChange={e => handleChange(field.label, e.target.value)}>
                          <option value="">-- Choose karo --</option>
                          {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : field.type === 'code' ? (
                        <textarea
                          className="input-field font-mono text-sm resize-y"
                          rows={field.rows ?? 10}
                          placeholder={field.placeholder}
                          value={answers[field.label] ?? ''}
                          onChange={e => handleChange(field.label, e.target.value)}
                          spellCheck={false}
                        />
                      ) : field.type === 'text' ? (
                        <input className="input-field" placeholder={field.placeholder} value={answers[field.label] ?? ''} onChange={e => handleChange(field.label, e.target.value)} />
                      ) : (
                        <textarea
                          className="input-field resize-y"
                          rows={field.rows ?? 5}
                          placeholder={field.placeholder}
                          value={answers[field.label] ?? ''}
                          onChange={e => handleChange(field.label, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-surface-border flex items-center justify-between flex-wrap gap-4">
                  <div className="text-slate-400 text-sm">Submit ke baad +<span className="text-brand-300 font-bold">{task.credits} credits</span> milenge</div>
                  <button className="btn-primary px-8" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? 'Submit ho raha hai...' : `Submit & +${task.credits} Credits Lo 🎯`}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
