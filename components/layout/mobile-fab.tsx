"use client";

import { Plus } from "lucide-react";
import { TransactionForm } from "@/components/transactions/transaction-form";

export function MobileFAB() {
  return (
    <div className="fixed bottom-6 right-5 z-50 md:hidden">
      <TransactionForm
        trigger={
          <button
            className="flex items-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg active:scale-95 transition-transform"
            aria-label="Novo Lançamento"
          >
            <Plus className="h-5 w-5" />
            Novo Lançamento
          </button>
        }
      />
    </div>
  );
}
