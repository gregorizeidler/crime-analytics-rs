import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, RotateCcw, MessageSquare, Sparkles } from 'lucide-react'
import axios from 'axios'
import Message from './Message'

function Chatbot({ darkMode }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Olá! 👋 Sou seu assistente de análise de dados de crimes do RS. Posso responder perguntas sobre estatísticas, tendências, municípios, tipos de crimes e muito mais. Como posso ajudar?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Sugestões rápidas com categorias e ícones
  const quickSuggestions = [
    {
      id: 1,
      question: 'Quantos crimes foram registrados no total?',
      category: 'Estatísticas Gerais',
      icon: '📊',
      gradient: 'from-blue-500 to-cyan-500',
      delay: '0ms'
    },
    {
      id: 2,
      question: 'Quais são os 10 municípios com mais crimes?',
      category: 'Análise Geográfica',
      icon: '🗺️',
      gradient: 'from-green-500 to-emerald-500',
      delay: '100ms'
    },
    {
      id: 3,
      question: 'Mostre a evolução dos crimes por ano',
      category: 'Tendências Temporais',
      icon: '📈',
      gradient: 'from-purple-500 to-pink-500',
      delay: '200ms'
    },
    {
      id: 4,
      question: 'Quais são os tipos de crimes mais comuns?',
      category: 'Classificação',
      icon: '🔍',
      gradient: 'from-orange-500 to-red-500',
      delay: '300ms'
    },
    {
      id: 5,
      question: 'Quantos crimes ocorreram em 2024?',
      category: 'Análise Anual',
      icon: '📅',
      gradient: 'from-indigo-500 to-blue-500',
      delay: '400ms'
    },
    {
      id: 6,
      question: 'Qual horário tem mais ocorrências?',
      category: 'Padrões Temporais',
      icon: '⏰',
      gradient: 'from-yellow-500 to-orange-500',
      delay: '500ms'
    }
  ]

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleQuickSuggestion = (question) => {
    setShowSuggestions(false)
    handleSend(question)
  }

  const handleSend = async (suggestionText = null) => {
    const messageText = suggestionText || input
    if (!messageText.trim() || loading) return

    // Esconde sugestões após primeira mensagem
    if (showSuggestions && !suggestionText) {
      setShowSuggestions(false)
    }

    const userMessage = {
      role: 'user',
      content: messageText,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await axios.post('/api/chat', {
        message: messageText,
        conversation_id: conversationId
      })

      if (response.data.success) {
        if (!conversationId) {
          setConversationId(response.data.conversation_id)
        }

        const assistantMessage = {
          role: 'assistant',
          content: response.data.message,
          functionCalls: response.data.function_calls,
          timestamp: new Date()
        }

        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(response.data.error || 'Erro desconhecido')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      
      const errorMessage = {
        role: 'assistant',
        content: `Desculpe, ocorreu um erro ao processar sua mensagem: ${error.message}`,
        isError: true,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleReset = async () => {
    if (!conversationId) {
      setMessages([
        {
          role: 'assistant',
          content: 'Conversa resetada! ✨ Como posso ajudar?',
          timestamp: new Date()
        }
      ])
      setShowSuggestions(true)
      return
    }

    try {
      await axios.post('/api/reset', {
        conversation_id: conversationId
      })

      setMessages([
        {
          role: 'assistant',
          content: 'Conversa resetada! ✨ Como posso ajudar?',
          timestamp: new Date()
        }
      ])
      setConversationId(null)
      setShowSuggestions(true)
    } catch (error) {
      console.error('Error resetting conversation:', error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className={`${darkMode ? 'glass-dark' : 'glass'} rounded-2xl shadow-2xl border ${
      darkMode ? 'border-white/10' : 'border-white/20'
    } flex flex-col h-[700px] hover:shadow-blue-500/20 transition-all duration-300`}>
      
      {/* Chat Header */}
      <div className={`px-6 py-4 border-b ${
        darkMode ? 'border-white/10' : 'border-white/20'
      } flex items-center justify-between ${darkMode ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-sm rounded-t-2xl`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full blur opacity-75 animate-pulse"></div>
            <div className={`relative ${darkMode ? 'bg-slate-800' : 'bg-white'} rounded-full p-2`}>
              <MessageSquare className="w-5 h-5 text-blue-500" />
            </div>
          </div>
          <div>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'} flex items-center gap-2`}>
              Chat de Análise
              <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
            </h2>
            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
              Powered by GPT-4
            </p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className={`group flex items-center gap-2 px-4 py-2 text-sm font-medium ${
            darkMode 
              ? 'text-slate-300 hover:text-white hover:bg-slate-700' 
              : 'text-slate-600 hover:text-slate-800 hover:bg-white'
          } rounded-xl transition-all duration-300 hover:scale-105 border ${
            darkMode ? 'border-white/10' : 'border-slate-200'
          }`}
          title="Resetar conversa"
        >
          <RotateCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          <span className="hidden sm:inline">Resetar</span>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((message, index) => (
          <Message key={index} message={message} darkMode={darkMode} />
        ))}
        
        {/* Quick Suggestions */}
        {showSuggestions && messages.length === 1 && !loading && (
          <div className="space-y-4 mt-6">
            {/* Header */}
            <div className="flex items-center gap-2">
              <Sparkles className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'} animate-pulse`} />
              <h3 className={`text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                Sugestões para começar
              </h3>
            </div>
            
            {/* Suggestions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {quickSuggestions.map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleQuickSuggestion(suggestion.question)}
                  className={`group relative overflow-hidden text-left p-4 rounded-xl border ${
                    darkMode 
                      ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' 
                      : 'bg-white/80 border-slate-200 hover:border-slate-300'
                  } backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-in fade-in slide-in-from-bottom-4`}
                  style={{ animationDelay: suggestion.delay }}
                >
                  {/* Gradient glow on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${suggestion.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className={`absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/${darkMode ? '5' : '20'} to-transparent`}></div>
                  </div>
                  
                  <div className="relative flex items-start gap-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${suggestion.gradient} flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-lg`}>
                        <span className="text-xl">{suggestion.icon}</span>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-xs font-semibold mb-1.5 bg-gradient-to-r ${suggestion.gradient} bg-clip-text text-transparent`}>
                        {suggestion.category}
                      </div>
                      <p className={`text-sm font-medium ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      } line-clamp-2 group-hover:text-blue-500 transition-colors duration-300`}>
                        {suggestion.question}
                      </p>
                    </div>
                    
                    {/* Arrow icon */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-0 group-hover:translate-x-1">
                      <Send className={`w-4 h-4 ${darkMode ? 'text-cyan-400' : 'text-blue-500'}`} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {/* Typing Indicator */}
        {loading && (
          <div className="flex items-center gap-2">
            <div className={`flex gap-2 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'} rounded-2xl px-4 py-3`}>
              <div className="flex gap-1">
                <div className={`w-2 h-2 ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
                <div className={`w-2 h-2 ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
                <div className={`w-2 h-2 ${darkMode ? 'bg-cyan-400' : 'bg-blue-600'} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Analisando...
              </span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`px-6 py-4 border-t ${
        darkMode ? 'border-white/10' : 'border-white/20'
      } ${darkMode ? 'bg-slate-800/30' : 'bg-white/30'} backdrop-blur-sm rounded-b-2xl`}>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua pergunta sobre os dados de crimes..."
              className={`w-full px-4 py-3 ${
                darkMode 
                  ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400' 
                  : 'bg-white/70 border-slate-300 text-slate-900 placeholder-slate-500'
              } border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 backdrop-blur-sm`}
              disabled={loading}
            />
            {input && (
              <div className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs ${
                darkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {input.length} caracteres
              </div>
            )}
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 overflow-hidden ${
              !loading && input.trim() ? 'hover:scale-105 shimmer-effect' : ''
            }`}
          >
            <div className="relative z-10 flex items-center gap-2">
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="hidden sm:inline">Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  <span className="hidden sm:inline">Enviar</span>
                </>
              )}
            </div>
          </button>
        </div>
        
        {/* Character count hint */}
        <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'} text-center`}>
          Pressione <kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-200'} font-mono`}>Enter</kbd> para enviar
        </p>
      </div>
    </div>
  )
}

export default Chatbot
