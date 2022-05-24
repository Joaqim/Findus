import type { TaxLine } from "./types";

export interface TaxLabel {
  vat: number;
  label: string;
}

abstract class WcOrders {
  public static getTaxRate(tax: TaxLine): number {
    const taxLabel = tax.label;

    try {
      return parseFloat(taxLabel.slice(taxLabel.indexOf("%"))) / 100;
    } catch {
      throw new Error(`Unexpected Tax label: ${taxLabel}`);
    }
  }

  public static getTaxRateLabels(taxes: TaxLine[]): {
    standard: TaxLabel;
    reduced: TaxLabel;
  } {
    let labels: TaxLabel[] = [];
    taxes.forEach((tax: TaxLine) => {
      const vat = WcOrders.getTaxRate(tax);
      const taxLabel = { vat, label: tax.label };

      // Push lower or equal vat on bottom
      if (labels[0]?.vat >= vat) labels.push(taxLabel);
      else labels = [taxLabel, ...labels];
    });

    /* TODO: Make sure this is correct, even if vat is equal between 'reduced' and 'standard' */
    return { standard: labels[0], reduced: labels[1] };
  }
}

export default WcOrders;
