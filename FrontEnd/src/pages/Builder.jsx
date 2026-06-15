import axios from 'axios';
import { useState } from 'react'
import { FiCopy, FiPlus, FiTrash2, FiCheck, FiKey, FiSave, FiEdit3, FiExternalLink, FiMonitor, FiMessageSquare, FiGlobe, FiSliders } from 'react-icons/fi';
import { CLIENT_URL, ServerUrl } from '../App';
import toast from 'react-hot-toast';
import { SparkleIcon, SunIcon, MoonIcon, WindowIcon, LightbulbIcon, SmileIcon, BriefcaseIcon, ChartIcon, ClipboardIcon, PaletteIcon, DocumentIcon, CheckIcon } from '../Components/Icons';

const THEMES = [
  { key: "light", label: "Light", icon: <SunIcon className="w-6 h-6" /> },
  { key: "dark", label: "Dark", icon: <MoonIcon className="w-6 h-6" /> },
  { key: "glass", label: "Glass", icon: <WindowIcon className="w-6 h-6" /> },
  { key: "neon", label: "Neon", icon: <LightbulbIcon className="w-6 h-6" /> },
];

const TONES = [
  { key: "friendly", label: "Friendly", icon: <SmileIcon className="w-6 h-6" /> },
  { key: "professional", label: "Professional", icon: <BriefcaseIcon className="w-6 h-6" /> },
  { key: "sales", label: "Sales", icon: <ChartIcon className="w-6 h-6" /> },
];

const VOICES = [
  { key: "male", label: "Male", icon: <SmileIcon className="w-6 h-6" /> },
  { key: "female", label: "Female", icon: <SmileIcon className="w-6 h-6" /> },
];

const SIDEBAR_ITEMS = [
  { id: "info", label: "Info", icon: <ClipboardIcon className="w-4 h-4" /> },
  { id: "appearance", label: "Appearance", icon: <PaletteIcon className="w-4 h-4" /> },
  { id: "api", label: "API Key", icon: <FiKey size={16} /> },
  { id: "pages", label: "Pages", icon: <DocumentIcon className="w-4 h-4" /> },
];

function Builder({user, setUser}) {
  const [editAssistant, setEditAssistant] = useState(!user?.isSetupComplete)
  const [activeSection, setActiveSection] = useState("info")

  const [assistantName, setAssistantName] = useState(user?.assistantName || "");
  const [businessName, setBusinessName] = useState(user?.businessName || "")
  const [businessType, setBusinessType] = useState(user?.businessType || "")
  const [businessDescription, setBusinessDescription] = useState(user?.businessDescription || "")

  const [theme, setTheme] = useState(user?.theme || "dark")
  const [tone, setTone] = useState(user?.tone || "friendly")
  const [voice, setVoice] = useState(user?.voice || "male")

  const [geminiApiKey, setGeminiApiKey] = useState(user?.geminiApiKey || "")

  const [pages, setPages] = useState(user?.pages || []);
  const [pageName, setPageName] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [pageKeywords, setPageKeywords] = useState("");

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const addPage = () => {
    if(!pageName || !pagePath) return;
    const newPage = { name: pageName, path: pagePath, keywords: pageKeywords.split(",").map((k) => k.trim()) }
    setPages([...pages, newPage])
    setPageName("")
    setPagePath("")
    setPageKeywords("")
  }

  const removePage = (index) => {
    setPages(pages.filter((_, i) => i !== index))
  }

  const saveAssistant = async () => {
    setLoading(true)
    try {
      const data = { assistantName, businessName, businessType, businessDescription, tone, theme, voice, geminiApiKey, pages }
      const res = await axios.post(ServerUrl + "/api/user/save-assistant", data, {withCredentials:true})
      setUser(res.data.user)
      setEditAssistant(false)
      toast.success("Assistant Saved Successfully")
      setLoading(false)
    } catch (error) {
      toast.error("Failed to save assistant")
      setLoading(false)
    }
  }

  const embedCode = `<script src="${CLIENT_URL}/assistant.js" data-user-id="${user?._id}"></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const renderSection = () => {
    switch(activeSection) {
      case "info":
        return (
          <div className="space-y-5">
            <div>
              <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block'>Assistant Name</label>
              <input
                type="text"
                onChange={(e) => setAssistantName(e.target.value)}
                value={assistantName}
                placeholder="e.g. Support Bot"
                className='w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white'
              />
            </div>
            <div>
              <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block'>Business Name</label>
              <input
                type="text"
                onChange={(e) => setBusinessName(e.target.value)}
                value={businessName}
                placeholder="e.g. Acme Inc."
                className='w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white'
              />
            </div>
            <div>
              <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block'>Business Type</label>
              <input
                type="text"
                onChange={(e) => setBusinessType(e.target.value)}
                value={businessType}
                placeholder="e.g. SaaS, E-commerce"
                className='w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white'
              />
            </div>
            <div>
              <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block'>Business Description</label>
              <textarea
                onChange={(e) => setBusinessDescription(e.target.value)}
                value={businessDescription}
                rows={3}
                placeholder="Describe what your business does..."
                className='w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white resize-none'
              />
            </div>
          </div>
        )
      case "appearance":
        return (
          <div className="space-y-8">
            <div>
              <label className='text-xs font-medium text-gray-500 mb-3 block'>Theme</label>
              <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
                {THEMES.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTheme(item.key)}
                    className={`rounded-2xl border-2 p-4 transition-all duration-200 cursor-pointer text-center ${
                      theme === item.key
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span className='block'>{item.icon}</span>
                    <p className={`text-sm font-semibold mt-2 ${
                      theme === item.key ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-xs font-medium text-gray-500 mb-3 block'>Tone</label>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
                {TONES.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setTone(item.key)}
                    className={`rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer text-center ${
                      tone === item.key
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <span>{item.icon}</span>
                    <p className={`text-sm font-semibold mt-1 ${
                      tone === item.key ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className='text-xs font-medium text-gray-500 mb-3 block'>Voice</label>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                {VOICES.map((item) => (
                  <button
                    key={item.key}
                    onClick={() => setVoice(item.key)}
                    className={`rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer text-center ${
                      voice === item.key
                        ? "border-black dark:border-white bg-gray-50 dark:bg-gray-800"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800"
                    }`}
                  >
                    <p className={`text-sm font-semibold mt-1 ${
                      voice === item.key ? "text-black dark:text-white" : "text-gray-600 dark:text-gray-400"
                    }`}>
                      {item.label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      case "api":
        return (
          <div className="space-y-5">
            <div>
              <label className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block'>Gemini API Key</label>
              <input
                type="password"
                placeholder="AIza..."
                onChange={(e) => setGeminiApiKey(e.target.value)}
                value={geminiApiKey}
                className='w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200 bg-white font-mono tracking-wider'
              />
            </div>
            <a
              href="https://aistudio.google.com/app/apikey"
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors duration-200'
            >
              <FiExternalLink size={14} />
              Get a free API key
            </a>
            <p className='text-xs text-gray-400 leading-relaxed'>
              Your API key is securely stored and only used for generating AI responses.
            </p>
          </div>
        )
      case "pages":
        return (
          <div className="space-y-5">
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-3'>
              <input
                type="text"
                placeholder="Page name"
                onChange={(e) => setPageName(e.target.value)}
                value={pageName}
                className='w-full border border-gray-200 dark:border-gray-700 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-black dark:focus:border-white focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 bg-white dark:bg-gray-800 text-black dark:text-white'
              />
              <input
                type="text"
                placeholder="/pricing"
                onChange={(e) => setPagePath(e.target.value)}
                value={pagePath}
                className='w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200 bg-white font-mono'
              />
              <div className='flex gap-2'>
                <input
                  type="text"
                  placeholder="Keywords"
                  onChange={(e) => setPageKeywords(e.target.value)}
                  value={pageKeywords}
                  className='w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none transition-all duration-200 placeholder:text-gray-300 focus:border-black focus:ring-2 focus:ring-gray-200 bg-white flex-1 min-w-0'
                />
                <button
                  onClick={addPage}
                  disabled={!pageName || !pagePath}
                  className='px-4 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-sm font-medium hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer flex items-center gap-1.5 flex-shrink-0'
                >
                  <FiPlus size={16} />
                </button>
              </div>
            </div>

            {pages.length > 0 && (
              <div>
                <p className='text-xs font-medium text-gray-500 dark:text-gray-400 mb-3'>
                  Added Pages ({pages.length})
                </p>
                <div className='space-y-2'>
                  {pages.map((page, index) => (
                    <div
                      key={index}
                      className='group flex items-center justify-between rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3.5 hover:shadow-md transition-all duration-200'
                    >
                      <div className='flex items-center gap-3 min-w-0'>
                        <span className='w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0'>
                          {index + 1}
                        </span>
                        <div className='min-w-0'>
                          <p className='font-medium text-gray-900 dark:text-white text-sm truncate'>{page.name}</p>
                          <p className='text-xs text-gray-400 font-mono truncate mt-0.5'>{page.path}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removePage(index)}
                        className='p-2 rounded-full text-gray-300 dark:text-gray-600 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer flex-shrink-0'
                        title="Remove page"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f5] dark:bg-gray-950 transition-colors duration-300'>
      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12'>

        {/* ─── Header ─── */}
        <div className='mb-8 text-center'>
          <h1 className='text-4xl sm:text-5xl font-black tracking-[-0.03em] text-black dark:text-white leading-[1.1]'>
            Assistant Builder
          </h1>
          <p className='mt-2 text-gray-400 text-sm'>
            Customize your AI voice assistant <SparkleIcon className="inline w-4 h-4 -mt-0.5" />
          </p>
        </div>

        {/* ─── Deployed State ─── */}
        {user?.isSetupComplete && !editAssistant && (
          <div className='max-w-xl mx-auto animate-pop-in space-y-6'>
            <div className='bg-white dark:bg-gray-900 rounded-[32px] shadow-xl p-8 text-center transition-colors duration-300'>
              <CheckIcon className="w-10 h-10 mx-auto text-black dark:text-white" />
              <h2 className='text-2xl font-bold text-black dark:text-white mt-3'>{user.assistantName}</h2>
              <p className='text-sm text-gray-400 mt-2'>Your assistant is deployed and ready to use on your website.</p>

              <div className='grid grid-cols-4 gap-3 mt-6'>
                <div className='rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3'>
                  <p className='text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase'>Theme</p>
                  <p className='text-sm font-bold mt-1 capitalize text-black dark:text-white'>{user?.theme || "dark"}</p>
                </div>
                <div className='rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3'>
                  <p className='text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase'>Tone</p>
                  <p className='text-sm font-bold mt-1 capitalize text-black dark:text-white'>{user?.tone || "friendly"}</p>
                </div>
                <div className='rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3'>
                  <p className='text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase'>Voice</p>
                  <p className='text-sm font-bold mt-1 capitalize text-black dark:text-white'>{user?.voice || "male"}</p>
                </div>
                <div className='rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3'>
                  <p className='text-[10px] font-medium text-gray-500 dark:text-gray-400 uppercase'>Gemini</p>
                  <p className={`text-sm font-bold mt-1 capitalize ${
                    user?.geminiStatus === "active" ? "text-black dark:text-white" :
                    user?.geminiStatus === "invalid" ? "text-red-500" : "text-gray-500"
                  }`}>
                    {user?.geminiStatus}
                  </p>
                </div>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-900 rounded-[32px] shadow-xl p-8 transition-colors duration-300'>
              <h3 className='text-sm font-bold text-black dark:text-white flex items-center gap-2'>
                <FiMessageSquare size={16} />
                Deploy to your website
              </h3>
              <p className='text-xs text-gray-400 mt-1 mb-4'>
                Paste this script before the <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-[11px]">{'</body>'}</code> tag.
              </p>

              <div className='relative rounded-2xl bg-gray-900 border border-gray-700 overflow-hidden'>
                <div className='flex items-center gap-1.5 px-4 py-2 bg-gray-800 border-b border-gray-700'>
                  <span className='w-2.5 h-2.5 rounded-full bg-red-400/70' />
                  <span className='w-2.5 h-2.5 rounded-full bg-yellow-400/70' />
                  <span className='w-2.5 h-2.5 rounded-full bg-emerald-400/70' />
                  <span className='text-gray-400 text-[11px] ml-2 font-mono'>embed.html</span>
                </div>
                <textarea
                  readOnly
                  value={embedCode}
                  className='w-full h-[72px] bg-transparent text-gray-300 px-4 py-3 text-sm font-mono resize-none outline-none'
                  spellCheck={false}
                />
                <button
                  onClick={copyToClipboard}
                  className='absolute top-10 right-3 w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/20 transition-all duration-200 cursor-pointer'
                  title="Copy code"
                >
                  {copied ? <FiCheck className='text-white' size={15} /> : <FiCopy size={15} />}
                </button>
              </div>

              <button
                onClick={() => setEditAssistant(true)}
                className='mt-5 w-full bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-transform duration-300 flex items-center justify-center gap-2'
              >
                <FiEdit3 size={16} />
                Edit Assistant
              </button>
            </div>
          </div>
        )}

        {/* ─── Edit Mode ─── */}
        {editAssistant && (
          <div className='flex gap-6 flex-col lg:flex-row animate-fade-in-up'>

            {/* ─── Sidebar ─── */}
            <div className='lg:w-56 flex-shrink-0'>
              <div className='bg-white dark:bg-gray-900 rounded-[28px] shadow-xl p-4 transition-colors duration-300'>
                <nav className='space-y-1'>
                  {SIDEBAR_ITEMS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                        activeSection === item.id
                          ? "bg-black dark:bg-white text-white dark:text-black"
                          : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <span className='hidden sm:inline'>{item.icon}</span>
                      <span className='sm:hidden'>{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>

                <div className='mt-4 pt-4 border-t border-gray-100 dark:border-gray-800'>
                  <button
                    onClick={saveAssistant}
                    disabled={loading || !assistantName || !businessName || !businessType || !businessDescription || !geminiApiKey}
                    className='w-full bg-black dark:bg-white text-white dark:text-black px-5 py-3 rounded-full text-sm font-medium hover:scale-[1.02] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2'
                  >
                    {loading ? (
                      <svg className='animate-spin h-4 w-4' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
                        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                      </svg>
                    ) : (
                      <FiSave size={16} />
                    )}
                    {loading ? "Saving..." : user.isSetupComplete ? "Update" : "Deploy"}
                  </button>
                </div>
              </div>
            </div>

            {/* ─── Main Content ─── */}
            <div className='flex-1 min-w-0'>
              <div className='bg-white dark:bg-gray-900 rounded-[32px] shadow-xl p-8 transition-colors duration-300'>
                <div className='mb-6 pb-4 border-b border-gray-100 dark:border-gray-800'>
                  <h2 className='text-xl font-bold text-black dark:text-white flex items-center gap-2'>
                    {SIDEBAR_ITEMS.find(i => i.id === activeSection)?.icon}
                    {SIDEBAR_ITEMS.find(i => i.id === activeSection)?.label}
                  </h2>
                </div>
                {renderSection()}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  )
}

export default Builder
