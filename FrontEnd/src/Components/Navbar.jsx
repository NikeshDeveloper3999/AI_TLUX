import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiLogOut, FiMenu, FiX, FiGrid, FiSettings } from "react-icons/fi";
import axios from 'axios';
import { ServerUrl } from '../App';
import toast from 'react-hot-toast';

function Navbar({user , setUser}) {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", {withCredentials:true})
      setUser(null)
      toast.success("Logout Successfully")
      navigate("/login")
    } catch (error) {
      toast.error("logout failed")
    }
  }

  return (
    <nav className='sticky top-0 z-50 bg-[#f5f5f5] dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300'>
      <div className='max-w-6xl mx-auto px-6 py-3 flex items-center justify-between'>
        <div
          onClick={() => navigate("/")}
          className='flex items-center gap-2 cursor-pointer select-none group'
        >
          <span className='text-lg font-black tracking-tight text-black dark:text-white'>tlux</span>
          <span className='text-[10px] font-bold text-gray-400 -ml-1'>AI</span>
        </div>

        {user && (
          <div className='hidden md:flex items-center gap-3'>
            <button
              onClick={() => navigate("/builder")}
              className='bg-black dark:bg-white text-white dark:text-black px-5 py-2 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-300'
            >
              <FiGrid size={14} className='inline mr-1.5' />
              Dashboard
            </button>

            <div className='flex items-center gap-2.5 pl-3 py-1.5 pr-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 transition-colors duration-300'>
              <div className='w-7 h-7 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center'>
                <span className='text-white text-xs font-bold'>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className='text-sm font-medium text-gray-800 dark:text-gray-200 max-w-[100px] truncate'>{user.name}</span>
              <button
                onClick={() => navigate("/settings")}
                className='p-1.5 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
                title="Settings"
              >
                <FiSettings size={13} />
              </button>
              <div className='w-px h-4 bg-gray-200 dark:bg-gray-700' />
              <button
                onClick={handleLogout}
                className='p-1.5 rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
                title="Logout"
              >
                <FiLogOut size={13} />
              </button>
            </div>
          </div>
        )}

        {user && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className='md:hidden p-2 rounded-full text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer'
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        )}
      </div>

      {menuOpen && (
        <div className='md:hidden px-6 pb-5 animate-fade-in-up'>
          <div className='bg-white dark:bg-gray-900 rounded-[28px] border border-gray-200 dark:border-gray-700 shadow-xl p-5 transition-colors duration-300'>
            <div className='flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800'>
              <div className='w-9 h-9 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center'>
                <span className='text-white text-sm font-bold'>
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className='text-sm font-semibold text-gray-900 dark:text-white'>{user.name}</p>
                <p className='text-xs text-gray-400'>{user.email}</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 mt-4'>
              <button
                className='bg-black dark:bg-white text-white dark:text-black px-5 py-2.5 rounded-full text-sm font-medium'
                onClick={() => {navigate("/builder"); setMenuOpen(false)}}
              >
                <FiGrid size={14} className='inline mr-1.5' />
                Dashboard
              </button>
              <button
                onClick={() => {navigate("/settings"); setMenuOpen(false)}}
                className='flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-sm'
              >
                <FiSettings size={14} /> Settings
              </button>
              <button
                onClick={() => {setMenuOpen(false); handleLogout()}}
                className='flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-sm'
              >
                <FiLogOut size={14} /> Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
