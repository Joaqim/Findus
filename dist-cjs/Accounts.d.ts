import type { WcOrder, WcOrderLineItem } from "./types";
export interface Rate {
    vat: number;
    accountNumber: number;
}
export interface Account {
    country?: string;
    standard: Rate;
    reduced?: Rate;
}
declare abstract class Accounts {
    private static readonly vat;
    private static readonly sales;
    static getRate(countryIso: string, isReduced?: boolean, paymentMethod?: string | undefined): Rate;
    static tryGetSalesAccountForOrder(order: WcOrder): Account;
    static tryGetSalesRateForItem(order: WcOrder, item: WcOrderLineItem): Rate;
    static tryGetSalesAccount(countryIso: string, paymentMethod?: string): Account;
    static getVatAccount(countryIso: string, paymentMethod?: string): Account;
}
export default Accounts;
