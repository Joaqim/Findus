import type { RefundLineItem, WcOrderLineItem } from "./types";
declare abstract class LineItems {
    static getTotalWithTax(item: WcOrderLineItem): number;
    static getAccurateTaxTotal(item: WcOrderLineItem): number;
    static getGiftCards(items: WcOrderLineItem[]): WcOrderLineItem[];
    static isGiftCard(item: WcOrderLineItem): boolean;
    static isGiftCardSKU(sku: string): boolean;
    static tryVerifyRate(item: WcOrderLineItem, expectedVAT: number): void;
    static tryHasReducedRate(item: WcOrderLineItem | RefundLineItem): boolean;
}
export default LineItems;
