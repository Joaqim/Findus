export interface SupplierInvoiceRow {
  Account: number;
  Code?: string;
  AccountDescription: string;
  Debit?: number;
  Credit?: number;
  Total?: Readonly<number>;
}
export default interface SupplierInvoice {
  Currency: "SEK" | "EUR" | "USD";
  CurrencyRate?: number;
  CurrencyUnit?: number;
  // Due date (You must specify this date even if you have posted terms of payment
  DueDate?: string;
  GivenNumber?: Readonly<number>;
  InvoiceDate: string;
  InvoiceNumber?: string;
  SalesType: "STOCK" | "SERVICE";
  SupplierInvoiceRows?: SupplierInvoiceRow[];
  SupplierNumber?: "54" | "55"; // "Stripe" | "PayPal";
  Total?: number;
  VAT?: number;
  VATType?: "NORMAL" | "EUINTERNAL" | "REVERSE";
  YourReference?: string;
}
