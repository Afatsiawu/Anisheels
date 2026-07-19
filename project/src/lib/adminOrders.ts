import { supabase, type OrderRow, type OrderItemRow } from './supabase';

export type OrderWithItems = OrderRow & { items: OrderItemRow[] };

export async function fetchAllOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as OrderRow[];
}

export async function fetchOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { data, error } = await supabase
    .from('order_items')
    .select('*')
    .eq('order_id', orderId)
    .order('id', { ascending: true });

  if (error) throw error;
  return (data ?? []) as OrderItemRow[];
}

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<void> {
  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);
  if (error) throw error;
}
