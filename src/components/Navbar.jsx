import { useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Sparkles, LogOut, User } from 'lucide-react'
import { AuthContext } from '../context/authContextObject'

const Navbar = () => {
    const location = useLocation()
    const { user, logout } = useContext(AuthContext)

    const userInfo = user || JSON.parse(
        localStorage.getItem('user') || localStorage.getItem('userInfo') || 'null'
    )

    const logoutHandler = () => {
        if (logout) logout()
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        localStorage.removeItem('user')
        window.location.href = '/login'
    }


    const isActive = (path) => location.pathname === path

    return (
        <header className='sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center'>
                <Link to='/' className='flex items-center gap-2.5'>
                    <div className='w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-500 flex items-center justify-center text-black font-extrabold text-lg shadow-lg shadow-cyan-500/20'>
                        <Sparkles className='w-5 h-5 text-black' />
                    </div>
                    <span className='text-xl sm:text-2xl font-black tracking-tight text-white'>
                        Resume<span className='text-cyan-400'>AI</span>
                    </span>
                </Link>

                <nav className='flex items-center gap-6 text-sm font-semibold text-slate-300'>
                    <Link
                        to='/'
                        className={`transition ${isActive('/') ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400 text-slate-300'}`}
                    >
                        Home
                    </Link>

                    <Link
                        to='/analyzer'
                        className={`transition ${isActive('/analyzer') ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400 text-slate-300'}`}
                    >
                        Analyzer
                    </Link>

                    <Link
                        to='/dashboard'
                        className={`transition ${isActive('/dashboard') ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400 text-slate-300'}`}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to='/about'
                        className={`transition hidden md:inline ${isActive('/about') ? 'text-cyan-400 font-bold' : 'hover:text-cyan-400 text-slate-300'}`}
                    >
                        About
                    </Link>

                    {userInfo ? (
                        <div className='flex items-center gap-3'>
                            <span className='text-xs text-slate-400 hidden sm:inline flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl'>
                                <User className='w-3 h-3 text-cyan-400' />
                                <span>{userInfo.name || userInfo.email?.split('@')[0]}</span>
                            </span>
                            <button
                                onClick={logoutHandler}
                                className='flex items-center gap-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition'
                            >
                                <LogOut className='w-3.5 h-3.5' />
                                <span>Logout</span>
                            </button>
                        </div>
                    ) : (
                        <div className='flex items-center gap-3'>
                            <Link
                                to='/login'
                                className='text-xs hover:text-cyan-400 transition font-medium'
                            >
                                Login
                            </Link>

                            <Link
                                to='/register'
                                className='bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-black px-4 py-1.5 rounded-xl text-xs font-bold transition shadow-md shadow-cyan-500/20'
                            >
                                Get Started
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}

export default Navbar