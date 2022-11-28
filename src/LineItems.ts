import type { RefundLineItem, Tax, WcOrderLineItem } from "./types";
import { TaxClass } from "./types";

abstract class LineItems {
  public static getTotalWithTax(item: WcOrderLineItem): number {
    return (
      (parseFloat(item.total) + parseFloat(item.total_tax)) /
      (item.quantity === 0 ? 1 : item.quantity)
    );
  }

  public static getAccurateTaxTotal(item: WcOrderLineItem): number {
    if (!item.taxes) return 0;
    let result = 0;
    item.taxes.forEach((tax: Tax) => {
      if (tax.total) result += parseFloat(tax.total);
    });
    return result;
  }

  public static getGiftCards(items: WcOrderLineItem[]): WcOrderLineItem[] {
    return items.filter((item) => LineItems.isGiftCard(item));
  }

  public static isGiftCard(item: WcOrderLineItem): boolean {
    return item.sku.includes("GIFTCARD");
  }

  public static isGiftCardSKU(sku: string): boolean {
    return sku.includes("GIFTCARD");
  }

  public static tryVerifyRate(
    item: WcOrderLineItem,
    expectedVAT: number
  ): void {
    const itemVat = (parseFloat(item.total_tax) / item.price).toFixed(2);

    if (itemVat !== expectedVAT.toFixed(2)) {
      throw new Error(
        `Item calculated VAT: '${itemVat}' doesn't match expected: ${expectedVAT}`
      );
    }
  }

  public static tryHasReducedRate(
    item: WcOrderLineItem | RefundLineItem
  ): boolean {
    if (
      !/\b(reduced|normal)\b-rate/.test(item.tax_class) &&
      item.price !== 0 &&
      item.tax_class !== ""
    ) {
      throw new Error(
        "Tax Class of Item in Orders are only expected to have either 'normal-rate' or 'reduced-rate' if cost of item is non-zero."
      );
    }
    return item.tax_class === "reduced-rate";

    if (item.tax_class === TaxClass.Empty)
      throw new Error(
        "Tax Class of Item in Orders are only expected to have either 'normal-rate' or 'reduced-rate' if cost of item is non-zero."
      );
    return item.tax_class === TaxClass.ReducedRate;
  }
}

export default LineItems;
