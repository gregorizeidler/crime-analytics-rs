import { useState, useEffect } from 'react'
import { User, Bot, Database, CheckCircle2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import DataChart from './DataChart'

function Message({ message, darkMode }) {
  const isUser = message.role === 'user'
  const isError = message.isError
  const [displayedContent, setDisplayedContent] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [expandedQueries, setExpandedQueries] = useState({})
  const [copiedQuery, setCopiedQuery] = useState(null)

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Typing effect for assistant messages
  useEffect(() => {
    if (!isUser && !isError && message.content) {
      setIsTyping(true)
      setDisplayedContent('')
      
      let currentIndex = 0
      const typingSpeed = 15 // milliseconds per character
      
      const timer = setInterval(() => {
        if (currentIndex < message.content.length) {
          setDisplayedContent(message.content.slice(0, currentIndex + 1))
          currentIndex++
        } else {
          setIsTyping(false)
          clearInterval(timer)
        }
      }, typingSpeed)
      
      return () => clearInterval(timer)
    } else {
      setDisplayedContent(message.content)
    }
  }, [message.content, isUser, isError])

  const toggleQuery = (index) => {
    setExpandedQueries(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const copyQuery = async (query, index) => {
    try {
      await navigator.clipboard.writeText(query)
      setCopiedQuery(index)
      setTimeout(() => setCopiedQuery(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Detectar se há dados para gráfico
  const hasChartData = (functionCalls) => {
    if (!functionCalls || functionCalls.length === 0) return false
    
    for (const call of functionCalls) {
      if (call.result && call.result.data && Array.isArray(call.result.data)) {
        const data = call.result.data
        // Precisa ter pelo menos 2 registros e cada registro deve ter pelo menos 2 campos
        if (data.length >= 2 && data.length <= 50) {
          const firstItem = data[0]
          const keys = Object.keys(firstItem)
          const hasNumericValue = keys.some(key => typeof firstItem[key] === 'number')
          if (keys.length >= 2 && hasNumericValue) {
            return true
          }
        }
      }
    }
    return false
  }

  // Pegar dados para o gráfico
  const getChartData = (functionCalls) => {
    if (!functionCalls) return null
    
    for (const call of functionCalls) {
      if (call.result && call.result.data && Array.isArray(call.result.data)) {
        const data = call.result.data
        if (data.length >= 2 && data.length <= 50) {
          const firstItem = data[0]
          const keys = Object.keys(firstItem)
          const hasNumericValue = keys.some(key => typeof firstItem[key] === 'number')
          if (keys.length >= 2 && hasNumericValue) {
            return data
          }
        }
      }
    }
    return null
  }

  return (
    <div className={`flex gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
      isUser ? 'flex-row-reverse' : 'flex-row'
    }`}>
      {/* Avatar with glow effect */}
      <div className={`flex-shrink-0 relative group`}>
        <div className={`absolute -inset-1 rounded-full blur opacity-75 transition-opacity group-hover:opacity-100 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
            : isError
            ? 'bg-gradient-to-r from-red-600 to-orange-600'
            : 'bg-gradient-to-r from-blue-600 to-cyan-600 animate-pulse'
        }`}></div>
        <div
          className={`relative w-10 h-10 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-gradient-to-br from-blue-500 to-cyan-500'
              : isError
              ? 'bg-gradient-to-br from-red-500 to-orange-500'
              : 'bg-gradient-to-br from-blue-500 to-cyan-500'
          } shadow-lg`}
        >
          {isUser ? (
            <User className="w-5 h-5 text-white" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>

      {/* Message Content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`group relative rounded-2xl px-4 py-3 shadow-lg hover:shadow-xl transition-all duration-300 ${
            isUser
              ? `bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-br-sm`
              : isError
              ? `${darkMode ? 'bg-red-900/50 border border-red-500/50' : 'bg-red-50 border border-red-200'} ${darkMode ? 'text-red-200' : 'text-red-800'} rounded-bl-sm`
              : `${darkMode ? 'glass-dark' : 'glass'} ${darkMode ? 'text-slate-100' : 'text-slate-800'} rounded-bl-sm border ${darkMode ? 'border-white/10' : 'border-white/20'}`
          }`}
        >
          {/* Message text with typing effect and markdown rendering */}
          <div className="prose prose-sm max-w-none break-words leading-relaxed">
            {!isUser ? (
              <>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // Custom styling for markdown elements
                    h1: ({node, ...props}) => <h1 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-800'}`} {...props} />,
                    h2: ({node, ...props}) => <h2 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-800'}`} {...props} />,
                    h3: ({node, ...props}) => <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`} {...props} />,
                    p: ({node, ...props}) => <p className={`mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} {...props} />,
                    ul: ({node, ...props}) => <ul className={`list-disc list-inside mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} {...props} />,
                    ol: ({node, ...props}) => <ol className={`list-decimal list-inside mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} {...props} />,
                    li: ({node, ...props}) => <li className={`mb-1 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`} {...props} />,
                    strong: ({node, ...props}) => <strong className={`font-bold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`} {...props} />,
                    em: ({node, ...props}) => <em className={`italic ${darkMode ? 'text-slate-300' : 'text-slate-600'}`} {...props} />,
                    code: ({node, inline, ...props}) => 
                      inline ? (
                        <code className={`px-1.5 py-0.5 rounded ${darkMode ? 'bg-slate-700 text-cyan-300' : 'bg-slate-100 text-blue-600'} font-mono text-xs`} {...props} />
                      ) : (
                        <code className={`block p-3 rounded-lg ${darkMode ? 'bg-slate-800 text-cyan-300' : 'bg-slate-100 text-blue-700'} font-mono text-xs overflow-x-auto`} {...props} />
                      ),
                    blockquote: ({node, ...props}) => (
                      <blockquote className={`border-l-4 pl-4 py-2 my-2 ${darkMode ? 'border-cyan-500 bg-slate-800/50 text-slate-300' : 'border-blue-500 bg-blue-50 text-slate-700'} italic`} {...props} />
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto my-3">
                        <table className={`min-w-full divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`} {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className={darkMode ? 'bg-slate-800' : 'bg-slate-50'} {...props} />,
                    tbody: ({node, ...props}) => <tbody className={`divide-y ${darkMode ? 'divide-slate-700' : 'divide-slate-200'}`} {...props} />,
                    tr: ({node, ...props}) => <tr {...props} />,
                    th: ({node, ...props}) => (
                      <th className={`px-4 py-2 text-left text-xs font-semibold ${darkMode ? 'text-cyan-300' : 'text-blue-600'}`} {...props} />
                    ),
                    td: ({node, ...props}) => (
                      <td className={`px-4 py-2 text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} {...props} />
                    ),
                  }}
                >
                  {displayedContent}
                </ReactMarkdown>
                {isTyping && (
                  <span className="inline-block w-1.5 h-5 ml-1 bg-current animate-pulse"></span>
                )}
              </>
            ) : (
              <p className="whitespace-pre-wrap">
                {displayedContent}
              </p>
            )}
          </div>

          {/* Data visualization chart */}
          {!isUser && !isError && !isTyping && hasChartData(message.functionCalls) && (
            <DataChart data={getChartData(message.functionCalls)} darkMode={darkMode} />
          )}
          
          {/* Function Calls Info with collapsible SQL viewer */}
          {message.functionCalls && message.functionCalls.length > 0 && !isTyping && (
            <div className={`mt-4 pt-4 border-t ${
              darkMode ? 'border-white/20' : 'border-slate-200'
            }`}>
              <div className={`text-xs font-semibold ${
                darkMode ? 'text-cyan-300' : 'text-blue-600'
              } mb-3 flex items-center gap-2`}>
                <Database className="w-4 h-4" />
                <span>Consultas SQL Executadas</span>
              </div>
              {message.functionCalls.map((call, idx) => (
                <div
                  key={idx}
                  className={`${
                    darkMode ? 'bg-slate-800/50' : 'bg-white/70'
                  } backdrop-blur-sm rounded-lg p-3 mb-2 border ${
                    darkMode ? 'border-white/10' : 'border-slate-200'
                  } transition-all duration-200`}
                >
                  {/* Header with results */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className={`font-medium text-xs ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {call.arguments.explanation || 'Consulta SQL'}
                      </p>
                      {call.result.row_count !== undefined && (
                        <div className="flex items-center gap-2 mt-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <p className={`text-xs ${
                            darkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            <span className="font-bold text-green-500">
                              {call.result.row_count}
                            </span> registro(s) encontrado(s)
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <div className="px-2 py-1 bg-green-500/20 text-green-500 rounded-full text-xs font-bold">
                        OK
                      </div>
                    </div>
                  </div>

                  {/* Toggle button for SQL query */}
                  {call.arguments.query && (
                    <button
                      onClick={() => toggleQuery(idx)}
                      className={`mt-3 w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                        darkMode 
                          ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-300' 
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Database className="w-3 h-3" />
                        {expandedQueries[idx] ? 'Ocultar Query SQL' : 'Ver Query SQL'}
                      </span>
                      {expandedQueries[idx] ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  )}

                  {/* Collapsible SQL query viewer */}
                  {expandedQueries[idx] && call.arguments.query && (
                    <div className={`mt-2 rounded-lg overflow-hidden border ${
                      darkMode ? 'border-slate-700 bg-slate-900/50' : 'border-slate-200 bg-slate-50'
                    } animate-in fade-in slide-in-from-top-2 duration-300`}>
                      {/* Copy button */}
                      <div className={`flex items-center justify-between px-3 py-2 border-b ${
                        darkMode ? 'border-slate-700' : 'border-slate-200'
                      }`}>
                        <span className={`text-xs font-mono ${
                          darkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          SQL Query
                        </span>
                        <button
                          onClick={() => copyQuery(call.arguments.query, idx)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-all duration-200 ${
                            copiedQuery === idx
                              ? 'bg-green-500/20 text-green-500'
                              : darkMode
                              ? 'hover:bg-slate-700 text-slate-400 hover:text-slate-300'
                              : 'hover:bg-slate-200 text-slate-600 hover:text-slate-700'
                          }`}
                        >
                          {copiedQuery === idx ? (
                            <>
                              <Check className="w-3 h-3" />
                              <span>Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copiar</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* SQL code with basic syntax highlighting */}
                      <pre className={`p-3 text-xs font-mono overflow-x-auto ${
                        darkMode ? 'text-cyan-300' : 'text-blue-700'
                      }`}>
                        <code>{call.arguments.query}</code>
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Timestamp with better styling */}
        <div className={`flex items-center gap-2 mt-2 px-2 ${
          isUser ? 'justify-end' : 'justify-start'
        }`}>
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            {formatTime(message.timestamp)}
          </p>
          {isUser && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Message
