import type { SupplierInvoice, WcOrder } from "./types";
export default class SupplierInvoices {
    private static tryCreateBasicSupplierInvoice;
    static tryCreatePaymentFeeInvoice(order: WcOrder, currencyRate?: number): SupplierInvoice;
}
