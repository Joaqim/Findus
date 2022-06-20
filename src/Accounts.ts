import SalesAccounts from "./data/SalesAccounts";
import VatAccounts from "./data/VATAccounts";
import LineItems from "./LineItems";
import type { WcOrder, WcOrderLineItem } from "./types";
import createMapFromRecord from "./utils/createMapFromRecord";
import WcOrders from "./WcOrders";

export interface Rate {
  vat: number;
  accountNumber: number;
}

export interface Account {
  country?: string;
  standard: Rate;
  reduced?: Rate;
}

abstract class Accounts {
  private static readonly vat = createMapFromRecord<string, Account>(
    VatAccounts
  );

  private static readonly sales = createMapFromRecord<string, Account>(
    SalesAccounts
  );

  public static getRate(
    countryIso: string,
    isReduced = false,
    paymentMethod?: string | undefined
  ): Rate {
    const account = this.tryGetSalesAccount(countryIso, paymentMethod);

    if (isReduced) {
      return account.reduced ?? account.standard;
    }
    return account.standard;
  }

  public static tryGetSalesAccountForOrder(order: WcOrder): Account {
    const countryIso = order.billing.country;
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    return this.tryGetSalesAccount(countryIso, paymentMethod);
  }

  public static tryGetSalesRateForItem(
    order: WcOrder,
    item: WcOrderLineItem
  ): Rate {
    const account = Accounts.tryGetSalesAccountForOrder(order);

    if (LineItems.tryHasReducedRate(item)) {
      return account.reduced ?? account.standard;
    }
    return account.standard;
  }

  public static tryGetSalesAccount(
    countryIso: string,
    paymentMethod?: string
  ): Account {
    if (this.sales.has(countryIso)) {
      const account = this.sales.get(countryIso);

      if (!account)
        throw new Error(`Missing Sales Account for country: ${countryIso}`);
      return account;
    }

    if (!paymentMethod) {
      throw new Error(
        `Payment Method is required for orders outside EU: ${countryIso}`
      );
    }

    const account = this.sales.get(paymentMethod) as Account;

    if (!account)
      throw new Error(
        `Missing Sales Account for Payment Method: ${paymentMethod}`
      );
    return account;
  }

  public static getVatAccount(
    countryIso: string,
    paymentMethod?: string
  ): Account {
    if (this.vat.has(countryIso)) {
      const account = this.vat.get(countryIso);

      if (!account)
        throw new Error(`Missing VAT Account for country: ${countryIso}`);
      return account;
    }

    if (!paymentMethod) {
      throw new Error(
        `Payment Method is required for orders outside EU: ${countryIso}`
      );
    }

    const account = this.vat.get(paymentMethod) as Account;

    if (!account)
      throw new Error(
        `Missing VAT Account for Payment Method: ${paymentMethod}`
      );
    return account;
  }
}

export default Accounts;
