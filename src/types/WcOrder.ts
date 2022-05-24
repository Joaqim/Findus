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
  feeLines: any[];
  couponLines: any[];
  refunds: any[];
  links: Links;
}

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

export interface Links {
  self: Collection[];
  collection: Collection[];
}

export interface Collection {
  href: string;
}

export interface ShippingLine {
  id: number;
  methodTitle: string;
  methodID: string;
  total: string;
  totalTax: string;
  taxes: any[];
  metaData?: any[];
}

export interface TaxLine {
  id: number;
  rateCode: string;
  rateID: number;
  label: string;
  compound: boolean;
  taxTotal: string;
  shippingTaxTotal: string;
  metaData?: any[];
}
