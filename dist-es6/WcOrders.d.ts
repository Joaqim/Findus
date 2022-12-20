import type { Refund, RefundElement } from "wooconvert";
import type { Rate } from "./Accounts";
import type { Customer, Expense, PayoutItemized, WcOrder, WcOrderLineItem, WcOrderMetaData, WcOrderTaxLine } from "./types";
import type { PaymentMethod } from "./types/PaymentMethod";
import type { Required } from "./utils";
export interface TaxLabel {
    vat: number;
    label?: string;
}
declare abstract class WcOrders {
    static tryVerifyOrder(order: WcOrder): void;
    static getFilteredMetaDataByKeys(meta_data: WcOrderMetaData[], filtered_keys: string[]): WcOrderMetaData[];
    static getMetaDataValueByKey: (object: WcOrder | WcOrderMetaData[], matchKey: string) => string | undefined;
    static hasInvoiceReference: (order: WcOrder) => boolean;
    static getInvoiceReference: (order: WcOrder) => string | undefined;
    static tryCreatePaymentFeeExpense(order: WcOrder, currencyRate: number, paymentMethod: "Stripe" | "PayPal"): Expense;
    static hasGiftCardsRedeem(order: WcOrder): boolean;
    static tryGetGiftCardsPurchases(order: WcOrder): {
        hasGiftCards: boolean;
        amountCurrency: number;
        containsOnlyGiftCards: boolean;
        giftCards: WcOrderLineItem[];
    };
    static tryGetPaymentFee(order: WcOrder, paymentMethod: string): number;
    static hasPaymentFee(order: WcOrder, paymentMethod: string): boolean;
    static getShippingTotal(order: WcOrder): number;
    static getShippingTax(order: WcOrder): number;
    static tryGetPaymentMethod(order: WcOrder): PaymentMethod;
    static hasPaymentMethod(order: WcOrder): boolean;
    static tryGetAccurateTotal(order: WcOrder, epsilon?: number): number;
    static tryVerifyStripePayout(order: WcOrder, payout: PayoutItemized): void;
    static tryVerifyCurrencyRate(order: WcOrder, currencyRate: number): number | undefined;
    static tryGetCurrency(order: WcOrder): "SEK" | "EUR" | "USD";
    private static getCurrencyRateFromStripeMetaData;
    static getRefunds(order: WcOrder): Refund[] | RefundElement[] | undefined;
    static isPartiallyRefunded(order: WcOrder): boolean;
    /**
     *
     * @static
     * @param {WcOrder} order
     * @param {(number | string)} [stripeFee]
     * @param {(number | string)} [stripeNet]
     * @param {number} [accurateTotal]
     * @return {*}  {number}
     * @memberof WcOrders
     */
    static tryGetCurrencyRate(order: WcOrder, stripeFee: number | string, stripeNet: number | string, accurateTotal?: number): number;
    static verifyRateForItem(order: WcOrder, rate: Rate, item: WcOrderLineItem): TaxLabel;
    static getPaymentDate: (order: WcOrder) => string;
    static getTaxRate(tax: WcOrderTaxLine): number;
    static tryGetTaxRateLabels(taxes: WcOrderTaxLine[]): {
        standard: TaxLabel;
        reduced: TaxLabel;
    };
    static getDocumentSource(order: WcOrder): string | null;
    static getStorefrontUrl(order: WcOrder): string | undefined;
    static getStorefrontPrefix(order: WcOrder): string | undefined;
    static createDocumentLink(orderId: string | number, storefrontUrl: string, orderKey: string): string;
    static tryGetDocumentLink(order: WcOrder, storefrontUrl?: string): string;
    static tryGetInvoiceReference(order: WcOrder): number;
    static tryCanBeRefunded(order: WcOrder): boolean;
    static tryGetCustomerName(order: WcOrder): string;
    static tryGetDeliveryName(order: WcOrder): string;
    static tryGetBillingName(order: WcOrder): string;
    static tryGetCustomerEmail(order: WcOrder): string;
    static tryGetCustomerAddresses(order: WcOrder): Required<Customer, "CountryCode" | "DeliveryCountryCode">;
}
export default WcOrders;
