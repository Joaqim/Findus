import { expect } from "chai";
import { WcOrder } from "wooconvert";
import { InvoiceRow, Invoices, WcOrders, WooConvert } from "../src";

import orderWithOnlyGiftCard from "./data/order_with_only_gift_cards.json";
import orderWithRedeemedGiftCard from "./data/order_with_redeemed_gift_card.json";
import orderWithRoundingMissmatch from "./data/order_with_rounding_missmatch.json";

import wooOrders from "./orders.mock.json";

const toOrder = (orderObject: object): WcOrder => orderObject as WcOrder; //WooConvert.toWcOrder(JSON.stringify(orderObject));

describe("Invoices", () => {
  it("Order can be partially refunded", () => {
    const completedOrder = WooConvert.toWcOrder(
      JSON.stringify(wooOrders.data[0])
    );
  });

  it("Can create Invoice from Order with _only_ gift cards purchases", () => {
    const order = toOrder(orderWithOnlyGiftCard);
    const { hasGiftCards, containsOnlyGiftCards, giftCards, amountCurrency } =
      WcOrders.tryGetGiftCardsPurchases(order);

    expect(hasGiftCards).to.be.true;
    expect(containsOnlyGiftCards).to.be.true;
    expect(Array.isArray(giftCards) && giftCards.length > 0);
    expect(parseFloat(giftCards[0].total)).to.eq(amountCurrency);
    expect(giftCards[0].total).to.equal(order.total);

    const invoice = Invoices.tryCreateInvoice(order, 10.2345, "completed");

    expect(() => Invoices.tryCreateGiftCardRedeemArticles(invoice)).to.throw(
      "Invoice is missing expected Gift Card Redeem"
    );

    const { InvoiceRows } = invoice;
    expect(InvoiceRows.length).to.equal(1);

    expect(InvoiceRows[0].ArticleNumber.includes("GIFTCARD"));

    expect(InvoiceRows[0]).to.deep.equal(<InvoiceRow>{
      AccountNumber: 2421,
      ArticleNumber: "GAMERBULK-GIFTCARD001",
      DeliveredQuantity: 1,
      Description: "€25 GIFT CARD",
      Price: 25,
      VAT: 0,
    });
  });

  it("Can create Invoice with total cost miss-match and add Rounding 'Article'", () => {
    const order = toOrder(orderWithRoundingMissmatch);
    const invoice = Invoices.tryCreateInvoice(order, 10.2345, "completed", 94.4);
    const roundingArticleRow = invoice.InvoiceRows.find(
      (i) => i.ArticleNumber === "ROUNDING"
    );

    expect(roundingArticleRow).to.not.be.undefined;
    expect(roundingArticleRow).to.deep.equal(<InvoiceRow>{
      AccountNumber: 3740,
      ArticleNumber: "ROUNDING",
      Description: "Rounding",
      DeliveredQuantity: 1,
      ...roundingArticleRow,
    });

    expect(roundingArticleRow?.Price).to.be.gt(0.01);
    expect(roundingArticleRow?.Price).to.be.lt(0.05000000000000001);
  });

  it("Can create Invoice from Order with only purchases with _redeemed_ gift card", () => {
    const order = toOrder(orderWithRedeemedGiftCard);
    const invoice = Invoices.tryCreateInvoice(order, 10.2345, "completed");

    expect(Invoices.hasGiftCardRedeem(invoice)).to.be.true;

    const giftCardRedeemArticles =
      Invoices.tryCreateGiftCardRedeemArticles(invoice);

    expect(giftCardRedeemArticles).to.be.not.undefined;

    console.log({ giftCardRedeemArticles });

    const { InvoiceRows } = invoice;
    expect(
      InvoiceRows.some((item) => item.ArticleNumber.includes("GIFTCARD-REDEEM"))
    ).to.be.true;
  });
});
