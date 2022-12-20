export default interface InvoicePayment {
    InvoiceNumber?: number | string;
    Amount: number;
    AmountCurrency: number;
    Currency?: Readonly<"SEK" | "EUR" | "USD">;
    CurrencyRate: number;
    PaymentDate: string;
    Number?: number;
    PaymentStatus?: "completed" | "refunded" | "partial refund";
}
