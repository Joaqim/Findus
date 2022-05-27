import { expect } from "chai";

import { TaxLabel, TaxLine, WcOrders } from "../src";

describe("WcOrders", () => {
  const taxes: Record<string, TaxLine[]> = {
    FR: [
      {
        id: 6289,
        rateCode: "FR-5.5% VAT-1",
        rateID: 100,
        label: "5.5% VAT",
        compound: false,
        taxTotal: "3.87",
        shippingTaxTotal: "0.00",
      },
      {
        id: 6290,
        rateCode: "FR-20% VAT-1",
        rateID: 73,
        label: "20% VAT",
        compound: false,
        taxTotal: "5.22",
        shippingTaxTotal: "0.00",
      },
    ],
  };
  it("Gets TAX Rate", () => {
    let rate = WcOrders.getTaxRate(taxes["FR"][0]);
    expect(rate).to.equal(0.055);
  });

  it("Generates VAT Labels", () => {
    let taxLines = [
      { id: 0, label: "13% VAT" },
      { id: 1, label: "10% VAT" },
    ];

    let taxLabels = WcOrders.getTaxRateLabels(taxLines);

    expect(taxLabels).to.deep.equal({
      standard: { vat: 0.13, label: "13% VAT" },
      reduced: { vat: 0.1, label: "10% VAT" },
    });

    let frenchTaxes = WcOrders.getTaxRateLabels(taxes["FR"]);
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
    expectTaxes(WcOrders.getTaxRateLabels(taxes["FR"].reverse()), 0.2, 0.055);
  });
});
