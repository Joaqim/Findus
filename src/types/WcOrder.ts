export interface Collection {
  href?: string;
}

export interface Links {
  self?: Collection[];
  collection?: Collection[];
  customer?: Collection[];
}

export interface Address {
  first_name: string;
  last_name: string;
  company?: string;
  address_1: string;
  address_2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
  email: string;
  phone?: string;
}

export interface LineItemMetaData {
  id?: number;
  key: string;
  value: string;
  display_key?: string;
  display_value?: string;
}

export interface Tax {
  id: number;
  total: string;
  subtotal: string;
}

export interface LineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id?: number;
  quantity: number;
  tax_class: string;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: LineItemMetaData[];
  sku: string;
  price: number;
  parent_name?: null;
  composite_parent?: string;
  composite_children?: unknown[];
  bundled_by?: string;
  bundled_item_title?: string;
  bundled_items?: unknown[];
}

export interface ValueClass {
  fbc?: null;
  fbp?: string;
  pys_landing?: string;
  pys_source?: string;
  pys_utm?: string;
  pys_browser_time?: string;
  orders_count?: number;
  avg_order_value?: number;
  ltv?: number;
}
export interface MetaData {
  id?: number;
  key: string;
  value: ValueClass | string;
}

export interface ShippingLine {
  id?: number;
  method_title?: string;
  method_id?: string;
  instance_id?: string;
  total?: string;
  total_tax?: string;
  taxes?: unknown[];
  meta_data?: LineItemMetaData[];
}

export interface TaxLine {
  id?: number;
  rate_code?: string;
  rate_id?: number;
  label: string;
  compound?: boolean;
  tax_total?: string;
  shipping_tax_total?: string;
  rate_percent?: number;
  meta_data?: MetaData[];
}

export interface Refund {
  id: number;
  date_created: string;
  date_created_gmt: string;
  amount: string;
  reason: string;
  refunded_by: number;
  refunded_payment: boolean;
  meta_data: MetaData[];
  line_items: LineItem[];
  links: Links;
}

export default interface WcOrder {
  id: number;
  parent_id?: number;
  status: string;
  currency: string;
  version?: string;
  prices_include_tax: boolean;
  date_created: string;
  date_modified: string;
  discount_total: string;
  discount_tax: string;
  shipping_total: string;
  shipping_tax: string;
  cart_tax: string;
  total: string;
  total_tax: string;
  customer_id?: number;
  order_key: string;
  billing: Address;
  shipping: Address;
  payment_method: string;
  payment_method_title: string;
  transaction_id?: string;
  customer_ip_address?: string;
  customer_user_agent?: string;
  created_via?: string;
  customer_note?: string;
  date_completed: string;
  date_paid: string;
  cart_hash?: string;
  number?: string;
  meta_data: MetaData[];
  line_items: LineItem[];
  tax_lines: TaxLine[];
  shipping_lines: ShippingLine[];
  fee_lines: unknown[];
  coupon_lines: unknown[];
  refunds: unknown[];
  payment_url?: string;
  date_created_gmt: string;
  date_modified_gmt: string;
  date_completed_gmt: string;
  date_paid_gmt: string;
  currency_symbol?: string;
  _wcpdf_document_link?: string;
  _wc_order_key?: string;
  _links?: Links;
}
