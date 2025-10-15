import { Database, MapPin, Calendar, TrendingUp } from 'lucide-react'

function StatsPanel({ stats, loading, darkMode }) {
  if (loading) {
    return (
      <div className={`${darkMode ? 'glass-dark' : 'glass'} rounded-2xl shadow-2xl p-6 border ${
        darkMode ? 'border-white/10' : 'border-white/20'
      }`}>
        <div className="animate-pulse space-y-4">
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded w-3/4`}></div>
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded w-1/2`}></div>
          <div className={`h-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} rounded w-2/3`}></div>
        </div>
      </div>
    )
  }

  if (!stats) {
    return null
  }

  const statItems = [
    {
      icon: Database,
      label: 'Total de Registros',
      value: stats.total_records?.toLocaleString('pt-BR') || 'N/A',
      gradient: 'from-blue-500 to-cyan-500',
      glowColor: 'group-hover:shadow-blue-500/50'
    },
    {
      icon: MapPin,
      label: 'Municípios',
      value: stats.total_municipalities?.toLocaleString('pt-BR') || 'N/A',
      gradient: 'from-green-500 to-emerald-500',
      glowColor: 'group-hover:shadow-green-500/50'
    },
    {
      icon: Calendar,
      label: 'Período',
      value: `${stats.earliest_year} - ${stats.latest_year}`,
      gradient: 'from-orange-500 to-red-500',
      glowColor: 'group-hover:shadow-orange-500/50'
    }
  ]

  return (
    <div className={`${darkMode ? 'glass-dark' : 'glass'} rounded-2xl shadow-2xl p-6 border ${
      darkMode ? 'border-white/10' : 'border-white/20'
    } hover:shadow-blue-500/20 transition-all duration-300`}>
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-2`}>
          <TrendingUp className="w-5 h-5 text-blue-500 animate-pulse" />
          Estatísticas
        </h2>
        <div className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold animate-pulse">
          Ao Vivo
        </div>
      </div>
      
      <div className="space-y-3">
        {statItems.map((item, index) => (
          <div 
            key={index}
            className={`group relative overflow-hidden rounded-xl p-4 ${
              darkMode ? 'bg-slate-800/50' : 'bg-white/50'
            } backdrop-blur-sm border ${
              darkMode ? 'border-white/10' : 'border-white/20'
            } hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer ${item.glowColor} shadow-lg`}
          >
            {/* Animated background gradient */}
            <div className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>
            
            <div className="relative flex items-center gap-3">
              {/* Icon with glow effect */}
              <div className="relative">
                <div className={`absolute -inset-2 bg-gradient-to-r ${item.gradient} rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300`}></div>
                <div className={`relative ${darkMode ? 'bg-slate-700' : 'bg-white'} p-2 rounded-lg`}>
                  <item.icon className={`w-5 h-5 bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`} />
                </div>
              </div>
              
              <div className="flex-1">
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-600'} group-hover:text-blue-500 transition-colors`}>
                  {item.label}
                </p>
                <p className={`text-xl font-bold bg-gradient-to-r ${item.gradient} bg-clip-text text-transparent`}>
                  {item.value}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsPanel

