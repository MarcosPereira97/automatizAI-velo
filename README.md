# Velô Sprint - Configurador de Veículo Elétrico 🚗⚡

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Playwright](https://img.shields.io/badge/Playwright-45ba4b?style=for-the-badge&logo=Playwright&logoColor=white)
![TestDino](https://img.shields.io/badge/TestDino_Reporter-Live_Stream-blue?style=for-the-badge)
![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)

Aplicação web moderna em React para configuração e compra do veículo elétrico premium **Velô Sprint**. Uma experiência fluida que demonstra as melhores práticas de desenvolvimento frontend, arquitetura em nuvem e automação de testes End-to-End.

## 🚀 Sobre a Experiência no Projeto

Este projeto vai além de um simples formulário de e-commerce. Ele implementa uma **arquitetura de nível de produção** com foco em testes robustos e isolamento de ambientes:

- **E2E Testing Moderno com Playwright & TestDino**: Automação de testes cobrindo todo o fluxo crítico de compras (seleção de opcionais, cálculo de financiamento, validação de crédito). Os resultados são transmitidos em tempo real para a dashboard do TestDino diretamente da pipeline, sem necessidade de esperar o job finalizar.
- **Isolamento de Banco de Dados**: A infraestrutura CI/CD (GitHub Actions + Vercel) garante que os testes de Preview interajam com um banco Supabase isolado e descartável, evitando qualquer chance de poluição do banco de Produção.
- **Deploy Multi-Environment**: Utilização de *Cloud Builds* distintos na Vercel para Produção e Preview, decodificando variáveis criptografadas (Sensíveis) com total segurança.

## ⚙️ Stack Tecnológica

| Categoria         | Tecnologias                                         |
| ----------------- | --------------------------------------------------- |
| **Frontend**      | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Estado**        | Zustand (global), React Hook Form (formulários)     |
| **Validação**     | Zod                                                 |
| **Data Fetching** | TanStack Query                                      |
| **Backend**       | Supabase (PostgreSQL + Edge Functions)              |
| **Qualidade (QA)**| Playwright, @testdino/playwright reporter           |

---

## 🛠️ Instalação e Execução Local

```bash
# Instalar dependências
yarn install

# Rodar a aplicação em modo de desenvolvimento
yarn dev

# Rodar a suíte de testes E2E localmente
yarn test:e2e
```
*Acesse a aplicação em: `http://localhost:5174`*

---

## ☁️ Configuração do Supabase (Backend)

Este projeto utiliza o Supabase para gerenciar a base de dados relacional e a lógica de negócios através de Edge Functions.

### 1. Variáveis de Ambiente
Crie o arquivo `.env` na raiz do projeto contendo as credenciais de Produção e Preview:

```env
# ========================================
# SUPABASE - PRODUCTION
# ========================================
VITE_SUPABASE_PROJECT_ID="seu_project_id_prod"
VITE_SUPABASE_PUBLISHABLE_KEY="sua_chave_anon_publica_prod"
VITE_SUPABASE_URL="https://seu_project_id_prod.supabase.co"
DATABASE_URL="sua_connection_string_prod"

# ========================================
# SUPABASE - PREVIEW (Para testes E2E isolados)
# ========================================
VITE_SUPABASE_PROJECT_ID="seu_project_id_preview"
...
```

### 2. Migrations e Deploy

```bash
# Instalar CLI do Supabase
npm install -g supabase

# Fazer login e vincular seu projeto
supabase login
supabase link --project-ref SEU_PROJECT_ID

# Aplicar o esquema do banco de dados (tabelas e RLS)
supabase db push

# Fazer o deploy das funções de Análise de Crédito
supabase functions deploy
```

---

## 🚗 O Veículo: Velô Sprint

- **Especificações:** 450 km de autonomia | 0-100 km/h em 3.2s | 500 cv
- **Preço base:** R$ 40.000
- **Rodas Sport:** +R$ 2.000
- **Precision Park:** +R$ 5.500
- **Flux Capacitor:** +R$ 5.000
- **Financiamento:** Até 12x com juros compostos de 2% a.m.

### Motor de Análise de Crédito (Edge Function)
A aplicação conta com uma regra de negócios no backend que analisa o crédito do cliente:
| Score   | Resultado  | Condição Especial |
| ------- | ---------- | ----------------- |
| > 700   | Aprovado   | - |
| 501-700 | Em análise | Aprova imediato se Entrada >= 50% |
| ≤ 500   | Reprovado  | Aprova imediato se Entrada >= 50% |

---

## 🏗️ Estrutura de Diretórios e Fluxo

O projeto adota uma arquitetura limpa focada em componentes e separação de responsabilidades.

```text
src/
├── pages/           # Páginas principais da aplicação
├── components/      # Componentes React
│   ├── configurator/   # Módulo do configurador do carro
│   ├── landing/        # Landing page
│   └── ui/             # Componentes base (shadcn/ui)
├── store/           # Gerenciamento de estado (Zustand)
├── hooks/           # Custom hooks
└── integrations/    # Clientes de API (Supabase)
```

**Fluxo do Usuário:**
`Landing Page` → `Configurador 3D` → `Checkout Seguro` → `Análise de Crédito em Tempo Real` → `Confirmação/Recibo`
