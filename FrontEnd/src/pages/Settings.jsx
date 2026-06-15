import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiTrash2 } from 'react-icons/fi'
import axios from 'axios'
import toast from 'react-hot-toast'
import { SunIcon, MoonIcon } from '../Components/Icons'
import { useTheme } from '../Context/ThemeContext'
import { ServerUrl } from '../App'

function Settings() {
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDeleteAccount = async () => {
    setDeleting(true)
    try {
      await axios.delete(ServerUrl + "/api/user/delete-account", { withCredentials: true })
      toast.success("Account deleted successfully")
      navigate("/login")
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account")
      setDeleting(false)
      setShowConfirm(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f5] dark:bg-gray-950 transition-colors duration-300'>
      <div className='max-w-xl mx-auto px-4 sm:px-6 py-8 lg:py-12'>
        <div className='bg-white dark:bg-gray-900 rounded-[32px] shadow-xl p-8 transition-colors duration-300'>
          <h1 className='text-2xl font-black text-black dark:text-white'>
            Settings
          </h1>
          <p className='text-sm text-gray-400 mt-1'>
            Customize your app experience
          </p>

          <div className='mt-8 space-y-6'>
            <div className='flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors duration-300'>
              <div className='flex items-center gap-3'>
                {theme === 'dark' ? (
                  <MoonIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                ) : (
                  <SunIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                )}
                <div>
                  <p className='text-sm font-semibold text-black dark:text-white'>
                    Dark Mode
                  </p>
                  <p className='text-xs text-gray-400 mt-0.5'>
                    {theme === 'dark' ? 'Dark theme is active' : 'Light theme is active'}
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTheme}
                className={`relative w-14 h-7 rounded-full transition-colors duration-300 cursor-pointer flex-shrink-0 ${
                  theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 flex items-center justify-center ${
                    theme === 'dark' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                >
                  {theme === 'dark' ? (
                    <MoonIcon className="w-3 h-3 text-gray-700" />
                  ) : (
                    <SunIcon className="w-3 h-3 text-amber-500" />
                  )}
                </span>
              </button>
            </div>
          </div>

          <div className='mt-10 pt-8 border-t border-gray-200 dark:border-gray-800'>
            <div className='flex items-center justify-between p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center flex-shrink-0'>
                  <FiTrash2 size={15} className='text-red-500' />
                </div>
                <div>
                  <p className='text-sm font-semibold text-red-600 dark:text-red-400'>
                    Delete Account
                  </p>
                  <p className='text-xs text-red-500/70 dark:text-red-400/70 mt-0.5'>
                    Permanently delete your account and all data
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                className='px-4 py-2 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-semibold transition-all duration-200 cursor-pointer flex-shrink-0'
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className='fixed inset-0 z-50 flex items-center justify-center px-4'>
          <div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={() => !deleting && setShowConfirm(false)} />
          <div className='relative bg-white dark:bg-gray-900 rounded-[28px] shadow-2xl p-8 max-w-sm w-full animate-pop-in'>
            <div className='text-center'>
              <div className='w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/50 flex items-center justify-center mx-auto'>
                <FiTrash2 size={20} className='text-red-500' />
              </div>
              <h2 className='text-lg font-bold text-black dark:text-white mt-4'>
                Delete Account?
              </h2>
              <p className='text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed'>
                This action is permanent. All your assistant settings, pages, and data will be deleted.
              </p>
              <div className='flex gap-3 mt-6'>
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={deleting}
                  className='flex-1 px-5 py-2.5 rounded-full border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer disabled:opacity-50'
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className='flex-1 px-5 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2'
                >
                  {deleting ? (
                    <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                    </svg>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
