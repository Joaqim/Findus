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