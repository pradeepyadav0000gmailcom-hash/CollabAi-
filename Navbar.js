import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/AuthContext'
import { useState } from 'react'
import { creditsToRupees } from '../lib/tasks'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-border bg-surface-1/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center text-sm font-black text-white">C</div>
            <span className="font-black text-xl gradient-text">CollabAI</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {!user ? (
              <>
                <Link href="/tasks" className="text-slate-400 hover:text-slate-200 px-4 py-2 text-sm font-medium transition-colors">Tasks</Link>
                <Link href="/leaderboard" className="text-slate-400 hover:text-slate-200 px-4 py-2 text-sm font-medium transition-colors">Leaderboard</Link>
                <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">Login</Link>
                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4">Join Free</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className={`px-4 py-2 text-sm font-medium transition-colors ${router.pathname === '/dashboard' ? 'text-brand-300' : 'text-slate-400 hover:text-slate-200'}`}>Dashboard</Link>
                <Link href="/tasks" className={`px-4 py-2 text-sm font-medium transition-colors ${router.pathname.startsWith('/tasks') ? 'text-brand-300' : 'text-slate-400 hover:text-slate-200'}`}>Tasks</Link>
                <Link href="/leaderboard" className={`px-4 py-2 text-sm font-medium transition-colors ${router.pathname === '/leaderboard' ? 'text-brand-300' : 'text-slate-400 hover:text-slate-200'}`}>Leaderboard</Link>

                {/* Credits badge */}
                {profile && (
                  <div className="flex items-center gap-1.5 bg-surface-3 border border-surface-border rounded-lg px-3 py-1.5 mx-2">
                    <span className="text-base">🪙</span>
                    <span className="text-brand-300 font-bold text-sm">{profile.credits}</span>
                    <span className="text-slate-500 text-xs">credits</span>
                  </div>
                )}

                {/* Avatar menu */}
                <div className="relative">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-blue-600 flex items-center justify-center font-bold text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-400">
                    {profile?.name?.[0]?.toUpperCase() ?? 'U'}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-52 card shadow-xl animate-fade-in py-1">
                      <div className="px-4 py-3 border-b border-surface-border">
                        <p className="text-sm font-semibold text-slate-200">{profile?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{profile?.email}</p>
                        <p className="text-xs text-brand-400 mt-1">≈ ₹{creditsToRupees(profile?.credits ?? 0)} estimated</p>
                      </div>
                      <Link href="/profile" className="block px-4 py-2 text-sm text-slate-300 hover:bg-surface-2 transition-colors" onClick={() => setMenuOpen(false)}>Profile</Link>
                      <Link href="/wallet" className="block px-4 py-2 text-sm text-slate-300 hover:bg-surface-2 transition-colors" onClick={() => setMenuOpen(false)}>Wallet & Earnings</Link>
                      <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-surface-2 transition-colors">Sign Out</button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden text-slate-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-surface-border py-4 space-y-1 animate-fade-in">
            {!user ? (
              <>
                <Link href="/tasks" className="block px-4 py-2 text-slate-300 hover:text-white">Tasks</Link>
                <Link href="/leaderboard" className="block px-4 py-2 text-slate-300 hover:text-white">Leaderboard</Link>
                <Link href="/auth/login" className="block px-4 py-2 text-slate-300 hover:text-white">Login</Link>
                <Link href="/auth/register" className="block px-4 py-2 text-brand-300 font-semibold">Join Free →</Link>
              </>
            ) : (
              <>
                <Link href="/dashboard" className="block px-4 py-2 text-slate-300 hover:text-white">Dashboard</Link>
                <Link href="/tasks" className="block px-4 py-2 text-slate-300 hover:text-white">Tasks</Link>
                <Link href="/leaderboard" className="block px-4 py-2 text-slate-300 hover:text-white">Leaderboard</Link>
                <Link href="/wallet" className="block px-4 py-2 text-slate-300 hover:text-white">Wallet</Link>
                <button onClick={handleSignOut} className="block px-4 py-2 text-red-400">Sign Out</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
