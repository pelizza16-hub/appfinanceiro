import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface SummaryCardsProps {
  income: number;
  expense: number;
}

export function SummaryCards({ income, expense }: SummaryCardsProps) {
  const balance = income - expense;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Recebi</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Entradas do mês</p>
          </div>
          <TrendingUp className="h-4 w-4 text-green-500 dark:text-green-400" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-green-500 dark:text-green-400">
            {formatCurrency(income)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Gastei</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Saídas do mês</p>
          </div>
          <TrendingDown className="h-4 w-4 text-red-500 dark:text-red-400" />
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold text-red-500 dark:text-red-400">
            {formatCurrency(expense)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle className="text-base font-semibold">Saldo</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Recebi menos gastei</p>
          </div>
          <Wallet className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <p
            className={`text-2xl font-bold ${
              balance >= 0 ? "text-primary" : "text-red-500 dark:text-red-400"
            }`}
          >
            {formatCurrency(balance)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
