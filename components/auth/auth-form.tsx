"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { TrendingUp, Eye, EyeOff, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, signup } from "@/lib/actions/auth";

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  const isLogin = mode === "login";

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = isLogin ? await login(formData) : await signup(formData);
      if (result?.error) setError(result.error);
      if (result && "pendingConfirmation" in result && result.pendingConfirmation) {
        setPendingEmail(result.email);
      }
    });
  }

  if (pendingEmail) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-4">
              <MailCheck className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold">Confirme seu e-mail</h1>
            <p className="text-muted-foreground">
              Enviamos um link de confirmação para
            </p>
            <p className="font-medium text-foreground break-all">{pendingEmail}</p>
            <p className="text-sm text-muted-foreground">
              Clique no link que enviamos para ativar sua conta. Verifique também
              a pasta de <span className="font-medium">spam ou lixo eletrônico</span> caso
              não encontre o e-mail.
            </p>
          </div>

          <div className="rounded-lg border bg-muted/40 px-4 py-3 text-sm text-muted-foreground">
            Após confirmar, volte aqui e faça login normalmente.
          </div>

          <Button variant="outline" className="w-full" asChild>
            <Link href="/login">Ir para o login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">FinançasPessoais</span>
          </div>
          <h1 className="text-2xl font-semibold">
            {isLogin ? "Entrar na conta" : "Criar conta"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isLogin
              ? "Acesse seu painel financeiro"
              : "Comece a controlar suas finanças"}
          </p>
        </div>

        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                autoComplete={isLogin ? "current-password" : "new-password"}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive rounded-md border border-destructive/20 bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending
              ? isLogin
                ? "Entrando..."
                : "Criando conta..."
              : isLogin
              ? "Entrar"
              : "Criar conta"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isLogin ? (
            <>
              Não tem uma conta?{" "}
              <Link href="/signup" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
