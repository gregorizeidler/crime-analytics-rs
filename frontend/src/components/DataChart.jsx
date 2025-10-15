import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react'

function DataChart({ data, darkMode }) {
  if (!data || data.length === 0) return null

  // Detectar tipo de dados e escolher gráfico apropriado
  const detectChartType = () => {
    if (data.length === 0) return null

    const keys = Object.keys(data[0])
    const hasNumericValue = keys.some(key => typeof data[0][key] === 'number')
    const firstKey = keys[0]
    const firstValue = data[0][firstKey]
    
    // Se tem data/ano/mes -> gráfico de linha (série temporal)
    const hasTimeField = keys.some(key => 
      key.toLowerCase().includes('ano') || 
      key.toLowerCase().includes('data') || 
      key.toLowerCase().includes('mes') ||
      key.toLowerCase().includes('year')
    )

    // Verificar se os valores são anos (números entre 1900 e 2100)
    const isYearData = typeof firstValue === 'number' && firstValue >= 1900 && firstValue <= 2100

    // Se é distribuição pequena (< 7 items) e NÃO é temporal -> gráfico de pizza
    if (data.length <= 6 && hasNumericValue && !hasTimeField && !isYearData) {
      return 'pie'
    }

    // Se tem campo temporal OU valores são anos -> gráfico de linha
    if ((hasTimeField || isYearData) && hasNumericValue) {
      return 'line'
    }

    // Default: gráfico de barras (para comparações, rankings, etc)
    return 'bar'
  }

  const chartType = detectChartType()

  // Preparar dados para gráficos
  const prepareData = () => {
    // Pegar as duas primeiras chaves (normalmente label e valor)
    const keys = Object.keys(data[0])
    const labelKey = keys[0]
    const valueKey = keys.find(k => typeof data[0][k] === 'number') || keys[1]

    return data.map(item => ({
      name: String(item[labelKey]),
      value: Number(item[valueKey]) || 0,
      fullData: item
    }))
  }

  const chartData = prepareData()

  // Cores para os gráficos
  const COLORS = [
    '#3b82f6', '#06b6d4', '#8b5cf6', '#ec4899', 
    '#f59e0b', '#10b981', '#ef4444', '#6366f1'
  ]

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${
          darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
        } border rounded-lg p-3 shadow-lg`}>
          <p className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {payload[0].payload.name}
          </p>
          <p className={`text-sm ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
            Valor: <span className="font-bold">{payload[0].value.toLocaleString('pt-BR')}</span>
          </p>
        </div>
      )
    }
    return null
  }

  const getChartIcon = () => {
    switch (chartType) {
      case 'line':
        return <TrendingUp className="w-4 h-4" />
      case 'pie':
        return <PieChartIcon className="w-4 h-4" />
      default:
        return <BarChart3 className="w-4 h-4" />
    }
  }

  const getChartTitle = () => {
    switch (chartType) {
      case 'line':
        return 'Evolução Temporal'
      case 'pie':
        return 'Distribuição'
      default:
        return 'Ranking / Comparação'
    }
  }

  return (
    <div className={`mt-4 p-4 rounded-xl border ${
      darkMode 
        ? 'bg-slate-800/50 border-slate-700' 
        : 'bg-white/80 border-slate-200'
    } backdrop-blur-sm`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500`}>
          {getChartIcon()}
        </div>
        <div>
          <h4 className={`font-semibold text-sm ${
            darkMode ? 'text-white' : 'text-slate-800'
          }`}>
            {getChartTitle()}
          </h4>
          <p className={`text-xs ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            {chartData.length} registro(s)
          </p>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={300}>
        {chartType === 'pie' ? (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
            <XAxis 
              dataKey="name" 
              stroke={darkMode ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={darkMode ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#06b6d4', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
            <XAxis 
              dataKey="name" 
              stroke={darkMode ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
              angle={chartData.length > 5 ? -45 : 0}
              textAnchor={chartData.length > 5 ? 'end' : 'middle'}
              height={chartData.length > 5 ? 80 : 30}
            />
            <YAxis 
              stroke={darkMode ? '#94a3b8' : '#64748b'}
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

export default DataChart

