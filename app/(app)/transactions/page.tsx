import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TransactionList } from "@/components/transactions/transaction-list";
import { TransactionFilters } from "@/components/transactions/transaction-filters";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { ExportCSVButton } from "@/components/transactions/export-csv-button";
import type { Transaction } from "@/types";

interface TransactionsPageProps {
  searchParams: Promise<{
    month?: string;
    year?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const params = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .order("date", { ascending: false });

  if (params.month && params.month !== "all") {
    const year = params.year && params.year !== "all"
      ? Number(params.year)
      : new Date().getFullYear();
    const month = Number(params.month);
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    query = query.gte("date", startDate).lte("date", endDate);
  } else if (params.year && params.year !== "all") {
    query = query
      .gte("date", `${params.year}-01-01`)
      .lte("date", `${params.year}-12-31`);
  }

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category);
  }

  if (params.search) {
    query = query.ilike("description", `%${params.search}%`);
  }

  const { data: transactions } = await query;
  const txList = (transactions ?? []) as Transaction[];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Transações</h1>
        <div className="flex items-center gap-2">
          <ExportCSVButton transactions={txList} />
          <TransactionForm />
        </div>
      </div>

      <Suspense>
        <TransactionFilters />
      </Suspense>

      <div className="text-sm text-muted-foreground">
        {txList.length} transação{txList.length !== 1 ? "ões" : ""} encontrada
        {txList.length !== 1 ? "s" : ""}
      </div>

      <TransactionList transactions={txList} />
    </div>
  );
}
