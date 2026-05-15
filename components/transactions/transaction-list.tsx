import { formatCurrency, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { DeleteButton } from "@/components/transactions/delete-button";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Use os filtros ou adicione uma nova transação.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Descrição
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Categoria
              </th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                Data
              </th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                Valor
              </th>
              <th className="px-4 py-3 text-center font-medium text-muted-foreground w-20">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${
                  i % 2 === 0 ? "" : "bg-muted/10"
                }`}
              >
                <td className="px-4 py-3 font-medium">{t.description}</td>
                <td className="px-4 py-3">
                  <Badge variant="outline">{t.category}</Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(t.date)}
                </td>
                <td className="px-4 py-3 text-right">
                  <span
                    className={
                      t.type === "income"
                        ? "font-semibold text-green-600 dark:text-green-400"
                        : "font-semibold text-red-600 dark:text-red-400"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}
                    {formatCurrency(Number(t.amount))}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <TransactionForm transaction={t} />
                    <DeleteButton id={t.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y">
        {transactions.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-4">
            <div className="flex-1 min-w-0 mr-3">
              <p className="font-medium truncate">{t.description}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {t.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {formatDate(t.date)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`font-semibold text-sm ${
                  t.type === "income"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {t.type === "income" ? "+" : "-"}
                {formatCurrency(Number(t.amount))}
              </span>
              <TransactionForm transaction={t} />
              <DeleteButton id={t.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
