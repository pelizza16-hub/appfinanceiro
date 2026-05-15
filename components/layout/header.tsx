"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TrendingUp, LogOut, Menu, LayoutDashboard, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { logout } from "@/lib/actions/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transações", icon: ArrowLeftRight },
];

export function Header({ email }: { email: string }) {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-4 py-3 border-b bg-card md:px-6">
      <div className="flex items-center gap-3">
        {/* Mobile menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {navItems.map(({ href, label, icon: Icon }) => (
              <DropdownMenuItem key={href} asChild>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-2",
                    pathname === href && "font-semibold"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Mobile logo */}
        <div className="flex items-center gap-2 md:hidden">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">FinançasPessoais</span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <span className="hidden sm:block text-sm text-muted-foreground mr-2">
          {email}
        </span>
        <ThemeToggle />
        <form action={logout}>
          <Button variant="ghost" size="icon" type="submit" aria-label="Sair">
            <LogOut className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </header>
  );
}
