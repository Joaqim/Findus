import { expect } from "chai";

import {
  CultureInfo,
  Customers,
  Invoices,
  TaxLabel,
  WcOrder,
  WcOrders,
  WcOrderTaxLine,
  WooConvert
} from "../src";

import wooOrders from "./orders.mock.json";
import taxes from "./taxes.mock";

describe("WcOrders", () => {
  it("Can verify Order from WooCommerce", () => {
    let order = WooConvert.toWcOrder(JSON.stringify(wooOrders.data[0]));
    expect(() => WcOrders.tryVerifyOrder(order)).to.not.throw();
    order.prices_include_tax = false;
    expect(() => WcOrders.tryVerifyOrder(order)).to.throw();
  });

  it("Gets VAT Rates from Order", () => {
    let rate = WcOrders.getTaxRate(taxes["FR"][0]);
    expect(rate).to.equal(0.055);
  });

  it("Gets VAT Labels (reduced/standard) from Order", () => {
    const mockTaxLine = {
      rate_code: "0",
      rate_id: 0,
      tax_total: 0,
      shipping_tax_total: 0,
      compound: true,
      meta_data: [],
    };

    let taxLines: WcOrderTaxLine[] = [
      {
        ...mockTaxLine,
        id: 0,
        label: "13% VAT",
        rate_percent: 13,
      },
      { ...mockTaxLine, id: 1, label: "10% VAT", rate_percent: 10 },
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

    // Expect reversed input to still be ordered
    // with Standard Rate at index 0

    expectTaxes(
      WcOrders.tryGetTaxRateLabels(taxes["FR"].reverse()),
      0.2,
      0.055
    );

    expectTaxes(WcOrders.tryGetTaxRateLabels(taxes["FR"]), 0.2, 0.055);
  });

  it("Gets Customer Name from shipping/billing addresses", () => {
    let order: WcOrder = {
      ...WooConvert.toWcOrder(JSON.stringify(wooOrders.data[0])),
    };

    const invoice = Invoices.tryCreateInvoice(order);
    const customer = Customers.tryCreateCustomer(order);

    expect(customer.CountryCode).to.equal(
      CultureInfo.tryGetCountryIso(invoice.Country)
    );

    expect(customer.DeliveryCountryCode).to.equal(
      CultureInfo.tryGetCountryIso(invoice.DeliveryCountry)
    );
  });
});
