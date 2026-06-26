import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Realtime subscription helpers
export function subscribeToProducts(callback: (payload: any) => void) {
  return supabase
    .channel('products')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, callback)
    .subscribe();
}

export function subscribeToOrders(callback: (payload: any) => void) {
  return supabase
    .channel('orders')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe();
}

export function subscribeToInventory(callback: (payload: any) => void) {
  return supabase
    .channel('inventory')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'inventory_movements' }, callback)
    .subscribe();
}

// Types
export interface Product {
  id: string;
  sku: string;
  brand: string;
  name: string;
  category: string;
  size: string;
  cost_price: number;
  wholesale_price: number;
  margin_percent: number;
  stock_status: 'In Stock' | 'Low Stock' | 'On Order';
  moq: number;
  origin: string;
  gs1_barcode: string;
  clickup_task_id: string;
  is_active: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  status: string;
  total_amount: number;
  clickup_task_id: string;
  stripe_payment_intent_id: string;
  created_at: string;
}

export interface Customer {
  id: string;
  company_name: string;
  email: string;
  stripe_customer_id: string;
}
