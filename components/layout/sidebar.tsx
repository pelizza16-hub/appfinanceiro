"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ArrowLeftRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/dashboard",
    label: "Visão Geral",
    description: "Seus números do mês",
    icon: LayoutDashboard,
  },
  {
    href: "/transactions",
    label: "Lançamentos",
    description: "Entradas e saídas",
    icon: ArrowLeftRight,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-56 border-r bg-card min-h-full">
      <div className="flex items-center gap-2 px-6 py-5 border-b">
        <TrendingUp className="h-5 w-5 text-primary" />
        <span className="font-bold">FinançasPessoais</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <div className="flex flex-col leading-tight">
              <span>{label}</span>
              <span
                className={cn(
                  "text-xs font-normal",
                  pathname === href ? "opacity-80" : "opacity-60"
                )}
              >
                {description}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
