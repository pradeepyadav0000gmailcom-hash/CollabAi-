import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose }) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3500)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    success: 'border-green-500/40 bg-green-950/80 text-green-300',
    error:   'border-red-500/40 bg-red-950/80 text-red-300',
    info:    'border-brand-500/40 bg-brand-950/80 text-brand-300',
  }

  const icons = { success: '✅', error: '❌', info: 'ℹ️' }

  return (
    <div className={`fixed top-5 right-5 z-[9999] flex items-center gap-3 border rounded-xl px-5 py-3.5 shadow-2xl backdrop-blur-xl font-semibold text-sm transition-all duration-300 ${colors[type]} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
      <span>{icons[type]}</span>
      <span>{message}</span>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  )
}

export function useToast() {
  const [toasts, setToasts] = useState([])

  const toast = (message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
  }

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id))

  const ToastContainer = () => (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2">
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />)}
    </div>
  )

  return { toast, ToastContainer }
}
