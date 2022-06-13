import type { LineItem, Tax } from "./types";

abstract class LineItems {
  public static getTotalWithTax(item: LineItem): number {
    return item.price + parseFloat(item.total_tax);
  }

  public static getAccurateTaxTotal(item: LineItem): number {
    if (!item.taxes) return 0;
    let result = 0;
    item.taxes.forEach((tax: Tax) => {
      if (tax.total) result += parseFloat(tax.total);
    });
    return result;
  }

  public static hasReducedRate(item: LineItem): boolean {
    if (
      parseFloat(item.total) !== 0 &&
      !/\b(reduced|normal)\b-rate/.test(item.tax_class)
    ) {
      throw new Error(
        "Tax Class in Items in Order are only expected to have either 'normal-rate' or 'reduced-rate' if cost of item is non-zero."
      );
    }
    return item.tax_class === "reduced-rate";
  }
}

export default LineItems;
