import type { InvoiceType, Label, PaymentWay } from "./Invoice";

export interface InvoiceRowInit {
  accountNumber: number;
  articleNumber: string;
  costCenter?: null;
  deliveredQuantity: string;
  description?: string;
  discount?: number;
  discountType?: string;
  price: number;
  project?: string;
  unit?: string;
  vat?: number;
}

export default interface InvoiceInit {
  address1?: string;
  address2?: string;
  city?: string;
  comments?: string;
  contractReference?: number;
  costCenter?: string;
  country?: string;
  creditInvoiceReference?: string;
  currency: string;
  currencyRate: number;
  currencyUnit?: number;
  customerName: string;
  customerNumber?: string;
  deliveryAddress1: string;
  deliveryAddress2?: string;
  deliveryCity?: string;
  deliveryCountry: string;
  deliveryDate?: null;
  deliveryName?: string;
  deliveryZipCode: string;
  documentNumber?: string;
  externalInvoiceReference1?: string;
  externalInvoiceReference2?: string;
  freight?: number;
  gross?: number;
  invoiceDate: Date;
  invoiceReference?: string;
  invoiceRows: InvoiceRowInit[];
  invoiceType: InvoiceType;
  labels?: Label[];
  language?: string;
  notCompleted?: boolean;
  ocr?: string;
  ourReference?: string;
  paymentWay: PaymentWay;
  phone1?: string;
  phone2?: string;
  priceList?: string;
  printTemplate?: string;
  project?: string;
  remarks?: string;
  termsOfDelivery?: string;
  termsOfPayment?: string;
  vatIncluded?: boolean;
  wayOfDelivery?: string;
  yourOrderNumber?: string;
  yourReference?: string;
  zipCode?: string;
}
