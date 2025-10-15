import { useState, useEffect } from 'react'
import Chatbot from './components/Chatbot'
import Header from './components/Header'
import StatsPanel from './components/StatsPanel'
import { Activity, Sparkles } from 'lucide-react'

function App() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    fetchStats()
    // Check for saved dark mode preference
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedMode)
    if (savedMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/database/info')
      const data = await response.json()
      setStats(data.statistics)
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50'
    } relative overflow-hidden`}>
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float ${
          darkMode ? 'bg-blue-500' : 'bg-blue-300'
        }`}></div>
        <div className={`absolute top-40 right-10 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-2000 ${
          darkMode ? 'bg-cyan-500' : 'bg-cyan-300'
        }`}></div>
        <div className={`absolute -bottom-32 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float animation-delay-4000 ${
          darkMode ? 'bg-sky-500' : 'bg-sky-300'
        }`}></div>
      </div>

      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-1 space-y-6">
            <StatsPanel stats={stats} loading={loading} darkMode={darkMode} />
            
            {/* Info Card with Glassmorphism */}
            <div className={`${darkMode ? 'glass-dark' : 'glass'} rounded-2xl shadow-2xl p-6 border ${
              darkMode ? 'border-white/10' : 'border-white/20'
            } transform hover:scale-105 transition-all duration-300 hover:shadow-blue-500/20`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-75 animate-pulse"></div>
                  <div className={`relative ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-2`}>
                    <Activity className="w-5 h-5 text-blue-500" />
                  </div>
                </div>
                <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-2`}>
                  Como usar
                  <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                </h3>
              </div>
              <div className={`space-y-3 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                <p>
                  <strong className={darkMode ? 'text-cyan-400' : 'text-blue-600'}>Exemplos de perguntas:</strong>
                </p>
                <ul className="space-y-2 ml-2">
                  {[
                    'Quantos crimes ocorreram em 2024?',
                    'Qual cidade teve mais ocorrências?',
                    'Mostre as estatísticas por tipo de crime',
                    'Qual horário tem mais incidentes?',
                    'Compare crimes entre 2023 e 2024'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 group">
                      <span className="text-blue-500 group-hover:scale-125 transition-transform">▸</span>
                      <span className="group-hover:text-blue-500 transition-colors">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Chatbot */}
          <div className="lg:col-span-2">
            <Chatbot darkMode={darkMode} />
          </div>
        </div>
      </main>

      {/* Footer with glow effect */}
      <footer className="mt-12 py-8 text-center relative z-10">
        <div className={`inline-block px-8 py-4 rounded-2xl ${darkMode ? 'glass-dark' : 'glass'} shadow-xl`}>
          <p className={`font-semibold ${darkMode ? 'text-white glow-text' : 'text-slate-800'}`}>
            Crime Analytics RS
          </p>
          <p className={`text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Powered by <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent font-bold">GPT-4</span> & FastAPI
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App

