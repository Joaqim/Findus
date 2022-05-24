import type { LineItem, Tax } from "./types";

abstract class LineItems {
  public static getTotalWithTax(item: LineItem): number {
    return item.price + LineItems.getTotalWithTax(item);
  }

  public static getAccurateTaxTotal(item: LineItem): number {
    let result = 0;
    item.taxes.forEach((tax: Tax) => {
      result += parseFloat(tax.total);
    });
    return result;
  }
}

export default LineItems;
