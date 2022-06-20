import { expect } from "chai";
import type { Invoice, Refund, WcOrder } from "../src";
import { Articles, CultureInfo, Customers, Invoices } from "../src";

import { Convert } from "wooconvert";

import wooOrders from "./orders.mock.json";
import wooOrdersNaudrinks from "./orders.naudrinks.json";
import wooOrdersPartialRefund from "./orders.partial_refunds.json";
import refundItemMock from "./partialrefundItems.mock.json";

describe("Invoice, Customer & Articles", () => {
  it("Can process French order in EUR", () => {
    const order = Convert.toWcOrder(JSON.stringify(wooOrders.data[0]));

    const invoice = Invoices.tryCreateInvoice(order);
    // console.log(invoice);

    expect(invoice.Country).to.equal(
      CultureInfo.tryGetEnglishName(order.billing.country)
    );

    expect(invoice.Currency).to.equal(order.currency);
    expect(invoice.CurrencyRate).to.equal(10.299177595021115);

    expect(invoice.InvoiceType).to.equal("CASHINVOICE");

    expect(Invoices.tryCreateInvoice(order, 1.23).CurrencyRate).to.equal(1.23);

    const customer = Customers.tryCreateCustomer(invoice);

    //NOTE: For now, make sure to remove lingering Customer EmailInformation
    // to avoid accidentally sending out invoices for internal bookeeping
    // Do this _after_ creating customer.
    invoice.EmailInformation = undefined;

    expect(customer.Address1).to.equal(invoice.Address1);
    expect(customer.DeliveryAddress1).to.equal(invoice.DeliveryAddress1);
    expect(customer.VATType).to.equal("EUVAT");

    const articles = Articles.createArticles(order);
    expect(articles[0].Type).to.equal("STOCK");
  });

  it("Can process Swedish order in SEK", () => {
    const order = Convert.toWcOrder(JSON.stringify(wooOrders.data[0]));
    const orderSEK: WcOrder = {
      ...order,
      billing: { ...order.billing, country: "SE" },
      shipping: { ...order.shipping, country: "SE" },
      currency: "SEK",
      payment_method: "paypal",
      meta_data: [],
    };

    const invoiceSEK = Invoices.tryCreateInvoice(orderSEK);
    expect(invoiceSEK.CurrencyRate).to.equal(1);
    expect(() => Invoices.tryCreateInvoice(orderSEK, 1.23)).to.throw();

    const customerSEK = Customers.tryCreateCustomer(invoiceSEK);
    expect(customerSEK.VATType).to.equal("SEVAT");
  });

  it("Can process Canadian order in USD", () => {
    const order = Convert.toWcOrder(JSON.stringify(wooOrders.data[0]));
    const orderUSD: WcOrder = {
      ...order,
      billing: { ...order.billing, country: "CA" },
      shipping: { ...order.shipping, country: "CA" },
      currency: "USD",
      payment_method: "stripe",
      meta_data: [],
    };

    const invoiceUSD = Invoices.tryCreateInvoice(orderUSD, 1.23);

    const customerUSD = Customers.tryCreateCustomer(invoiceUSD);
    expect(customerUSD.VATType).to.equal("EXPORT");
  });

  describe("Can process Orders from Naudrinks", () => {
    it("Can process Swedish order in SEK", () => {
      const orderSEK = Convert.toWcOrder(JSON.stringify(wooOrdersNaudrinks[0]));

      const invoiceSEK = Invoices.tryCreateInvoice(orderSEK);

      const customerSEK = Customers.tryCreateCustomer(invoiceSEK);
      expect(customerSEK.VATType).to.equal("SEVAT");
    });

    it("Can process multiple real orders", () => {
      let invoice: Invoice;
      for (const order of wooOrdersNaudrinks) {
        const mockCurrencyRate = order.currency === "SEK" ? 1 : 1.234;
        invoice = Invoices.tryCreateInvoice(
          Convert.toWcOrder(JSON.stringify(order)),
          mockCurrencyRate
        );
      }
    });
  });

  it("Can create a Credit Invoice for partial refund of Order", () => {
    const order = Convert.toWcOrder(JSON.stringify(wooOrdersPartialRefund[0]));

    const refund: Refund = Convert.toRefund(JSON.stringify(refundItemMock[0]));

    let mockCreditInvoice: Partial<Invoice> = {
      Credit: true,
      DocumentNumber: "123",
    };

    let creditInvoiceUpdated = Invoices.tryCreatePartialRefund(
      order,
      mockCreditInvoice,
      refund
    );

    // console.log(creditInvoiceUpdated);
  });
});
