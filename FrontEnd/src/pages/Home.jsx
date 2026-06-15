import { useNavigate } from 'react-router-dom'
import { KeyIcon, PaletteIcon, BrainIcon, RocketIcon, FlameIcon, SparkleIcon, DiamondIcon, LightningIcon, RobotIcon, ArrowRightIcon } from '../Components/Icons'

const STEPS = [
  {
    icon: <KeyIcon className="w-8 h-8 text-black" />,
    title: "Sign up free",
    desc: "Continue with Google and create your assistant instantly.",
  },
  {
    icon: <PaletteIcon className="w-8 h-8 text-black" />,
    title: "Customize",
    desc: "Set your business name, tone, voice, and theme.",
  },
  {
    icon: <BrainIcon className="w-8 h-8 text-black" />,
    title: "Train",
    desc: "Add business details and personalize responses.",
  },
  {
    icon: <RocketIcon className="w-8 h-8 text-black" />,
    title: "Embed anywhere",
    desc: "Copy one script tag and add it to your website.",
  },
];

function Home() {
  const navigate = useNavigate()
  return (
    <div className='min-h-screen bg-[#f5f5f5] dark:bg-gray-950 transition-colors duration-300'>

      {/* ─── Hero ─── */}
      <section className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-4xl bg-white dark:bg-gray-900 rounded-[32px] shadow-xl dark:shadow-2xl p-10 sm:p-16 relative overflow-hidden transition-colors duration-300">

          <FlameIcon className="absolute top-8 left-10 w-7 h-7 animate-float text-black dark:text-white" />
          <SparkleIcon className="absolute top-8 right-12 w-6 h-6 animate-float-delayed text-black dark:text-white" />
          <DiamondIcon className="absolute bottom-12 left-14 w-6 h-6 animate-float-slow text-black dark:text-white" />
          <LightningIcon className="absolute bottom-24 right-10 w-5 h-5 animate-float text-black dark:text-white" />

          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-[56px] sm:text-[72px] lg:text-[88px] font-black tracking-[-0.04em] leading-[0.9] text-black dark:text-white">
              BUILD<br />KIND
            </h1>

            <p className="mt-5 text-gray-500 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
              Creating a magical AI assistant for every website. No fuss, just magic.
            </p>

            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => navigate("/login")}
                className="bg-black text-white px-8 py-3.5 rounded-full text-sm font-medium hover:scale-105 transition-transform duration-300"
              >
                Get Started <SparkleIcon className="inline w-4 h-4 -mt-0.5" />
              </button>
              <button
                onClick={() => navigate("/builder")}
                className="border-2 border-black dark:border-white text-black dark:text-white px-8 py-3.5 rounded-full text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
              >
                Builder <ArrowRightIcon className="inline w-4 h-4 -mt-0.5" />
              </button>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md h-48 bg-gray-100 dark:bg-gray-800 rounded-[28px] flex items-center justify-center border border-gray-200 dark:border-gray-700 transition-colors duration-300">
              <RobotIcon className="w-16 h-16 animate-float text-gray-400" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className='px-4 sm:px-6 lg:px-8 py-24'>
        <div className='max-w-4xl mx-auto'>
          <div className='text-center mb-14 max-w-lg mx-auto'>
            <p className='text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase'>Workflow</p>
            <h2 className='mt-4 text-4xl sm:text-5xl font-black tracking-[-0.03em] text-black dark:text-white leading-[1.1]'>
              Get started<br />in minutes
            </h2>
            <p className='text-gray-400 mt-3 text-sm'>
              Simple setup. No complicated integration.
            </p>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {STEPS.map((s, i) => (
              <div
                key={i}
                className='bg-white dark:bg-gray-900 rounded-[28px] border border-gray-200 dark:border-gray-800 p-7 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:rotate-[0.5deg]'
              >
                {i === 0 && <KeyIcon className="w-8 h-8 text-black dark:text-white" />}
                {i === 1 && <PaletteIcon className="w-8 h-8 text-black dark:text-white" />}
                {i === 2 && <BrainIcon className="w-8 h-8 text-black dark:text-white" />}
                {i === 3 && <RocketIcon className="w-8 h-8 text-black dark:text-white" />}
                <h3 className='mt-4 text-lg font-bold text-black dark:text-white'>
                  {s.title}
                </h3>
                <p className='mt-2 text-sm text-gray-400 leading-relaxed'>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className='border-t border-gray-200 dark:border-gray-800 px-6 py-10 transition-colors duration-300'>
        <div className='max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left'>
          <div>
            <span className='font-black text-lg text-black dark:text-white'>tlux</span>
            <span className='text-[10px] font-bold text-gray-400 ml-0.5'>AI</span>
            <p className="text-gray-400 text-xs mt-1">Voice AI assistant for websites</p>
          </div>
          <p className='text-gray-400 text-xs'>
            &copy; {new Date().getFullYear()} Tlux AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
