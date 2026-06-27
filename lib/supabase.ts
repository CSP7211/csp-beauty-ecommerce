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
