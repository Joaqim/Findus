/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */

export interface Refund {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  amount: string;
  reason: string;
  refunded_by: number;
  refunded_payment?: boolean;
  meta_data: RefundMetaData[];
  line_items: RefundLineItem[];
  shipping_lines?: any[];
  tax_lines?: RefundTaxLine[];
  fee_lines?: any[];
  _links?: RefundLinks;
}

export interface RefundLinks {
  self: Collection[];
  collection: Collection[];
  up: Collection[];
}

export interface Collection {
  href: string;
}

export interface RefundLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string; // TaxClass;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: ShippingLineMetaData[];
  sku: string;
  price: number;
  parent_name: null;
}

export interface ShippingLineMetaData {
  id: number;
  key: Key;
  value: string;
  display_key: Key;
  display_value: string;
}

export enum Key {
  Items = "Items",
  RefundedItemID = "_refunded_item_id",
  SmartSendAutoGenerateReturnLabel = "smart_send_auto_generate_return_label",
  SmartSendReturnMethod = "smart_send_return_method",
  SmartSendShippingMethod = "smart_send_shipping_method",
}

export enum TaxClass {
  Empty = "",
  ReducedRate = "reduced-rate",
  NormalRate = "normal-rate",
}

export interface Tax {
  id: number;
  total: string;
  subtotal: string;
}

export interface RefundMetaData {
  id: number;
  key: string;
  value: PurpleValue | string;
}

export interface PurpleValue {
  orders_count?: number;
  avg_order_value?: number;
  ltv?: number;
}

export interface RefundTaxLine {
  id: number;
  rate_code: string;
  rate_id: number;
  label: string;
  compound: boolean;
  tax_total: string;
  shipping_tax_total: string;
  rate_percent: number;
  meta_data: any[];
}

export interface WcOrder {
  id: number | string;
  parent_id: number;
  number: string;
  order_key: string;
  created_via: string;
  version: string;
  status: string;
  currency: string;
  date_created: Date;
  date_created_gmt: Date;
  date_modified: Date;
  date_modified_gmt: Date;
  discount_total: number | string;
  discount_tax: number | string;
  shipping_total: number | string;
  shipping_tax: number | string;
  cart_tax: number | string;
  total: string;
  total_tax: string;
  prices_include_tax: boolean;
  customer_id: number;
  customer_ip_address: string;
  customer_user_agent: string;
  customer_note: string;
  billing: Address;
  shipping: Omit<Address, "email">;
  payment_method: string;
  payment_method_title: string;
  transaction_id: string;
  date_paid: Date;
  date_paid_gmt: Date;
  date_completed?: Date;
  date_completed_gmt?: Date;
  cart_hash: string;
  meta_data: WcOrderMetaData[];
  line_items: WcOrderLineItem[];
  tax_lines: WcOrderTaxLine[];
  shipping_lines: ShippingLine[];
  fee_lines: any[];
  coupon_lines: CouponLine[];
  refunds: RefundElement[];
  payment_url?: string;
  currency_symbol?: string;
  _links?: WcOrderLinks;
  _wcpdf_document_link?: string;
  _wc_order_key?: string;
}

export interface WcOrderLinks {
  self: Collection[];
  collection: Collection[];
  customer?: Collection[];
}

export interface Address {
  first_name: string;
  last_name: string;
  company: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface CouponLine {
  id: number;
  code: string;
  discount: string;
  discount_tax: string;
  meta_data: CouponLineMetaData[];
}

export interface CouponLineMetaData {
  id: number;
  key: string;
  value: MetaDataDisplayValueClass;
  display_key: string;
  display_value: MetaDataDisplayValueClass;
}

export interface MetaDataDisplayValueClass {}

export interface WcOrderLineItem {
  id: number;
  name: string;
  product_id: number;
  variation_id: number;
  quantity: number;
  tax_class: string; // TaxClass;
  subtotal: string;
  subtotal_tax: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: PurpleMetaData[];
  sku: string;
  price: number;
  parent_name?: null;
  bundled_by?: number | string;
  bundled_item_title?: string;
  bundled_items?: number[];
  composite_parent?: string;
  composite_children?: any[];
}

export interface PurpleMetaData {
  id: number;
  key: string;
  value: string[] | Record<string, DisplayValueValue> | string;
  display_key: string;
  display_value: string[] | Record<string, DisplayValueValue> | string;
}

export interface DisplayValueValue {
  product_id: number;
  quantity: number;
  discount: string;
}

export interface WcOrderMetaData {
  id: number;
  key: string;
  value: any; // ValueElement[] | FluffyValue | string;
}

export interface ValueElement {
  tracking_provider?: string;
  custom_tracking_provider?: string;
  custom_tracking_link?: string;
  tracking_number?: string;
  date_shipped?: string;
  tracking_id?: string;
}

export interface FluffyValue {
  fbc?: null;
  fbp?: null | string;
  zone_id?: string;
  name?: string;
  countries?: string[];
  currency?: string;
  exchange_rate?: string;
  auto_exchange_rate?: string;
  exchange_rate_fee?: number;
  round_nearest?: string;
  currency_format?: string;
  price_thousand_sep?: string;
  price_decimal_sep?: string;
  price_num_decimals?: number;
  disable_tax_adjustment?: string;
  real_exchange_rate?: string;
  round_after_taxes?: string;
  trim_zeros?: string;
  pys_landing?: string;
  pys_source?: string;
  pys_utm?: string;
  pys_browser_time?: string;
  orders_count?: number;
  avg_order_value?: number;
  ltv?: number;
  header_logo?: string;
  header_logo_height?: string;
  shop_name?: Extra1;
  shop_address?: Extra1;
  footer?: Extra1;
  extra_1?: Extra1;
  extra_2?: Extra1;
  extra_3?: Extra1;
  number?: number;
  formatted_number?: string;
  prefix?: string;
  suffix?: string;
  document_type?: string;
  order_id?: number;
  padding?: string;
}

export interface Extra1 {
  default: string;
}

export interface RefundElement {
  id: number;
  reason: string;
  total: string;
}

export interface ShippingLine {
  id: number;
  method_title: string;
  method_id: string;
  instance_id: string;
  total: string;
  total_tax: string;
  taxes: Tax[];
  meta_data: ShippingLineMetaData[];
}

export interface WcOrderTaxLine {
  id: number | string;
  rate_code: string;
  rate_id: number | string;
  label: string;
  compound: boolean;
  tax_total: number | string;
  shipping_tax_total: number | string;
  meta_data: any[];
  rate_percent?: number;
}
