
export default interface WcOrder {
    id:                   number;
    parent_id?:            number;
    status:               string;
    currency:             string;
    version?:              string;
    prices_include_tax:   boolean;
    date_created:         Date;
    date_modified:        Date;
    discount_total:       string;
    discount_tax:         string;
    shipping_total:       string;
    shipping_tax:         string;
    cart_tax:             string;
    total:                string;
    total_tax:            string;
    customer_id?:          number;
    order_key:            string;
    billing:              Address;
    shipping:             Address;
    payment_method:       string;
    payment_method_title: string;
    transaction_id?:       string;
    customer_ip_address?:  string;
    customer_user_agent?:  string;
    created_via?:          string;
    customer_note?:        string;
    date_completed:       Date;
    date_paid:            Date;
    cart_hash?:            string;
    number?:               string;
    meta_data:            MetaData[];
    line_items:           LineItem[];
    tax_lines:            TaxLine[];
    shipping_lines:       ShippingLine[];
    fee_lines:            any[];
    coupon_lines:         any[];
    refunds:              any[];
    payment_url?:          string;
    date_created_gmt:     Date;
    date_modified_gmt:    Date;
    date_completed_gmt:   Date;
    date_paid_gmt:        Date;
    currency_symbol?:      string;
    _wcpdf_document_link?: string;
    _wc_order_key?:        string;
    _links?:               Links;
}

export interface Links {
    self?:       Collection[];
    collection?: Collection[];
    customer?:   Collection[];
}

export interface Collection {
    href?: string;
}

export interface Address {
    first_name: string;
    last_name:  string;
    company?:    string;
    address_1:  string;
    address_2?:  string;
    city:       string;
    state?:      string;
    postcode:   string;
    country:    string;
    email:      string;
    phone?:      string;
}

export interface LineItem {
    id:                 number;
    name:               string;
    product_id:         number;
    variation_id?:       number;
    quantity:           number;
    tax_class:          string;
    subtotal:           string;
    subtotal_tax:       string;
    total:              string;
    total_tax:          string;
    taxes:              Tax[];
    meta_data:          LineItemMetaData[];
    sku:                string;
    price:              number;
    parent_name?:        null;
    composite_parent?:   string;
    composite_children?: any[];
    bundled_by?:         string;
    bundled_item_title?: string;
    bundled_items?:      any[];
}

export interface LineItemMetaData {
    id?:            number;
    key:           string;
    value:         string;
    display_key?:   string;
    display_value?: string;
}

export interface Tax {
    id:       number;
    total:    string;
    subtotal: string;
}

export interface MetaData {
    id?:    number;
    key:   string;
    value: ValueClass | string;
}

export interface ValueClass {
    fbc?:              null;
    fbp?:              string;
    pys_landing?:      string;
    pys_source?:       string;
    pys_utm?:          string;
    pys_browser_time?: string;
    orders_count?:     number;
    avg_order_value?:  number;
    ltv?:              number;
}

export interface ShippingLine {
    id?:           number;
    method_title?: string;
    method_id?:    string;
    instance_id?:  string;
    total?:        string;
    total_tax?:    string;
    taxes?:        any[];
    meta_data?:    LineItemMetaData[];
}

export interface TaxLine {
    id?:                 number;
    rate_code?:          string;
    rate_id?:            number;
    label?:              string;
    compound?:           boolean;
    tax_total?:          string;
    shipping_tax_total?: string;
    rate_percent?:       number;
    meta_data?:          any[];
}

export interface Refund {
  id: number;
  date_created: Date;
  date_created_gmt: Date;
  amount: string;
  reason: string;
  refunded_by: number;
  refunded_payment: boolean;
  meta_data: MetaData[];
  line_items: LineItem[];
  links: Links;
}

/*
export default interface WcOrder {
    id:                 number;
    parentID?:           number;
    status:             string;
    currency:           string;
    version:            string;
    pricesIncludeTax:   boolean;
    dateCreated:        Date;
    dateModified:       Date;
    discountTotal:      string;
    discountTax:        string;
    shippingTotal:      string;
    shippingTax:        string;
    cartTax:            string;
    total:              string;
    totalTax:           string;
    customerID?:         number;
    orderKey?:           string;
    billing:            Address;
    shipping:           Address;
    paymentMethod:      string;
    paymentMethodTitle: string;
    transactionID?:      string;
    customerIPAddress?:  string;
    customerUserAgent?:  string;
    createdVia?:         string;
    customerNote?:       string;
    dateCompleted?:      Date;
    datePaid?:           Date;
    cartHash?:           string;
    number?:             string;
    metaData:           MetaData[];
    lineItems:          LineItem[];
    taxLines:           TaxLine[];
    shippingLines:      ShippingLine[];
    feeLines?:           any[];
    couponLines:        any[];
    refunds:            any[];
    paymentURL?:         string;
    dateCreatedGmt:     Date;
    dateModifiedGmt:    Date;
    dateCompletedGmt:   Date;
    datePaidGmt:        Date;
    currencySymbol?:     string;
    wcpdfDocumentLink?:  string;
    wcOrderKey?:         string;
    links?:              Links;
}

export interface Address {
    firstName: string;
    lastName:  string;
    company?:   string;
    address1:  string;
    address2?:  string;
    city:      string;
    state?:     string;
    postcode:  string;
    country:   string;
    email:     string;
    phone?:     string;
}

export interface LineItem {
    id:                number;
    name:              string;
    productID?:         number;
    variationID?:       number;
    quantity:          number;
    taxClass:          string;
    subtotal:          string;
    subtotalTax:       string;
    total:             string;
    totalTax:          string;
    taxes?:             Tax[];
    metaData?:          LineItemMetaData[];
    sku:               string;
    price:             number;
    parentName?:        null;
    compositeParent?:   string;
    compositeChildren?: any[];
    bundledBy?:         string;
    bundledItemTitle?:  string;
    bundledItems?:      any[];
}

export interface LineItemMetaData {
    id?:           number;
    key?:          string;
    value?:        string;
    displayKey?:   string;
    displayValue?: string;
}

export interface Tax {
    id?:       number;
    total?:    string;
    subtotal?: string;
}

export interface Links {
    self?:       Collection[];
    collection?: Collection[];
    customer?:   Collection[];
}

export interface Collection {
    href?: string;
}

export interface MetaData {
    id?:    number;
    key?:   string;
    value?: ValueClass | string;
}

export interface ValueClass {
    fbc?:            null;
    fbp?:            string;
    pysLanding?:     string;
    pysSource?:      string;
    pysUtm?:         string;
    pysBrowserTime?: string;
    ordersCount?:    number;
    avgOrderValue?:  number;
    ltv?:            number;
}

export interface ShippingLine {
    id?:          number;
    methodTitle?: string;
    methodID?:    string;
    instanceID?:  string;
    total?:       string;
    totalTax?:    string;
    taxes?:       any[];
    metaData?:    LineItemMetaData[];
}

export interface TaxLine {
    id?:               number;
    rateCode?:         string;
    rateID?:           number;
    label?:            string;
    compound?:         boolean;
    taxTotal?:         string;
    shippingTaxTotal?: string;
    ratePercent?:      number;
    metaData?:         any[];
}

export interface Refund {
  id: number;
  dateCreated: Date;
  dateCreatedGmt: Date;
  amount: string;
  reason: string;
  refundedBy: number;
  refundedPayment: boolean;
  metaData: MetaData[];
  lineItems: LineItem[];
  links: Links;
}

/*
export interface Address {
  firstName: string;
  lastName: string;
  company: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  email?: string;
  phone?: string;
}

export interface MetaData {
  id: number;
  key: string;
  value: string;
}

export interface Tax {
  id: number;
  total: string;
  subtotal: string;
}

export interface LineItem {
  id: number;
  name: string;
  productID: number;
  variationID: number;
  quantity: number;
  taxClass: string;
  subtotal: string;
  subtotalTax: string;
  total: string;
  totalTax: string;
  taxes: Tax[];
  metaData: MetaData[];
  sku: string;
  price: number;
}

export interface Collection {
  href: string;
}

export interface Links {
  self: Collection[];
  collection: Collection[];
}

export interface TaxLine {
  id: number;
  rateCode?: string;
  rateID?: number;
  label: string;
  compound?: boolean;
  taxTotal?: string;
  shippingTaxTotal?: string;
  metaData?: MetaData[];
}

export interface ShippingLine {
  id: number;
  methodTitle: string;
  methodID: string;
  total: string;
  totalTax: string;
  taxes: unknown[];
  metaData?: MetaData[];
}

export interface Refund {
  id?: number;
  dateCreated?: Date;
  dateCreatedGmt?: Date;
  amount?: string;
  reason?: string;
  refundedBy?: number;
  refundedPayment?: boolean;
  metaData?: MetaData[];
  lineItems?: LineItem[];
  links?: Links;
}

export default interface WcOrder {
  id: number;
  parentID: number;
  number: string;
  orderKey: string;
  createdVia: string;
  version: string;
  status: string;
  currency: string;
  dateCreated: Date;
  dateCreatedGmt: Date;
  dateModified: Date;
  dateModifiedGmt: Date;
  discountTotal: string;
  discountTax: string;
  shippingTotal: string;
  shippingTax: string;
  cartTax: string;
  total: string;
  totalTax: string;
  pricesIncludeTax: boolean;
  customerID: number;
  customerIPAddress: string;
  customerUserAgent: string;
  customerNote: string;
  billing: Address;
  shipping: Address;
  paymentMethod: string;
  paymentMethodTitle: string;
  transactionID: string;
  datePaid: Date;
  datePaidGmt: Date;
  dateCompleted: null;
  dateCompletedGmt: null;
  cartHash: string;
  metaData: MetaData[];
  lineItems: LineItem[];
  taxLines: TaxLine[];
  shippingLines: ShippingLine[];
  feeLines: unknown[];
  couponLines: unknown[];
  refunds: unknown[];
  links: Links;
}

*/