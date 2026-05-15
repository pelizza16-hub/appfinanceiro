# Design Spec: GestãoDeFinançasPessoais

**Data:** 2026-05-15  
**Status:** Aprovado  
**Stack:** Next.js 14+ · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Recharts

---

## 1. Problema

Pessoas físicas têm dificuldade em controlar finanças pessoais de forma simples e visual. Informações ficam dispersas entre extratos, planilhas e anotações. Sem visão consolidada de receitas, despesas e saldo, o descontrole financeiro é inevitável.

---

## 2. Solução

Web app de gestão financeira pessoal com autenticação, CRUD de transações categorizadas, dashboard com gráficos e exportação CSV. Interface moderna, responsiva, com suporte a dark mode.

---

## 3. Arquitetura

### Padrão: Híbrido Server + Client Components (Next.js App Router)

- **Server Components** — páginas, listas, cards de resumo (dados buscados no servidor, sem loading desnecessário)
- **Client Components** — formulários, filtros, gráficos, modais interativos
- **Server Actions** — mutações (create, update, delete) chamadas diretamente de Client Components
- **Middleware** (`middleware.ts`) — protege rotas `/dashboard` e `/transactions`, redireciona para `/login` se não autenticado

### Estrutura de Diretórios

```
/app
  /(public)
    /page.tsx               → Landing page
    /login/page.tsx
    /signup/page.tsx
  /(app)
    /dashboard/page.tsx
    /transactions/page.tsx
    /layout.tsx             → Layout autenticado (header + sidebar)
/components
  /ui/                      → shadcn/ui primitivos
  /layout/                  → Header, Sidebar, MobileMenu
  /dashboard/               → SummaryCards, CategoryPieChart, PeriodFilter
  /transactions/            → TransactionList, TransactionForm, TransactionFilters, DeleteButton, ExportCSVButton
  /auth/                    → AuthForm
/lib
  /supabase/
    /client.ts              → Supabase browser client
    /server.ts              → Supabase server client (Server Components / Actions)
  /actions/
    /transactions.ts        → Server Actions: createTransaction, updateTransaction, deleteTransaction
/types
  /index.ts                 → Tipos compartilhados: Transaction, TransactionType, Category
middleware.ts
```

---

## 4. Rotas

| Rota | Acesso | Descrição |
|------|--------|-----------|
| `/` | Público | Landing page com hero |
| `/login` | Público | Login com e-mail e senha |
| `/signup` | Público | Cadastro com e-mail e senha |
| `/dashboard` | Autenticado | Cards de resumo + gráfico de pizza |
| `/transactions` | Autenticado | Lista de transações + filtros + CRUD |

---

## 5. Schema do Banco de Dados

### Tabela `transactions`

```sql
CREATE TABLE transactions (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description text NOT NULL,
  amount      numeric(10,2) NOT NULL,
  date        date NOT NULL,
  type        text CHECK (type IN ('income', 'expense')) NOT NULL,
  category    text NOT NULL,
  created_at  timestamptz DEFAULT now()
);
```

### Row Level Security

```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own transactions"
  ON transactions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Categorias (enum no frontend, sem tabela separada)

`Alimentação` · `Transporte` · `Moradia` · `Lazer` · `Saúde` · `Educação` · `Salário` · `Freelance` · `Outros`

---

## 6. Componentes

### Landing Page
- `HeroSection` — título, subtítulo, botões "Entrar" e "Cadastrar"

### Auth
- `AuthForm` — formulário reutilizável para login e signup, submit via Server Action

### Dashboard
- `SummaryCards` — 3 cards: Total Receitas (verde), Total Despesas (vermelho), Saldo (azul) — Server Component
- `CategoryPieChart` — gráfico de pizza Recharts agrupado por categoria — Client Component
- `PeriodFilter` — seletor de mês/ano que atualiza searchParams — Client Component

### Transações
- `TransactionFilters` — busca por descrição + filtro mês/ano + filtro categoria — Client Component
- `TransactionList` — tabela responsiva de transações — Server Component (re-fetcha via searchParams)
- `TransactionForm` — modal com campos: descrição, valor, data, tipo (receita/despesa), categoria — Client Component
- `DeleteButton` — botão com confirmação via Dialog shadcn/ui — Client Component
- `ExportCSVButton` — exporta transações filtradas em `.csv` — Client Component

### Layout Global
- `Header` — logo, toggle dark mode, botão logout
- `Sidebar` — navegação desktop: Dashboard / Transações
- `MobileMenu` — hamburguer no header para mobile

---

## 7. Fluxo de Dados

### Leitura
```
URL (searchParams: mês, ano, categoria, busca)
  → Server Component busca Supabase com filtros
  → Renderiza lista/cards no servidor
```

### Mutação
```
Client Component (formulário)
  → chama Server Action (createTransaction / updateTransaction / deleteTransaction)
  → Server Action valida e executa query no Supabase
  → revalidatePath('/transactions') ou redirect
```

### Autenticação
```
Supabase Auth (email + senha)
  → Sessão armazenada em cookies httpOnly via @supabase/ssr
  → middleware.ts verifica sessão a cada request em rotas protegidas
```

---

## 8. Dark Mode

- Implementado via `next-themes` com estratégia `class` (Tailwind `dark:` classes)
- Toggle no `Header` persiste preferência no `localStorage`
- Sem flash no carregamento via `suppressHydrationWarning` no `<html>`

---

## 9. Exportação CSV

- `ExportCSVButton` recebe as transações já filtradas como prop
- Gera CSV no cliente com `Array.join` e `Blob` + `URL.createObjectURL`
- Sem dependência de biblioteca externa

---

## 10. Responsividade

- Layout desktop: sidebar fixa à esquerda + conteúdo principal
- Layout mobile: sidebar oculta, navegação via menu hamburguer no header
- Cards do dashboard empilhados em mobile (grid de 1 coluna)
- Tabela de transações com scroll horizontal em telas pequenas

---

## 11. Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 12. Milestones

| # | Milestone | Entregável |
|---|-----------|------------|
| 1 | Setup do projeto | Next.js + TypeScript + Tailwind + shadcn/ui + Supabase client + `.env` placeholders |
| 2 | Schema e Auth config | SQL do banco, RLS, middleware de proteção de rotas |
| 3 | Landing page | Hero público com dark mode funcional |
| 4 | Autenticação | Login, Signup, logout, redirecionamentos |
| 5 | Dashboard | Cards de resumo + gráfico de pizza por categoria |
| 6 | CRUD de Transações | Listagem, criação, edição, exclusão + filtros + busca |
| 7 | Exportar CSV | Botão exporta transações filtradas |
| 8 | Polish responsivo | Ajustes mobile, navegação hamburguer, revisão geral |
