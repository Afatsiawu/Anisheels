import { supabase } from './supabase';
import type { CartItem } from '../context/CartContext';
import type { PromoCode } from './promo';

export type ShippingInfo = {
  email: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  region: string;
  country: string;
  notes: string;
};

export type PlaceOrderInput = {
  shipping: ShippingInfo;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  discount: number;
  total: number;
  promo: PromoCode | null;
};

export type PlaceOrderResult = {
  orderNumber: string;
  orderId: string;
};

function generateOrderNumber(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ANI-${ymd}-${rand}`;
}

export async function placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult> {
  const orderNumber = generateOrderNumber();

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: orderNumber,
      email: input.shipping.email,
      full_name: input.shipping.fullName,
      phone: input.shipping.phone,
      address: input.shipping.address,
      city: input.shipping.city,
      region: input.shipping.region || null,
      country: input.shipping.country,
      notes: input.shipping.notes || null,
      subtotal: input.subtotal,
      shipping: input.shippingCost,
      discount: input.discount,
      total: input.total,
      promo_code: input.promo?.code ?? null,
      status: 'pending',
    })
    .select('id, order_number')
    .single();

  if (orderError || !order) {
    throw new Error(orderError?.message ?? 'Failed to create order');
  }

  const lineItems = input.items.map((i) => ({
    order_id: order.id,
    product_id: i.id,
    name: i.name,
    image: i.image,
    price: i.price,
    quantity: i.quantity,
    size: i.size,
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(lineItems);

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  return { orderNumber: order.order_number, orderId: order.id };
}
