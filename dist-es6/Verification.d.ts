import type { Invoice, WcOrder } from "./types";
/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */ export declare function groupBy<K, V>(list: V[], keyGetter: (input: V) => K): Map<K, V[]>;
interface InvoiceAccrualRow {
    Account?: number;
    Debit?: number;
    Credit?: number;
    TransactionInformation?: string;
}
export default class Verification {
    static tryCreateVerification(invoice: Invoice, order?: WcOrder, withPaymentFee?: boolean): InvoiceAccrualRow[];
}
export {};
