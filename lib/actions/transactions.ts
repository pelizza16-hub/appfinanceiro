"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { type TransactionType, type Category } from "@/types";

interface TransactionPayload {
  description: string;
  amount: number;
  date: string;
  type: TransactionType;
  category: Category;
}

export async function createTransaction(payload: TransactionPayload) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("transactions").insert({
    ...payload,
    user_id: user.id,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function updateTransaction(
  id: string,
  payload: TransactionPayload
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("transactions")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/transactions");
  revalidatePath("/dashboard");
}
