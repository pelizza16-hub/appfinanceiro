import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { CategoryPieChart, IncomeExpenseChart } from "@/components/dashboard/category-pie-chart";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import type { Transaction } from "@/types";

interface DashboardPageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const params = await searchParams;
  const now = new Date();
  const month = Number(params.month ?? now.getMonth() + 1);
  const year = Number(params.year ?? now.getFullYear());

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
  const endDate = new Date(year, month, 0).toISOString().split("T")[0];

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", user!.id)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: false });

  const txList = (transactions ?? []) as Transaction[];
  const income = txList
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);
  const expense = txList
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <Suspense>
          <PeriodFilter />
        </Suspense>
      </div>

      <SummaryCards income={income} expense={expense} />

      <IncomeExpenseChart income={income} expense={expense} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <CategoryPieChart transactions={txList} type="expense" />
        <CategoryPieChart transactions={txList} type="income" />
      </div>
    </div>
  );
}
