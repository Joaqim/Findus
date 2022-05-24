import type { LineItem, Tax } from "./types";

namespace LineItems {
  export function getTotalWithTax(item: LineItem): number {
    return item.price + LineItems.getTotalWithTax(item);
  }

  export function getAccurateTaxTotal(item: LineItem): number {
    let result = 0;
    item.taxes.forEach((tax: Tax) => {
      result += parseFloat(tax.total);
    });
    return result;
  }
}

export default LineItems;
