import { Shield, Moon, Sun } from 'lucide-react'

function Header({ darkMode, toggleDarkMode }) {
  return (
    <header className={`${darkMode ? 'glass-dark' : 'glass'} shadow-2xl border-b ${
      darkMode ? 'border-white/10' : 'border-white/20'
    } sticky top-0 z-50 backdrop-blur-xl`}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Animated Shield Icon */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-gradient-xy"></div>
              <div className={`relative ${darkMode ? 'bg-slate-800' : 'bg-white'} p-3 rounded-xl transform group-hover:scale-110 transition-all duration-300`}>
                <Shield className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent animate-float" />
              </div>
            </div>
            
            <div>
              <h1 className={`text-3xl font-bold ${
                darkMode 
                  ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-sky-400' 
                  : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-sky-600'
              } bg-clip-text text-transparent hover:scale-105 transition-transform inline-block cursor-default`}>
                Crime Analytics RS
              </h1>
              <p className={`mt-1 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Análise Inteligente de Dados de Crimes do Rio Grande do Sul
              </p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`group relative p-3 rounded-xl ${
              darkMode 
                ? 'bg-slate-800 hover:bg-slate-700' 
                : 'bg-white hover:bg-slate-50'
            } shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 border ${
              darkMode ? 'border-white/10' : 'border-slate-200'
            }`}
            aria-label="Toggle dark mode"
          >
            <div className="relative w-6 h-6">
              <Sun className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-500 ${
                darkMode ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
              }`} />
              <Moon className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-500 ${
                darkMode ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
              }`} />
            </div>
            
            {/* Tooltip */}
            <span className={`absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 rounded text-xs whitespace-nowrap ${
              darkMode ? 'bg-slate-700 text-white' : 'bg-slate-800 text-white'
            } opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}>
              {darkMode ? 'Modo claro' : 'Modo escuro'}
            </span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header

