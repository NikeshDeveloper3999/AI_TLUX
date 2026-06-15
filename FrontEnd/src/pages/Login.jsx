import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from "axios"
import { ServerUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SparkleIcon, LockIcon, HandshakeIcon } from '../Components/Icons';

function Login({setUser}) {
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const {displayName, email} = result.user
      const res = await axios.post(ServerUrl + "/api/auth/google", { name: displayName, email }, {withCredentials:true})
      setUser(res.data)
      toast.success("Login Successfully")
      navigate("/builder")
    } catch (error) {
      toast.error("Login Failed...")
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f5] dark:bg-gray-950 flex items-center justify-center px-4 py-12 transition-colors duration-300'>
      <div className='w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] shadow-xl p-10 relative overflow-hidden transition-colors duration-300'>

        <SparkleIcon className='absolute top-6 right-8 w-6 h-6 animate-float text-black dark:text-white' />
        <LockIcon className='absolute bottom-8 left-8 w-5 h-5 animate-float-delayed text-black dark:text-white' />

        <div className='text-center'>
          <h1 className='text-4xl sm:text-5xl font-black tracking-[-0.03em] text-black dark:text-white leading-[1.1]'>
            Welcome<br />back
          </h1>
          <p className='mt-3 text-gray-400 text-sm'>
            Sign in to continue to your dashboard
          </p>
        </div>

        <button
          onClick={handleLogin}
          className='mt-8 w-full bg-black text-white px-6 py-3.5 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-3'
        >
          <FcGoogle className='text-lg bg-white rounded-full p-0.5' />
          Sign in with Google
        </button>

        <p className='mt-6 text-center text-xs text-gray-400'>
          By signing in, you agree to our terms.
        </p>

        <div className='mt-8 pt-6 border-t border-gray-100 dark:border-gray-800 text-center'>
          <HandshakeIcon className="w-7 h-7 mx-auto text-gray-400" />
          <p className='text-xs text-gray-400 mt-2'>We use Google for secure authentication</p>
        </div>
      </div>
    </div>
  )
}

export default Login
