import { expect } from "chai";
import {
  Articles,
  CultureInfo,
  Customers,
  Invoice,
  Invoices,
  Refund,
  RefundLineItem,
  Verification,
  Vouchers,
  WcOrder,
  WcOrders,
} from "../src";

import { removeEmojis, sanitizeTextForFortnox } from "../src/utils";
import wooOrdersGamerbulk from "./orders.gamerbulk.json";
import wooOrders from "./orders.mock.json";
import wooOrdersNaudrinks from "./orders.naudrinks.json";
import wooOrdersPartialRefund from "./orders.partial_refunds.json";

const mockCurrencyRate = (order: WcOrder): number => {
  try {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);
    if (paymentMethod === "Stripe") {
      return WcOrders.tryGetCurrencyRate(
        order,
        WcOrders.getMetaDataValueByKey(order, "_stripe_fee") as string,
        WcOrders.getMetaDataValueByKey(order, "_stripe_net") as string
      );
    }
  } catch {
  } finally {
    return order.currency === "SEK" ? 1 : 10.234;
  }
};

describe("Can process Orders from Gamerbulk", () => {
  it("Can create Fortnox Payment Expense", () => {
    const order = wooOrdersGamerbulk[1] as WcOrder;
    const currencyRate = mockCurrencyRate(order);
    const invoice = Invoices.tryCreateInvoice(order, currencyRate, "GB");

    const paymentMethod = WcOrders.tryGetPaymentMethod(order);
    const paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);

    const voucher = Vouchers.tryCreateVoucherForPaymentFee(
      order,
      currencyRate,
      'GB',
      paymentMethod as "Stripe" | "PayPal"
    );

    expect(voucher).to.deep.equal({
      Description: "Payment Fee: GB-31667 via Stripe",
      TransactionDate: "2022-06-20",
      VoucherSeries: "B",
      VoucherRows: [
        {
          Account: 1930,
          Debit: 0,
          Credit: 3,
        },
        {
          Account: 6570,
          Debit: 3,
          Credit: 0,
        },
      ],
    });

    /*
    expect(invoice.InvoiceRows[invoice.InvoiceRows.length - 1]).to.deep.equal({
      ArticleNumber: "Betalningsavgift.Stripe",
      DeliveredQuantity: 1,
      Description: "Betalningsavgift: GB-31667 via Stripe",
      Price: -paymentFee / currencyRate,
    });
    */
  });

  it("Can process French order in EUR", () => {
    const order = wooOrders.data[0] as WcOrder;

    const currencyRate = mockCurrencyRate(order);
    const invoice = Invoices.tryCreateInvoice(order, currencyRate, "GB");

    expect(invoice.Country).to.equal(
      CultureInfo.tryGetEnglishName(order.billing.country)
    );

    expect(invoice.Currency).to.equal(order.currency);
    expect(invoice.CurrencyRate).to.equal(currencyRate);

    expect(invoice.InvoiceType).to.equal("INVOICE");

    expect(Invoices.tryCreateInvoice(order, 10.23, "GB").CurrencyRate).to.equal(
      10.23
    );

    expect(invoice.InvoiceRows[0].VAT).to.equal(5.5);

    const customer = Customers.tryCreateCustomer(order);

    //NOTE: For now, make sure to remove lingering Customer EmailInformation
    // to avoid accidentally sending out invoices for internal bookeeping
    // Do this _after_ creating customer.
    invoice.EmailInformation = undefined;

    expect(customer.VATType).to.equal("EUVAT");

    const articles = Articles.createArticles(order);
    expect(articles[0].Type).to.equal("STOCK");
  });

  it("Can process multiple real orders from Gamerbulk", () => {
    for (const order of wooOrdersGamerbulk) {
      const orderObject = order as WcOrder;
      const currencyRate = mockCurrencyRate(orderObject);
      try {
        if (order.id === "107455") {
          expect(
            Invoices.tryCreateInvoice(orderObject, currencyRate, "GB")
          ).to.throw("Order was created manually by 'admin'.");
        } else if (orderObject.id === "31687") {
          expect(() =>
            Invoices.tryCreateInvoice(orderObject, currencyRate, "GB")
          ).to.throw("Order was created manually by 'admin'.");
        } else if (orderObject.id === "31867") {
          const invoice = Invoices.tryCreateInvoice(
            orderObject,
            currencyRate,
            "GB"
          );
          expect(invoice).to.deep.equal({
            InvoiceDate: "2022-06-22",
            DueDate: "2022-06-22",
            InvoiceType: "INVOICE",
            PaymentWay: undefined,
            TermsOfPayment: "0",
            Currency: "EUR",
            Country: "Denmark",
            DeliveryCountry: "Denmark",
            VATIncluded: true,
            YourOrderNumber: "GB-31867",
            CurrencyRate: currencyRate,
            InvoiceRows: [
              {
                AccountNumber: 3121,
                VAT: 25,
                ArticleNumber: "GFUEL019",
                Description: "GFUEL - Pewdiepie Lingonberry (40 serv)",
                DeliveredQuantity: 2,
                Price: 44.989999999999995,
              },
              {
                AccountNumber: 3121,
                VAT: 25,
                ArticleNumber: "GAMERBULK001",
                Description: "GamerBulk Shaker",
                DeliveredQuantity: 1,
                Price: 0,
              },
              {
                AccountNumber: 3121,
                ArticleNumber: "Shipping.Cost",
                Description: "Fraktkostnad",
                DeliveredQuantity: 1,
                Price: 19.9875,
                VAT: 25,
              },
            ],
          });
        } else {
          WcOrders.tryGetAccurateTotal(orderObject);
          Invoices.tryCreateInvoice(orderObject, currencyRate, "GB");
        }
      } catch (reason) {
        if (
          !/WooCommerce order total does not match calculated total/.test(
            reason as string
          )
        ) {
          throw new Error(reason as string);
        }
      }
    }
  });

  describe("Can process Orders from Naudrinks", () => {
    it("Can process Swedish order in SEK", () => {
      const orderSEK = wooOrdersNaudrinks[0] as WcOrder;

      const invoiceSEK = Invoices.tryCreateInvoice(orderSEK, 1, "ND");

      const customerSEK = Customers.tryCreateCustomer(orderSEK);
      expect(customerSEK.VATType).to.equal("SEVAT");
    });

    it("Can process multiple real orders from Naudrinks", () => {
      try {
        for (const orderData of wooOrdersNaudrinks) {
          const order = orderData as WcOrder;
          const currencyRate = mockCurrencyRate(order);

          WcOrders.tryGetAccurateTotal(order);
          const invoice = Invoices.tryCreateInvoice(order, currencyRate, "ND");
          if (order.id === "ND-107674") {
            expect(order.line_items[0].tax_class).to.equal("reduced-rate");
            expect(invoice.InvoiceRows[0]).to.deep.equal({
              AccountNumber: 3140,
              VAT: 10,
              ArticleNumber: "NAU019-B",
              Description: "PINEAPPLE TWIST - BAG",
              DeliveredQuantity: 1,
              Price: 32.39,
            });
          }
        }
      } catch (reason) {
        if (
          !/WooCommerce order total does not match calculated total/.test(
            reason as string
          )
        ) {
          throw new Error(reason as string);
        }
      }
    });
  });

  it("Can create a simple Verification overview of Invoice & Order", () => {
    const order = wooOrdersGamerbulk[1] as WcOrder;
    const invoice = Invoices.tryCreateInvoice(order, 10.23, "GB");
    const verification = Verification.tryCreateVerification(
      invoice,
      order,
      true
    );

    /*
    expect(verification).to.deep.equal([
      {
        Account: 3150,
        Debit: 0,
        Credit: 65.78,
        TransactionInformation: "Adv Energy Sample - Cotton Candy",
      },
      {
        Account: 6570,
        Debit: 3,
        TransactionInformation: "Utgående Betalningsavgift: Stripe",
      },
    ]);
    */
  });

  it("Can refund Shipping Cost of existing Invoice of Order", () => {
    const order = wooOrdersPartialRefund[2] as WcOrder;
    const invoice = Invoices.tryCreateInvoice(order, 10.234, "GB");

    let mockCreditInvoice: Partial<Invoice> = {
      Credit: true,
      DocumentNumber: 123,
      InvoiceRows: invoice.InvoiceRows,
    };

    let creditInvoiceUpdated = Invoices.tryCreatePartialRefund(
      mockCreditInvoice,
      order.refunds
    );

    expect(creditInvoiceUpdated).to.deep.equal({
      Credit: true,
      DocumentNumber: 123,
      InvoiceRows: [
        {
          AccountNumber: 3105,
          ArticleNumber: "Shipping.Cost",
          Description: "Fraktkostnad",
          DeliveredQuantity: 1,
          Price: 10.99,
          VAT: 0,
        },
      ],
    });

    mockCreditInvoice.InvoiceRows = [
      ...invoice.InvoiceRows.filter(
        (row) => !/Shipping.*/.test(row.ArticleNumber)
      ),
      {
        ArticleNumber: "Shipping.Cost",
        AccountNumber: 1000,
        Price: 8.2425,
      },
      {
        ArticleNumber: "Shipping.Cost.VAT",
        AccountNumber: 1000,
        Price: 2.7475,
      },
    ];

    creditInvoiceUpdated = Invoices.tryCreatePartialRefund(
      mockCreditInvoice,
      order.refunds
    );

    expect(creditInvoiceUpdated.InvoiceRows).to.deep.equal([
      {
        ArticleNumber: "Shipping.Cost",
        AccountNumber: 1000,
        Price: 8.2425,
      },
      {
        ArticleNumber: "Shipping.Cost.VAT",
        AccountNumber: 1000,
        Price: 2.7475,
      },
    ]);
  });

  it("Can apply discount Refund as Credit Invoice to existing Invoice ", () => {
    const order = wooOrdersPartialRefund[3] as WcOrder;
    const invoice = Invoices.tryCreateInvoice(order, 10.234, "GB");

    let mockCreditInvoice: Partial<Invoice> = {
      Credit: true,
      DocumentNumber: 123,
      InvoiceRows: invoice.InvoiceRows,
      DeliveryCountry: "Denmark",
    };

    const mockRefund: Partial<Refund>[] = [
      {
        reason: "Refund",
        amount: "2.99",
        line_items: [
          {
            quantity: 0,
            tax_class: "",
            subtotal: "-2.39",
            subtotal_tax: "-0.60",
            total: "-2.39",
            total_tax: "-0.60",
            sku: "GFUEL076",
          },
        ] as RefundLineItem[],
        meta_data: [],
      },
    ];

    let creditInvoiceUpdated = Invoices.tryCreatePartialRefund(
      mockCreditInvoice,
      mockRefund as Refund[]
    );

    console.log(creditInvoiceUpdated);
  });
});

describe("Fortnox Sanitized Item Description", () => {
  it("Should remove unsupported characters from string", () => {
    expect(sanitizeTextForFortnox("test | test").includes("|")).to.be.false;
    expect(
      /[[\]^{|}~[|]\|]/g.test(sanitizeTextForFortnox("test [^{|}~–|] test"))
    ).to.be.false;
  });
  it("Articles shouldn't contain unsupported characters", () => {
    const order = wooOrdersGamerbulk[0] as WcOrder;
    const articles = Articles.createArticles(order);
    articles.forEach((article) => {
      expect(/[[\]^{|}~–]/g.test(article.Description)).to.be.false;
    });
  });

  it("Should remove Emojis from string", () => {
    const text = "Heart ❤️ Emoji";
    expect(removeEmojis(text).includes("❤️")).to.be.false;
  });

  it("Should remove Imposter 'ö' which is actually an 'o' with a umlaut pretending to be 'ö'", () => {
    const imposter = "ö"; // Sus
    const crewmate = "ö";

    expect(imposter).to.not.equal(crewmate);

    expect(imposter.replace(imposter, crewmate)).to.equal(crewmate);
    expect(sanitizeTextForFortnox(imposter)).to.not.equal(imposter)
  });
});
