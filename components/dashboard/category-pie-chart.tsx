"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { Transaction } from "@/types";

// Cores fixas por categoria — Saúde usa teal para não conflitar com verde de receitas
const CATEGORY_COLORS: Record<string, string> = {
  Alimentação: "#f97316",
  Transporte: "#3b82f6",
  Moradia: "#8b5cf6",
  Lazer: "#ec4899",
  Saúde: "#14b8a6",
  Educação: "#6366f1",
  Salário: "#22c55e",
  Freelance: "#16a34a",
  Outros: "#64748b",
};
const FALLBACK_COLORS = ["#f59e0b", "#0ea5e9", "#d946ef", "#84cc16", "#e11d48"];

function getCategoryColor(name: string, index: number): string {
  return CATEGORY_COLORS[name] ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

interface TooltipPayload {
  name: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  isDark: boolean;
}

function CustomTooltip({ active, payload, isDark }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: isDark ? "#1e293b" : "#ffffff",
        border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
        borderRadius: "8px",
        padding: "8px 12px",
        color: isDark ? "#f1f5f9" : "#0f172a",
        fontSize: "13px",
      }}
    >
      <p>{`${payload[0].name}: ${formatCurrency(payload[0].value)}`}</p>
    </div>
  );
}

// Gráfico por categoria (despesas ou receitas)
interface CategoryPieChartProps {
  transactions: Transaction[];
  type: "income" | "expense";
}

export function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const filtered = transactions.filter((t) => t.type === type);
  const title = type === "expense" ? "Despesas por Categoria" : "Receitas por Categoria";
  const emptyMessage = type === "expense" ? "Nenhuma despesa no período" : "Nenhuma receita no período";

  const byCategory = filtered.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + Number(t.amount);
    return acc;
  }, {});

  const data = Object.entries(byCategory)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={getCategoryColor(entry.name, index)}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip isDark={isDark} />} />
            <Legend
              formatter={(value) => (
                <span className="text-xs text-muted-foreground">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Gráfico receitas vs despesas (visão geral do mês)
interface IncomeExpenseChartProps {
  income: number;
  expense: number;
}

export function IncomeExpenseChart({ income, expense }: IncomeExpenseChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const total = income + expense;

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Receitas vs Despesas</CardTitle>
          <p className="text-xs text-muted-foreground">Quanto entrou e quanto saiu no mês</p>
        </CardHeader>
        <CardContent className="flex h-48 items-center justify-center">
          <p className="text-sm text-muted-foreground">Nenhum lançamento no período</p>
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Receitas", value: income },
    { name: "Despesas", value: expense },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Receitas vs Despesas</CardTitle>
        <p className="text-xs text-muted-foreground">Quanto entrou e quanto saiu no mês</p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const item = payload[0];
                const pct = total > 0 ? ((Number(item.value) / total) * 100).toFixed(1) : "0";
                return (
                  <div
                    style={{
                      background: isDark ? "#1e293b" : "#ffffff",
                      border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                      borderRadius: "8px",
                      padding: "8px 12px",
                      color: isDark ? "#f1f5f9" : "#0f172a",
                      fontSize: "13px",
                    }}
                  >
                    <p className="font-medium">{item.name}</p>
                    <p>{formatCurrency(Number(item.value))}</p>
                    <p className="text-xs opacity-70">{pct}% do total</p>
                  </div>
                );
              }}
            />
            <Legend
              formatter={(value, entry) => {
                const color = (entry as { color?: string }).color;
                return (
                  <span style={{ color: isDark ? "#94a3b8" : "#64748b", fontSize: "12px" }}>
                    {value}{" "}
                    <span style={{ color }}>
                      {formatCurrency(data.find((d) => d.name === value)?.value ?? 0)}
                    </span>
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
