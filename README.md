# 🚔 Crime Analytics RS

<div align="center">

**Sistema de Análise Inteligente de Dados Criminais do Rio Grande do Sul**

[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115.0-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org)
[![GPT-4](https://img.shields.io/badge/GPT--4-Powered-orange.svg)](https://openai.com)

[Recursos](#-recursos) • [Arquitetura](#️-arquitetura-do-sistema) • [Instalação](#-instalação) • [Uso](#-como-usar) • [API](#-api-documentation) • [Screenshots](#-screenshots--demonstrações) • [Vídeos](#-vídeos-demonstrativos)

</div>

---

## 📖 Sobre o Projeto

Crime Analytics RS é um chatbot inteligente avançado que permite fazer perguntas em **linguagem natural** sobre dados de crimes do Rio Grande do Sul. O sistema utiliza **GPT-4** com **function calling** para executar queries SQL dinâmicas e fornecer insights detalhados sobre mais de **2.2 milhões de registros criminais**.

### 🎯 Principais Funcionalidades

- 🤖 **Chatbot Inteligente** - Perguntas em linguagem natural processadas por GPT-4
- ✨ **Sugestões Rápidas Animadas** - Cards interativos com perguntas prontas para começar
- 📊 **Gráficos Automáticos** - Visualizações geradas automaticamente a partir dos dados
- ⚡ **Typing Effect** - Respostas aparecem letra por letra como ChatGPT
- 📝 **Markdown Rendering** - Respostas formatadas com títulos, tabelas, listas e negrito
- 🔍 **SQL Query Viewer** - Visualize e copie as queries executadas
- 📈 **Estatísticas em Tempo Real** - Dashboard com métricas atualizadas
- 🎨 **Design Ultra Moderno** - Interface com glassmorphism e dark mode
- 💬 **Histórico de Conversas** - Contexto mantido durante a sessão
- 🔎 **Insights Avançados** - Análises temporais, geográficas e demográficas

---

## 🏗️ Arquitetura do Sistema

### Visão Geral

```mermaid
graph TB
    subgraph "Frontend - React + Vite"
        A[👤 Usuário] --> B[🎨 Interface UI]
        B --> C[💬 Chatbot Component]
        C --> D[📊 Charts & Visualization]
        C --> E[📝 Markdown Renderer]
    end
    
    subgraph "API Layer - FastAPI"
        F[🔌 REST API] --> G[🛡️ CORS Middleware]
        G --> H[📋 Endpoints]
    end
    
    subgraph "Backend Logic"
        H --> I[🤖 GPT Agent]
        I --> J[🧠 OpenAI GPT-4]
        I --> K[⚡ Function Calling]
        K --> L[💾 SQL Executor]
    end
    
    subgraph "Data Layer"
        L --> M[(🗄️ PostgreSQL)]
        M --> N[📊 raw_records]
        N --> O[2.2M+ Registros]
    end
    
    B -->|HTTP Request| F
    J -->|API Call| Q[🌐 OpenAI API]
    
    style A fill:#3b82f6,stroke:#1e40af,color:#fff
    style F fill:#22c55e,stroke:#16a34a,color:#fff
    style I fill:#f59e0b,stroke:#d97706,color:#fff
    style M fill:#8b5cf6,stroke:#7c3aed,color:#fff
```

### Fluxo de Processamento de Perguntas

```mermaid
sequenceDiagram
    participant U as 👤 Usuário
    participant UI as 🎨 Frontend
    participant API as ⚡ FastAPI
    participant GPT as 🤖 GPT Agent
    participant AI as 🧠 OpenAI GPT-4
    participant DB as 🗄️ PostgreSQL
    
    U->>UI: Digite pergunta
    UI->>API: POST /chat
    API->>GPT: Processar mensagem
    GPT->>AI: Contexto + Pergunta
    
    alt Pergunta requer dados
        AI-->>GPT: Function: execute_sql_query
        GPT->>DB: Executar SQL
        DB-->>GPT: Resultados
        GPT->>AI: Dados retornados
    end
    
    AI-->>GPT: Resposta formatada
    GPT-->>API: JSON Response
    API-->>UI: Resposta + Metadata
    UI->>UI: Render Markdown + Charts
    UI-->>U: Resposta com animação
    
    Note over U,DB: Tempo médio: 2-5s
```

### Fluxo de Dados da API

```mermaid
flowchart TD
    Start([🌐 Cliente HTTP]) --> A{Qual Endpoint?}
    
    A -->|GET /health| B[❤️ Health Check]
    B --> B1[Verificar DB]
    B1 --> B2[✅ Status OK]
    
    A -->|GET /database/info| C[📊 Database Info]
    C --> C1[Schema + Estatísticas]
    
    A -->|POST /chat| D[💬 Chat Handler]
    D --> D1{Tem Conversation ID?}
    D1 -->|Sim| D2[Carregar Agente]
    D1 -->|Não| D3[Criar Novo Agente]
    D2 --> E[🤖 Processar com GPT]
    D3 --> E
    
    E --> F{Precisa Dados?}
    F -->|Sim| G[⚡ Function Calling]
    G --> H[🔍 Validar SQL]
    H --> I[💾 Executar no DB]
    I --> J[📋 Retornar Dados]
    J --> E
    
    F -->|Não| K[💭 Resposta Direta]
    K --> L[📤 JSON Response]
    E --> L
    
    style Start fill:#3b82f6,stroke:#1e40af,color:#fff
    style E fill:#f59e0b,stroke:#d97706,color:#fff
    style I fill:#8b5cf6,stroke:#7c3aed,color:#fff
    style L fill:#22c55e,stroke:#16a34a,color:#fff
```

---

## ✨ Recursos

### Interface & Design
- ✅ **Glassmorphism** - Efeito vidro fosco moderno
- ✅ **Dark/Light Mode** - Alternar entre temas claro e escuro
- ✅ **Animações Stagger** - Cards de sugestões aparecem em cascata
- ✅ **Micro-interactions** - Animações suaves e responsivas
- ✅ **Gradientes Animados** - Fundos dinâmicos e coloridos + shimmer effects
- ✅ **Typing Indicator** - Feedback visual durante processamento
- ✅ **Responsive Design** - Funciona em desktop, tablet e mobile
- ✅ **Hover Effects Avançados** - Scale, glow, rotate e fade transitions

### Funcionalidades do Chatbot
- ✅ **Sugestões Rápidas Inteligentes** - Cards clicáveis com 6 perguntas categorizadas
- ✅ **Gráficos Automáticos Inline** - Barras, linhas e pizza gerados automaticamente
- ✅ **Typing Effect Profissional** - Texto aparece letra por letra com cursor
- ✅ **Markdown Rendering Completo** - Suporta títulos, tabelas, listas, negrito, itálico e código
- ✅ **SQL Query Viewer Colapsável** - Veja e copie as queries com um clique
- ✅ **Perguntas em Linguagem Natural** - "Quantos crimes em Porto Alegre?"
- ✅ **Análises Estatísticas** - Totais, médias, distribuições
- ✅ **Comparações Temporais** - Compare anos, meses, períodos
- ✅ **Análises Geográficas** - Por município, bairro, região
- ✅ **Perfil de Vítimas** - Idade, sexo, características
- ✅ **Padrões Temporais** - Horários, dias da semana, turnos

### Backend Robusto
- ✅ **API RESTful** - Endpoints bem documentados
- ✅ **Validação de Queries** - Segurança contra SQL injection
- ✅ **Error Handling** - Tratamento elegante de erros
- ✅ **CORS Configurado** - Pronto para produção
- ✅ **Auto-reload** - Desenvolvimento ágil

---

## 🚀 Instalação

### Pré-requisitos

- Python 3.13+
- Node.js 18+
- PostgreSQL database (já configurado no projeto)
- OpenAI API Key

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/seu-usuario/crime-analytics-rs.git
cd crime-analytics-rs
```

### 2️⃣ Configure o Backend

**Crie o ambiente virtual:**
```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

**Instale as dependências:**
```bash
pip install -r requirements.txt
```

**Configure as variáveis de ambiente:**

Crie um arquivo `.env` na raiz do projeto:

```env
# Database Configuration
DATABASE_HOST=your-database-host.com
DATABASE_PORT=5432
DATABASE_NAME=defaultdb
DATABASE_USER=avnadmin
DATABASE_PASSWORD=your-secure-password
DATABASE_SSLMODE=require

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# CORS Configuration
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 3️⃣ Configure o Frontend

```bash
cd frontend
npm install
cd ..
```

---

## 💻 Como Usar

### Iniciar o Sistema

**Terminal 1 - Backend:**
```bash
cd backend
source ../venv/bin/activate  # Windows: ..\venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Acessar o Sistema

- **🌐 Aplicação:** http://localhost:5173
- **⚡ API Backend:** http://localhost:8000
- **📚 Documentação API:** http://localhost:8000/docs
- **🔍 Health Check:** http://localhost:8000/health

---

## 💬 Exemplos de Perguntas

### 📊 Estatísticas Gerais
```
"Quantos crimes foram registrados no total?"
"Mostre as estatísticas gerais do banco de dados"
"Quantos tipos diferentes de crimes existem?"
```

### 📅 Análises Temporais
```
"Quantos crimes ocorreram em 2024?"
"Compare os crimes entre 2023 e 2024"
"Qual mês teve mais ocorrências em 2024?"
"Mostre a evolução dos crimes por ano"
"Qual dia da semana tem mais crimes?"
```

### 🗺️ Análises Geográficas
```
"Quais são os 10 municípios mais perigosos?"
"Quantos crimes ocorreram em Porto Alegre?"
"Compare crimes entre Porto Alegre e Caxias do Sul"
"Qual bairro tem mais ocorrências?"
```

### 🔍 Análises por Tipo de Crime
```
"Quais são os crimes mais comuns?"
"Quantos roubos ocorreram este ano?"
"Mostre a distribuição por natureza de crime"
"Compare furtos e roubos"
```

### 👥 Perfil das Vítimas
```
"Qual a faixa etária mais afetada?"
"Mostre a distribuição de crimes por sexo da vítima"
"Quantas vítimas são jovens adultos?"
```

### ⏰ Padrões Temporais
```
"Qual horário tem mais crimes?"
"Mostre crimes por turno do dia"
"Quando ocorrem mais crimes: dia ou noite?"
```

### 📍 Local dos Crimes
```
"Quais os locais mais comuns de crimes?"
"Quantos crimes ocorrem em vias públicas?"
"Compare crimes em residências vs estabelecimentos comerciais"
```

---

## 🛠️ Tecnologias

### Backend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Python** | 3.13 | Linguagem principal |
| **FastAPI** | 0.115.0 | Framework web moderno |
| **PostgreSQL** | 15+ | Banco de dados |
| **SQLAlchemy** | 2.0.36 | ORM |
| **OpenAI SDK** | 1.12.0 | Integração GPT-4 |
| **Pydantic** | 2.9.2 | Validação de dados |
| **Uvicorn** | 0.32.0 | Servidor ASGI |

### Frontend

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 18.3.1 | Framework UI |
| **Vite** | 5.4.20 | Build tool |
| **Tailwind CSS** | 3.4.1 | Styling |
| **Axios** | 1.7.4 | HTTP client |
| **Recharts** | Latest | Biblioteca de gráficos |
| **React Markdown** | Latest | Renderização de Markdown |
| **Lucide React** | - | Ícones modernos |

### Design System

- **🎨 Color Palette:** Blue/Cyan/Sky (tema azul moderno)
- **✨ Effects:** Glassmorphism, gradientes animados, glow effects
- **🌓 Themes:** Light mode e Dark mode
- **📱 Responsive:** Mobile-first design
- **⚡ Animations:** Framer Motion principles

---

## 📁 Estrutura do Projeto

```
crime-analytics-rs/
│
├── backend/                    # Backend FastAPI
│   ├── __init__.py            # Package marker
│   ├── config.py              # Configurações e variáveis de ambiente
│   ├── database.py            # Manager do PostgreSQL
│   ├── gpt_agent.py           # Agente GPT-4 com function calling
│   └── main.py                # API endpoints e servidor
│
├── frontend/                   # Frontend React
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx     # Cabeçalho e dark mode toggle
│   │   │   ├── StatsPanel.jsx # Painel de estatísticas
│   │   │   ├── Chatbot.jsx    # Interface do chat
│   │   │   └── Message.jsx    # Componente de mensagem
│   │   ├── App.jsx            # Componente principal
│   │   ├── main.jsx           # Entry point
│   │   └── index.css          # Estilos globais
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   └── package-lock.json
│
├── datasets/                   # Dados criminais
│   ├── raw/                   # CSVs comprimidos
│   │   ├── 2022.csv.gz
│   │   ├── 2023.csv.gz
│   │   ├── 2024.csv.gz
│   │   └── 2025.csv.gz
│   └── README.md              # Documentação dos dados
│
├── venv/                      # Virtual environment Python
│
├── .env                       # Variáveis de ambiente (não commitado)
├── .gitignore                 # Arquivos ignorados pelo Git
├── requirements.txt           # Dependências Python
└── README.md                  # Este arquivo
```

---

## 📊 Database Schema

### Tabela: `defaultdb.public.raw_records`

**Total de Registros:** ~2,252,165

#### Colunas Principais

| Coluna | Tipo | Descrição |
|--------|------|-----------|
| `id` | INTEGER | ID único do registro |
| `data_fato` | DATE | Data da ocorrência |
| `ano` | INTEGER | Ano da ocorrência |
| `mes` | TEXT | Mês da ocorrência |
| `dia_semana` | TEXT | Dia da semana |
| `turno` | TEXT | Turno (Manhã/Tarde/Noite/Madrugada) |
| `horario` | TIME | Horário exato |
| `natureza_1` | TEXT | Tipo principal de crime |
| `natureza_2` | TEXT | Subtipo de crime |
| `natureza_3` | TEXT | Detalhamento adicional |
| `municipio` | TEXT | Município da ocorrência |
| `bairro` | TEXT | Bairro |
| `logradouro` | TEXT | Rua/Avenida |
| `local` | TEXT | Tipo de local (Via pública, residência, etc) |
| `sexo` | TEXT | Sexo da vítima |
| `faixa_etaria` | TEXT | Faixa etária da vítima |

#### Estatísticas

- **Período:** 2022 - 2025
- **Municípios:** 500
- **Tipos de Crimes:** 300+
- **Registros Completos:** 100% com dados essenciais

---

## 📸 Screenshots & Demonstrações

### 🎥 Vídeos Demonstrativos

#### Demo: Chatbot em Ação
**Arquivo:** [`screenshots/demo-chatbot-queries.mov`](./screenshots/demo-chatbot-queries.mov)

Demonstração completa das funcionalidades do chatbot:
- Perguntas em linguagem natural
- Geração automática de queries SQL
- Visualização de gráficos dinâmicos
- Typing effect em tempo real

---

#### Demo: Interação Completa do Sistema
**Arquivo:** [`screenshots/demo-full-interaction.mov`](./screenshots/demo-full-interaction.mov)

Tour completo pela aplicação mostrando:
- Navegação pela interface
- Sugestões rápidas categorizadas
- Toggle entre dark e light mode
- Histórico completo de conversas
- Múltiplas visualizações simultâneas

---

### 🌟 Interface Principal - Light Mode

<div align="center">
  <img src="./screenshots/light-mode-dashboard.png" alt="Light Mode Dashboard" width="100%">
  <p><em>Dashboard principal com estatísticas e chat em modo claro</em></p>
</div>

---

### 🌙 Interface Principal - Dark Mode

<div align="center">
  <img src="./screenshots/dark-mode-dashboard.png" alt="Dark Mode Dashboard" width="100%">
  <p><em>Interface com tema escuro, gradientes azuis e efeitos glassmorphism</em></p>
</div>

---

### 🌙 Chat Completo - Dark Mode

<div align="center">
  <img src="./screenshots/dark-mode-chat-complete.png" alt="Dark Mode Chat Complete" width="100%">
  <p><em>Conversa completa em modo escuro com múltiplas mensagens e visualizações</em></p>
</div>

---

### 💬 Interface do Chat

<div align="center">
  <img src="./screenshots/chat-interface.png" alt="Chat Interface" width="100%">
  <p><em>Chatbot respondendo perguntas sobre os dados criminais com análise SQL dinâmica</em></p>
</div>

---

### ⚡ Typing Effect em Ação

<div align="center">
  <img src="./screenshots/typing-effect-response.png" alt="Typing Effect" width="100%">
  <p><em>Efeito de digitação letra por letra, simulando ChatGPT</em></p>
</div>

---

### 📊 Chat com Gráficos

<div align="center">
  <img src="./screenshots/chat-with-charts.png" alt="Chat with Charts" width="100%">
  <p><em>Visualizações automáticas de gráficos gerados a partir das queries</em></p>
</div>

---

### 📈 Análise com Gráficos de Barras

<div align="center">
  <img src="./screenshots/crime-types-chart.png" alt="Crime Types Chart" width="100%">
  <p><em>Gráfico de barras mostrando distribuição dos tipos de crimes</em></p>
</div>

---

### 📅 Comparação Temporal

<div align="center">
  <img src="./screenshots/yearly-comparison.png" alt="Yearly Comparison" width="100%">
  <p><em>Comparação de crimes entre diferentes anos com análise detalhada</em></p>
</div>

---

### 🗺️ Análise Geográfica

<div align="center">
  <img src="./screenshots/geographic-analysis.png" alt="Geographic Analysis" width="100%">
  <p><em>Análise por município mostrando locais com mais ocorrências</em></p>
</div>

---

### 🔄 Interação com Gráficos

<div align="center">
  <img src="./screenshots/chart-interaction.png" alt="Chart Interaction" width="100%">
  <p><em>Gráficos interativos com tooltips e animações ao passar o mouse</em></p>
</div>

---

### 📝 Renderização de Markdown

<div align="center">
  <img src="./screenshots/markdown-rendering.png" alt="Markdown Rendering" width="100%">
  <p><em>Suporte completo a Markdown: títulos, listas, negrito, itálico e tabelas</em></p>
</div>

---

### 📋 Visualização de Tabelas

<div align="center">
  <img src="./screenshots/table-visualization.png" alt="Table Visualization" width="100%">
  <p><em>Tabelas renderizadas em Markdown com dados estruturados</em></p>
</div>

---

### 💬 Histórico de Conversas

<div align="center">
  <img src="./screenshots/conversation-history.png" alt="Conversation History" width="100%">
  <p><em>Contexto completo da conversa mantido durante toda a sessão</em></p>
</div>

---

### 🎯 Query Complexa com Múltiplas Visualizações

<div align="center">
  <img src="./screenshots/complex-query-result.png" alt="Complex Query Result" width="100%">
  <p><em>Resultado de query complexa com análises detalhadas e gráficos</em></p>
</div>

---

### ✨ Sugestões Rápidas Animadas

<div align="center">
  <img src="./screenshots/quick-suggestions.png" alt="Quick Suggestions" width="100%">
  <p><em>Cards interativos com 6 categorias de perguntas prontas e animações stagger</em></p>
</div>

---

### 📊 Painel de Estatísticas

<div align="center">
  <img src="./screenshots/stats-panel.png" alt="Stats Panel" width="100%">
  <p><em>Painel lateral com estatísticas em tempo real e efeitos hover</em></p>
</div>

---

### 📈 Estatísticas em Tempo Real

<div align="center">
  <img src="./screenshots/stats-real-time.png" alt="Stats Real-time" width="100%">
  <p><em>Dashboard de estatísticas com métricas atualizadas do banco de dados</em></p>
</div>

---

### 🎨 Efeitos Glassmorphism

<div align="center">
  <img src="./screenshots/glassmorphism-effects.png" alt="Glassmorphism Effects" width="100%">
  <p><em>Detalhes dos efeitos de vidro fosco, blur e transparências nos componentes</em></p>
</div>

---

### 🖥️ Vista Completa do Dashboard

<div align="center">
  <img src="./screenshots/full-dashboard-view.png" alt="Full Dashboard View" width="100%">
  <p><em>Visão panorâmica completa da aplicação com todos os componentes ativos</em></p>
</div>

---

### 📱 Design Responsivo

<div align="center">
  <img src="./screenshots/responsive-design.png" alt="Responsive Design" width="100%">
  <p><em>Layout adaptativo funcionando perfeitamente em diferentes tamanhos de tela</em></p>
</div>

---

### 📚 Documentação da API (Swagger)

<div align="center">
  <img src="./screenshots/api-documentation-swagger.png" alt="API Documentation Swagger" width="100%">
  <p><em>Documentação interativa da API gerada automaticamente pelo FastAPI</em></p>
</div>

---

## 🔧 Configuração Avançada

### Variáveis de Ambiente

#### Database
```env
DATABASE_HOST=seu-host.com          # Host do PostgreSQL
DATABASE_PORT=5432                   # Porta padrão
DATABASE_NAME=defaultdb              # Nome do banco
DATABASE_USER=avnadmin               # Usuário
DATABASE_PASSWORD=sua-senha          # Senha segura
DATABASE_SSLMODE=require             # SSL obrigatório
```

#### OpenAI
```env
OPENAI_API_KEY=sk-proj-...          # Sua chave da OpenAI
```

#### CORS
```env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Customização do Frontend

**Cores do Tema (Tailwind):**

Edite `frontend/tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',    // Blue
      secondary: '#06b6d4',  // Cyan
      accent: '#0ea5e9',     // Sky
    }
  }
}
```

---

## 🐛 Troubleshooting

### Backend não inicia

**Erro:** `Connection refused`
```bash
# Verifique se o PostgreSQL está acessível
psql -h $DATABASE_HOST -U $DATABASE_USER -d $DATABASE_NAME

# Teste a conexão
python -c "from backend.database import DatabaseManager; db = DatabaseManager(); print('OK')"
```

**Erro:** `Module not found`
```bash
# Reinstale as dependências
pip install --force-reinstall -r requirements.txt
```

### Frontend não inicia

**Erro:** `EADDRINUSE`
```bash
# Porta 5173 em uso - mate o processo
lsof -ti:5173 | xargs kill -9
```

**Erro:** `Module not found`
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### OpenAI API Errors

**Erro:** `Invalid API Key`
```bash
# Verifique se a chave está correta no .env
cat .env | grep OPENAI_API_KEY
```

**Erro:** `Rate limit exceeded`
- Aguarde alguns minutos
- Considere upgrade do plano OpenAI

### Database Errors

**Erro:** `SSL required`
```env
# Adicione ao .env
DATABASE_SSLMODE=require
```

**Erro:** `Query timeout`
- Database pode estar sobrecarregado
- Verifique índices nas tabelas

---

## 📈 Performance

### Métricas

- **Tempo de Resposta:** < 2s para queries simples
- **Queries Complexas:** 3-5s
- **Renderização Frontend:** 60 FPS
- **Tamanho do Bundle:** ~500KB (gzipped)

### Otimizações

- ✅ Database indexado nas colunas principais
- ✅ Queries otimizadas com LIMIT
- ✅ Frontend com code splitting
- ✅ Assets minificados
- ✅ HTTP/2 ready

---

## 🔐 Segurança

- ✅ **SQL Injection Protection** - Queries parametrizadas
- ✅ **Validação de Inputs** - Pydantic models
- ✅ **CORS Configurado** - Whitelist de origens
- ✅ **Environment Variables** - Credenciais protegidas
- ✅ **SSL/TLS** - Conexões criptografadas
- ✅ **No Secrets in Code** - .env não commitado

---

## 🚀 Deploy

### Backend (FastAPI)

**Opções de Deploy:**
- **Render:** Deploy direto do GitHub
- **Railway:** Deploy com PostgreSQL incluído
- **Heroku:** Suporte Python nativo
- **DigitalOcean:** App Platform
- **AWS:** EC2 + RDS

### Frontend (React)

**Opções de Deploy:**
- **Vercel:** Deploy automático
- **Netlify:** Integração com Git
- **GitHub Pages:** Hosting gratuito
- **Cloudflare Pages:** CDN global

---

## 📝 API Documentation

### Base URL

```
http://localhost:8000
```

Acesse a documentação interativa em: **http://localhost:8000/docs** (Swagger UI)

---

### Endpoints Disponíveis

#### `GET /`
Endpoint raiz com informações gerais da API.

**Response:**
```json
{
  "name": "Crime Analytics Chatbot API",
  "version": "1.0.0",
  "description": "API para análise de dados de crimes do RS com GPT",
  "endpoints": {
    "POST /chat": "Enviar mensagem para o chatbot",
    "POST /reset": "Resetar conversa",
    "GET /database/info": "Obter informações sobre o banco de dados",
    "GET /health": "Verificar status da API"
  }
}
```

---

#### `GET /health`
Verifica o status da API e a conexão com o banco de dados.

**Response (Success):**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-11T01:20:35.398509",
  "database": "connected",
  "total_records": 2252165
}
```

**Response (Error):**
```json
{
  "status": "unhealthy",
  "timestamp": "2025-10-11T01:20:35.398509",
  "database": "disconnected",
  "error": "Database connection failed"
}
```

**Status Code:** `200 OK` ou `503 Service Unavailable`

---

#### `GET /database/info`
Retorna informações detalhadas do banco de dados incluindo schema, estatísticas e dados de amostra.

**Response:**
```json
{
  "schema": {
    "table_name": "raw_records",
    "columns": [
      {
        "column_name": "id",
        "data_type": "integer",
        "is_nullable": "NO"
      },
      {
        "column_name": "data_fato",
        "data_type": "date",
        "is_nullable": "YES"
      },
      {
        "column_name": "municipio",
        "data_type": "text",
        "is_nullable": "YES"
      }
    ]
  },
  "statistics": {
    "total_records": 2252165,
    "total_municipalities": 497,
    "total_crime_types": 312,
    "earliest_year": 2022,
    "latest_year": 2025
  },
  "sample_data": [
    {
      "id": 1,
      "municipio": "Porto Alegre",
      "natureza_1": "Furto",
      "ano": 2024
    }
  ]
}
```

**Status Code:** `200 OK`

---

#### `POST /chat`
Envia uma mensagem para o chatbot e recebe resposta processada pelo GPT-4.

**Request Body:**
```json
{
  "message": "Quantos crimes ocorreram em Porto Alegre em 2024?",
  "conversation_id": "abc123"  // Opcional, será gerado automaticamente se não fornecido
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Em Porto Alegre, foram registrados **42.831 crimes** em 2024.",
  "conversation_id": "abc123",
  "function_calls": [
    {
      "function": "execute_sql_query",
      "arguments": {
        "query": "SELECT COUNT(*) FROM defaultdb.public.raw_records WHERE municipio = 'Porto Alegre' AND ano = 2024",
        "explanation": "Contando crimes em Porto Alegre no ano de 2024"
      },
      "result": {
        "success": true,
        "explanation": "Query executada com sucesso",
        "row_count": 1,
        "data": [
          {
            "count": 42831
          }
        ]
      }
    }
  ],
  "error": null
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Erro ao processar sua pergunta. Por favor, tente novamente.",
  "conversation_id": "abc123",
  "function_calls": null,
  "error": "OpenAI API timeout"
}
```

**Status Code:** `200 OK`

**Tempo de Resposta:** 2-8 segundos (depende da complexidade da query)

---

#### `POST /reset`
Reseta o histórico de uma conversa específica.

**Request Body:**
```json
{
  "conversation_id": "abc123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Conversa resetada com sucesso",
  "conversation_id": "abc123"
}
```

**Status Code:** `200 OK`

---

#### `GET /statistics`
Retorna estatísticas básicas sobre os dados criminais.

**Response:**
```json
{
  "success": true,
  "statistics": {
    "total_records": 2252165,
    "total_municipalities": 497,
    "total_crime_types": 312,
    "earliest_year": 2022,
    "latest_year": 2025
  }
}
```

**Status Code:** `200 OK`

---

### Modelos de Dados

#### ChatRequest
```python
{
  "message": str,                    # Pergunta do usuário (obrigatório)
  "conversation_id": str | None      # ID da conversa (opcional)
}
```

#### ChatResponse
```python
{
  "success": bool,                   # Status da operação
  "message": str,                    # Resposta do chatbot
  "conversation_id": str,            # ID da conversa
  "function_calls": List[Dict] | None,  # Funções executadas (queries SQL)
  "error": str | None                # Mensagem de erro
}
```

#### DatabaseInfoResponse
```python
{
  "schema": Dict[str, Any],          # Estrutura do banco
  "statistics": Dict[str, Any],      # Estatísticas gerais
  "sample_data": List[Dict]          # Dados de exemplo
}
```

---

### Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200 OK` | Requisição processada com sucesso |
| `400 Bad Request` | Dados inválidos na requisição |
| `500 Internal Server Error` | Erro no servidor |
| `503 Service Unavailable` | Serviço indisponível (ex: banco de dados offline) |

---

### Exemplos de Uso

#### cURL

```bash
# Health Check
curl http://localhost:8000/health

# Enviar mensagem ao chatbot
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Quantos crimes em 2024?"}'

# Obter informações do banco
curl http://localhost:8000/database/info
```

#### Python

```python
import requests

# Enviar mensagem ao chatbot
response = requests.post(
    'http://localhost:8000/chat',
    json={
        'message': 'Quais são os 5 municípios com mais crimes?',
        'conversation_id': 'minha-sessao-123'
    }
)

data = response.json()
print(data['message'])
print(data['function_calls'])
```

#### JavaScript (Axios)

```javascript
import axios from 'axios';

// Enviar mensagem ao chatbot
const response = await axios.post('http://localhost:8000/chat', {
  message: 'Mostre a evolução dos crimes por ano',
  conversation_id: 'sessao-456'
});

console.log(response.data.message);
console.log(response.data.function_calls);
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é parte de uma iniciativa de análise de dados criminais para insights e visualizações.

---

---

## 🙏 Agradecimentos

- OpenAI pela API do GPT-4
- FastAPI pelo framework incrível
- React e Vite pela developer experience
- Tailwind CSS pelo design system
- Comunidade open source

---
