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

const EXPENSE_COLORS = [
  "#3b82f6",
  "#ef4444",
  "#22c55e",
  "#f59e0b",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#6366f1",
];

const INCOME_COLORS = [
  "#22c55e",
  "#16a34a",
  "#4ade80",
  "#86efac",
  "#14b8a6",
  "#2dd4bf",
  "#34d399",
  "#6ee7b7",
  "#a7f3d0",
];

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

interface CategoryPieChartProps {
  transactions: Transaction[];
  type: "income" | "expense";
}

export function CategoryPieChart({ transactions, type }: CategoryPieChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const filtered = transactions.filter((t) => t.type === type);
  const COLORS = type === "expense" ? EXPENSE_COLORS : INCOME_COLORS;
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
              {data.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
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
