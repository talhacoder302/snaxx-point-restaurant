"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOrderStatus } from "@/lib/order-status";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return supabase;
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<{ error?: string }> {
  const supabase = await requireUser();

  if (typeof orderId !== "string" || !orderId || !isOrderStatus(status)) {
    return { error: "Invalid order or status." };
  }

  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) {
    return { error: error.message };
  }

  revalidatePath("/admin/orders");
  return {};
}
