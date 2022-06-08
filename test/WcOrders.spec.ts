import { expect } from "chai";

import { TaxLabel, WcOrders } from "../src";

import taxes from "./taxes.mock";

describe("WcOrders", () => {
  it("Gets TAX Rate", () => {
    let rate = WcOrders.getTaxRate(taxes["FR"][0]);
    expect(rate).to.equal(0.055);
  });

  it("Generates VAT Labels", () => {
    let taxLines = [
      { id: 0, label: "13% VAT" },
      { id: 1, label: "10% VAT" },
    ];

    let taxLabels = WcOrders.tryGetTaxRateLabels(taxLines);

    expect(taxLabels).to.deep.equal({
      standard: { vat: 0.13, label: "13% VAT" },
      reduced: { vat: 0.1, label: "10% VAT" },
    });

    let frenchTaxes = WcOrders.tryGetTaxRateLabels(taxes["FR"]);
    expect(frenchTaxes.standard).to.deep.equal({
      vat: 0.2,
      label: "20% VAT",
    });

    expect(frenchTaxes.reduced).to.deep.equal({
      vat: 0.055,
      label: "5.5% VAT",
    });

    const expectTaxes = (
      taxes: { standard: TaxLabel; reduced: TaxLabel },
      standardVAT: number,
      reducedVAT: number
    ) => {
      expect(taxes.standard.vat).to.greaterThanOrEqual(taxes.reduced.vat);
      expect(taxes.standard.vat).to.equal(standardVAT);
      expect(taxes.reduced.vat).to.equal(reducedVAT);
    };

    // Expect reversed input to still be ordered with Standard at index 0
    expectTaxes(
      WcOrders.tryGetTaxRateLabels(taxes["FR"].reverse()),
      0.2,
      0.055
    );

    expectTaxes(WcOrders.tryGetTaxRateLabels(taxes["FR"]), 0.2, 0.055);
  });
});
