"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import type { Transaction } from "@/types";

export function ExportCSVButton({ transactions }: { transactions: Transaction[] }) {
  function handleExport() {
    const headers = ["Descrição", "Valor", "Data", "Tipo", "Categoria"];
    const rows = transactions.map((t) => [
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount,
      formatDate(t.date),
      t.type === "income" ? "Receita" : "Despesa",
      t.category,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transacoes-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Button variant="outline" onClick={handleExport} disabled={transactions.length === 0}>
      <Download className="h-4 w-4" />
      Exportar CSV
    </Button>
  );
}
