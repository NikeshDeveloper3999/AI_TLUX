import { Navigate } from 'react-router-dom'

function ProtectedRoute({user, loading, children}) {
  if(loading){
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-orange-50 dark:bg-gray-950 transition-colors duration-300'>
        <div className='relative'>
          <div className='w-10 h-10 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin' />
          <div className='absolute inset-0 w-10 h-10 border-2 border-rose-500/20 border-b-rose-500 rounded-full animate-spin' style={{animationDirection: 'reverse', animationDuration: '0.8s'}} />
        </div>
        <p className='mt-5 text-sm text-amber-700/60 font-medium animate-pulse-soft'>Loading your workspace...</p>
      </div>
    )
  }

  if(!user) return <Navigate to="/login" replace/>

  return children;
}

export default ProtectedRoute