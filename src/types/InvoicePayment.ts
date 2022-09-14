export default interface InvoicePayment {
  InvoiceNumber?: string;

  Amount: number;
  AmountCurrency?: number;
  Currency?: Readonly<"SEK" | "EUR" | "USD">;
  CurrencyRate: number;
  PaymentDate?: string; // Date format: "2022-09-02"

  Number?: number;
}
