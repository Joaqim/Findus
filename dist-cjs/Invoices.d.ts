import type { RefundElement } from "wooconvert";
import type { Article, Invoice, InvoicePayment, Refund, WcOrder } from "./types";
import type RefundItem from "./types/RefundItem";
export default abstract class Invoices {
    static tryCanBeRefunded(invoice: Invoice): boolean;
    static tryGetInvoiceCurrencyAmount(invoice: Invoice): number;
    static tryCreateInvoicePayment(invoice: Invoice, currencyRate: number | undefined | null, paymentDate: Date, paymentStatus: "completed" | "refunded" | string): InvoicePayment;
    static tryGetHighestVATAccount(invoice: Invoice): {
        VAT: number;
        AccountNumber: number;
    };
    static tryCreateRefundObject(invoice: Invoice, refunds: Refund[]): RefundItem[] | undefined;
    static tryCreatePartialRefund(creditInvoice: Partial<Invoice>, refunds: Refund[] | RefundElement[]): Partial<Invoice>;
    static tryCreateRefundedCreditInvoice(invoice: Invoice, refunds: Refund[]): Invoice;
    static tryCreateFullRefund(order: WcOrder, creditInvoice: Partial<Invoice>): Partial<Invoice>;
    private static tryGenerateCashPaymentInvoice;
    private static tryGenerateInvoiceRows;
    private static tryAddPaymentFeeCost;
    static hasGiftCardRedeem(invoice: Invoice): boolean;
    private static tryAddRounding;
    static tryCreateGiftCardRedeemArticles(invoice: Invoice, allowEmpty?: boolean): Article[];
    private static tryAddGiftCardExpense;
    private static tryAddShippingCost;
    static tryCreateInvoice(order: WcOrder, currencyRate: number, storefrontPrefix: "GB" | "ND", expectedOrderStatus?: "completed" | "refunded" | string, expectedTotal?: number): Invoice;
}
