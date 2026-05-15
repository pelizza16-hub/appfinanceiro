import Link from "next/link";
import { TrendingUp, BarChart3, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">FinançasPessoais</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle showLabel />
          <Button variant="ghost" asChild>
            <Link href="/login">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Cadastrar</Link>
          </Button>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-muted-foreground">
            <TrendingUp className="h-3.5 w-3.5" />
            Controle financeiro simples e visual
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Suas finanças{" "}
            <span className="text-primary">sob controle</span>
          </h1>

          <p className="text-lg text-muted-foreground sm:text-xl">
            Registre receitas e despesas, visualize seu saldo em tempo real e
            tome decisões financeiras com clareza. Tudo em um lugar.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button size="lg" asChild>
              <Link href="/signup">Começar gratuitamente</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-3xl w-full">
          <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-primary/10 p-3">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold">Dashboard Visual</h3>
            <p className="text-sm text-muted-foreground">
              Gráficos e cards com resumo de receitas, despesas e saldo mensal.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-green-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <h3 className="font-semibold">Categorias e Filtros</h3>
            <p className="text-sm text-muted-foreground">
              Organize transações por categoria e filtre por período com
              facilidade.
            </p>
          </div>

          <div className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center">
            <div className="rounded-full bg-blue-500/10 p-3">
              <ShieldCheck className="h-6 w-6 text-blue-500" />
            </div>
            <h3 className="font-semibold">Seus dados, só seus</h3>
            <p className="text-sm text-muted-foreground">
              Autenticação segura e dados isolados por usuário com Row Level
              Security.
            </p>
          </div>
        </div>
      </main>

      <footer className="border-t px-6 py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} FinançasPessoais. Feito com Next.js e
        Supabase.
      </footer>
    </div>
  );
}
