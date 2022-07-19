import type { InvoiceType, Label, PaymentWay } from "./Invoice";

export interface InvoiceRowInit {
  AccountNumber: number;
  ArticleNumber: string;
  CostCenter?: null;
  DeliveredQuantity: string;
  Description?: string;
  Discount?: number;
  DiscountType?: string;
  Price: number;
  Project?: string;
  Unit?: string;
  VAT?: number;
}

export default interface InvoiceInit {
  Address1?: string;
  Address2?: string;
  City?: string;
  Comments?: string;
  ContractReference?: number;
  CostCenter?: string;
  Country?: string;
  CreditInvoiceReference?: string;
  Currency: string;
  CurrencyRate: number;
  CurrencyUnit?: number;
  CustomerName: string;
  CustomerNumber?: string;
  DeliveryAddress1: string;
  DeliveryAddress2?: string;
  DeliveryCity?: string;
  DeliveryCountry: string;
  DeliveryDate?: null;
  DeliveryName?: string;
  DeliveryZipCode: string;
  DocumentNumber?: string;
  ExternalInvoiceReference1?: string;
  ExternalInvoiceReference2?: string;
  Freight?: number;
  Gross?: number;
  InvoiceDate: string;
  InvoiceReference?: string;
  InvoiceRows: InvoiceRowInit[];
  InvoiceType: InvoiceType;
  Labels?: Label[];
  Language?: string;
  NotCompleted?: boolean;
  OCR?: string;
  OurReference?: string;
  PaymentWay: PaymentWay;
  Phone1?: string;
  Phone2?: string;
  PriceList?: string;
  PrintTemplate?: string;
  Project?: string;
  Remarks?: string;
  TermsOfDelivery?: string;
  TermsOfPayment?: string;
  VATIncluded?: boolean;
  WayOfDelivery?: string;
  YourOrderNumber?: string;
  YourReference?: string;
  ZipCode?: string;
}
