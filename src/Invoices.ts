/* eslint-disable class-methods-use-this */
import type { RefundElement } from "wooconvert";
import type { Rate } from "./Accounts";
import Accounts from "./Accounts";
import Articles from "./Articles";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import WcOrders from "./WcOrders";
import type {
  Article,
  Invoice,
  InvoicePayment,
  InvoiceRow,
  InvoiceRowInit,
  Refund,
  WcOrder,
  WcOrderGiftCard,
} from "./types";
import type RefundItem from "./types/RefundItem";
import { formatDate } from "./utils";

export default abstract class Invoices {
  public static tryCanBeRefunded(invoice: Invoice): boolean {
    if (invoice.Cancelled === true) {
      throw new Error("Invoice has already been Cancelled.");
    } else if (invoice.Booked === true) {
      throw new Error("Invoice has not been Booked in Fortnox.");
    } else if (invoice.CreditInvoiceReference) {
      throw new Error("Invoice has an existing Credit Invoice");
    }
    return true;
  }

  public static tryGetInvoiceCurrencyAmount(invoice: Invoice): number {
    let calculatedTotal = 0;
    invoice.InvoiceRows.forEach((row) => {
      calculatedTotal += row.Price * (row.DeliveredQuantity ?? 1);
    });

    if (invoice.Total && invoice.Total !== calculatedTotal) {
      throw new Error(
        `Calculated Total: ${calculatedTotal} of Invoice does not match Fortnox assigned total: ${invoice.Total}`
      );
    }

    if (calculatedTotal === 0) {
      throw new Error(`Unexpected zero value total for Invoice`);
    }
    return calculatedTotal;
  }

  public static tryCreateInvoicePayment(
    invoice: Invoice,
    currencyRate: number | undefined | null,
    paymentDate: Date,
    paymentStatus: "completed" | "refunded" | string
  ): InvoicePayment {
    const currencyAmount = Invoices.tryGetInvoiceCurrencyAmount(invoice);
    const CurrencyRate = currencyRate ?? invoice.CurrencyRate;

    if (!/completed|refunded|partial refund/.test(paymentStatus)) {
      throw new TypeError(`Invalid value for paymentStatus: ${paymentStatus}`);
    }

    if (!CurrencyRate) {
      throw new TypeError(`Missing Currency Rate for Invoice Payment.`);
    }

    const invoicePayment: InvoicePayment = {
      InvoiceNumber: invoice.DocumentNumber,
      Amount: currencyAmount * CurrencyRate,
      AmountCurrency: currencyAmount,
      PaymentDate: formatDate(paymentDate),
      CurrencyRate,
      Currency: invoice.Currency,
      PaymentStatus: paymentStatus as "completed" | "refunded",
    };

    return invoicePayment;
  }

  public static tryGetHighestVATAccount(invoice: Invoice): {
    VAT: number;
    AccountNumber: number;
  } {
    let vat: number | undefined;
    let account: number | undefined;
    invoice.InvoiceRows.forEach((row: InvoiceRow) => {
      if (!vat || (row.VAT && row.VAT > vat)) {
        vat = row.VAT;
        account = row.AccountNumber;
      }
    });

    if (!vat || !account) {
      throw new Error(
        `Failed to find valid VAT or AccountNumber for Invoice ${
          invoice.DocumentNumber ?? ""
        }`
      );
    }
    return { VAT: vat, AccountNumber: account };
  }

  public static tryCreateRefundObject(
    invoice: Invoice,
    refunds: Refund[]
  ): RefundItem[] | undefined {
    const refundItems: RefundItem[] = [];

    for (const refund of refunds) {
      const { reason, id } = refund;
      const refundItem: RefundItem = { items: [], reason, id: id.toString() };

      let expectedAmount = 0;
      let actualAmount = 0;

      expectedAmount = parseFloat((refund as Refund).amount);

      if (expectedAmount <= 0) {
        throw new Error(
          `Unexpected Refund Amount: ${expectedAmount}, expected to be a positive number for refund: '${reason}'`
        );
      }

      const invoiceRowSimple = (item: InvoiceRow): InvoiceRowInit => {
        if (item.AccountNumber === undefined) {
          throw new Error(
            `Unexpected missing AccountNumber for InvoiceRow Item: ${item.ArticleNumber}, for refund: '${reason}'`
          );
        }

        if (item.VAT === undefined) {
          throw new Error(
            `Unexpected missing AccountNumber for InvoiceRow Item: ${item.ArticleNumber}, for refund: '${reason}'`
          );
        }

        if (item.DeliveredQuantity === undefined) {
          throw new Error(
            `Unexpected missing DeliveredQuantity for InvoiceRow Item: ${item.ArticleNumber}, for refund: '${reason}'`
          );
        }

        return {
          ArticleNumber: item.ArticleNumber,
          AccountNumber: item.AccountNumber as number,
          VAT: item.VAT,
          DeliveredQuantity: item.DeliveredQuantity as number,
          Price: item.Price,
        };
      };

      const defaultAccountAndVat = Invoices.tryGetHighestVATAccount(invoice);

      // if (refunds.length === 1) {
      if (refund.reason === "Refund Shipping") {
        for (const item of invoice.InvoiceRows) {
          if (item.ArticleNumber.startsWith("Shipping")) {
            refundItem.items.push(invoiceRowSimple(item));

            actualAmount += item.Price;
          }
        }
      } else if (/discount/i.test(reason)) {
        // TODO: Which account do we use when we apply discount?
        throw new Error(`Missing Implementation, for refund: '${reason}'`);

        refundItem.items.push({
          ArticleNumber: "Discount",
          Price: expectedAmount,
          DeliveredQuantity: 1,
          ...defaultAccountAndVat,
        });
        actualAmount = expectedAmount;
        /* } else {

          let ArticleNumber: string | undefined;

          if (reason.startsWith("Refunded, replaced with")) {
            ArticleNumber = "Refund.Replaced.Item";
          } else if (reason.startsWith("Wrong")) {
            ArticleNumber = "Refund.Wrong.Item";
          } else if (reason.startsWith("Shipment")) {
            ArticleNumber = "Refund.Shipment";
          } else {
            ArticleNumber = sanitizeTextForFortnox(
              reason.replace(",", ".").replace(" ", ".")
            );
          }
          refundItem.items.push({
            ArticleNumber,
            Price: expectedAmount,
            DeliveredQuantity: 1,
            ...defaultAccountAndVat,
          });
          actualAmount = expectedAmount;
          */
      } else {
        // Only keep items that match sku and price in refund
        for (const item of invoice.InvoiceRows) {
          if (item.Price > 0) {
            for (const refundLineItem of refund.line_items) {
              const refundPrice = -LineItems.getTotalWithTax(refundLineItem);

              if (refundLineItem.sku === item.ArticleNumber) {
                if (-refundPrice !== item.Price) {
                  throw new Error(
                    `Refund amount missmatch for ${
                      item.ArticleNumber
                    }, expected ${
                      item.Price
                    }, got ${-refundPrice}, for refund: '${reason}'`
                  );
                }

                refundItem.items.push(invoiceRowSimple(item));
                actualAmount += -refundPrice;
              }
            }
          }
        }
      }

      if (Math.abs(expectedAmount - actualAmount) > 0.000_000_1) {
        throw new Error(
          `Invalid Refund amount, expected: ${expectedAmount}, got: ${actualAmount}, for refund: '${reason}'`
        );
      }

      if (refundItem.items.length > 0) {
        refundItems.push(refundItem);
      }
    }
    return refundItems.length > 0 ? refundItems : undefined;
  }

  public static tryCreatePartialRefund(
    /* invoice: Invoice, */
    creditInvoice: Partial<Invoice>,
    refunds: Refund[] | RefundElement[]
  ): Partial<Invoice> {
    if (
      creditInvoice.Credit === false ||
      !creditInvoice.InvoiceRows ||
      !(creditInvoice.InvoiceRows?.length >= 0)
    ) {
      throw new Error("Credit Invoice for Partial refund is invalid.");
    }

    const creditRows = creditInvoice.InvoiceRows as InvoiceRow[];
    creditInvoice.InvoiceRows = [];
    creditInvoice.Credit = true;

    for (const refund of refunds) {
      const simpleRefund = !Object.prototype.hasOwnProperty.call(
        refund,
        "amount"
      );

      let expectedAmount = 0;
      let amount = 0;

      if (simpleRefund) {
        expectedAmount = parseFloat((refund as RefundElement).total);
      } else {
        expectedAmount = parseFloat((refund as Refund).amount);
      }

      if (refunds.length === 1 && simpleRefund) {
        if (refund.reason === "Refund Shipping") {
          for (const refundItem of creditRows) {
            if (refundItem.ArticleNumber.startsWith("Shipping")) {
              creditInvoice.InvoiceRows.push(refundItem);
              amount += refundItem.Price;
            }
          }
        } else if (/discount/i.test(refund.reason)) {
          // TODO: Which account do we use when we apply discount?
          throw new Error("Missing Implementation");
          creditInvoice.InvoiceRows = [
            {
              ArticleNumber: "Discount",
              Price: expectedAmount,
              AccountNumber: -1,
            },
          ];
          amount = expectedAmount;
          // } else if (refund.reason === "Refund") {
        } else {
          throw new Error(`Unexpected refund: ${refund.reason}`);
        }
      } else {
        // Only keep invoice rows that match item in refund
        for (const row of creditRows) {
          if (row.Price > 0) {
            for (const refundItem of (refund as Refund).line_items) {
              const refundPrice = LineItems.getTotalWithTax(refundItem);

              if (
                refundItem.sku === row.ArticleNumber &&
                refundPrice === -row.Price
              ) {
                const isReduced = LineItems.tryHasReducedRate(refundItem);
                const isGiftCard = LineItems.isGiftCard(refundItem);
                const hasVat = parseFloat(refundItem.total_tax) > 0;

                let vat = row.VAT;
                let accountNumber = row.AccountNumber;

                const vatCountry =
                  creditInvoice.DeliveryCountry ?? creditInvoice.Country;

                if (!vatCountry || vatCountry === "") {
                  throw new Error(
                    `Credit Invoice is missing valid Country for VAT: ${vatCountry}`
                  );
                }

                const vatCountryISO = CultureInfo.tryGetCountryIso(vatCountry);

                ({ vat, accountNumber } = isGiftCard
                  ? { vat: 0, accountNumber: 2421 }
                  : Accounts.getRate(vatCountryISO, isReduced));

                if (
                  vat * 100 !== row.VAT ||
                  accountNumber !== row.AccountNumber ||
                  (hasVat && vat > 0)
                ) {
                  throw new Error(
                    `Wrong calculated VAT for refunded Item in Credit Invoice: ${vat}%, ${accountNumber}, expected ${
                      row.VAT
                    }%, ${row.AccountNumber}${
                      hasVat ? "" : ". VAT should be 0% in both cases"
                    }`
                  );
                }

                creditInvoice.InvoiceRows?.push(row);
                amount += refundPrice;
              }
            }
          }
        }
      }

      // Verify that expected Refund amount match Credit Invoice rows
      if (-amount !== expectedAmount) {
        throw new Error(
          `Invalid Refund amount: -${amount}, expected: ${expectedAmount}`
        );
      }
    }

    return creditInvoice;
  }

  public static tryCreateRefundedCreditInvoice(
    invoice: Invoice,
    refunds: Refund[]
  ): Invoice {
    const creditInvoiceRows: InvoiceRow[] = [];

    for (const refund of refunds) {
      const expectedAmount = parseFloat(refund.amount);
      let actualAmount = 0;

      for (const item of refund.line_items) {
        // eslint-disable-next-line no-loop-func
        invoice.InvoiceRows.forEach((row) => {
          if (item.sku === row.ArticleNumber) {
            const totalPrice = -(
              parseFloat(item.total) + parseFloat(item.total_tax)
            );

            if (totalPrice > 0) {
              const refundedQuantity = Math.round(totalPrice / row.Price);
              const itemPrice = totalPrice / refundedQuantity;

              if (refundedQuantity * itemPrice !== totalPrice) {
                throw new Error(
                  `Calculated Item Price of ${itemPrice}, is inaccurate, ${refundedQuantity} * ${itemPrice} !== ${totalPrice}`
                );
              }

              actualAmount += totalPrice;

              creditInvoiceRows.push({
                ...row,
                Price: itemPrice,
                DeliveredQuantity: -refundedQuantity,
              });
            }
          }
        });
      }

      if (Math.abs(actualAmount - expectedAmount) > 0.000_001)
        throw new Error(
          `Failed to create Refund, expected: ${expectedAmount}, but instead got: ${actualAmount}`
        );
    }
    return { ...invoice, InvoiceRows: creditInvoiceRows };
  }

  public static tryCreateFullRefund(
    order: WcOrder,
    creditInvoice: Partial<Invoice>
  ): Partial<Invoice> {
    const invoiceRows: InvoiceRow[] = [];

    order.line_items.forEach((item): void => {
      const price = LineItems.getTotalWithTax(item);

      if (price > 0) {
        const account = Accounts.tryGetSalesRateForItem(order, item);
        invoiceRows.push({
          ArticleNumber: item.sku,
          DeliveredQuantity: -item.quantity,
          AccountNumber: account.accountNumber,
          Price: price,
        });
      }
    });
    return {
      ...creditInvoice,
      InvoiceRows: invoiceRows,
    };
  }

  private static tryGenerateCashPaymentInvoice(
    order: WcOrder,
    storefrontPrefix: "ND" | "GB",
    containsOnlyGiftCards = false
  ): Omit<Invoice, "CurrencyRate" | "InvoiceRows"> {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    const Country = CultureInfo.tryGetEnglishName(order.billing.country);

    let DeliveryCountry: string | undefined;

    if (!containsOnlyGiftCards) {
      DeliveryCountry = CultureInfo.tryGetEnglishName(order.shipping.country);
    }

    const InvoiceDate = new Date(order.date_paid).toLocaleDateString("sv-SE");
    const InvoiceType = paymentMethod === "Stripe" ? "INVOICE" : "CASHINVOICE";
    const PaymentWay = paymentMethod === "Stripe" ? undefined : "CASH";

    const YourOrderNumber = `${storefrontPrefix}-${order.id}`;

    return {
      InvoiceDate,
      DueDate: InvoiceDate,
      InvoiceType,
      PaymentWay,

      TermsOfPayment: "0",

      /* AccountingMethod: "CASH", */

      Currency: WcOrders.tryGetCurrency(order),

      Country,
      DeliveryCountry,

      VATIncluded: true,

      YourOrderNumber,
    };
  }

  private static tryGenerateInvoiceRows(
    order: WcOrder,
    paymentMethod: "Stripe" | "PayPal" | "GiftCard",
    strictVatCheck = true
  ): InvoiceRow[] {
    const invoiceRows: InvoiceRow[] = [];

    let highestRate: Rate = { vat: -1, accountNumber: -1 };

    order.line_items.sort((itemA, itemB): number => itemB.price - itemA.price);

    for (const item of order.line_items) {
      const isReduced = LineItems.tryHasReducedRate(item);
      const isGiftCard = LineItems.isGiftCard(item);

      const { vat, accountNumber } = isGiftCard
        ? { vat: 0, accountNumber: 2421 }
        : Accounts.getRate(order.billing.country, isReduced, paymentMethod);

      if (item.price > 0 && vat > highestRate.vat) {
        highestRate = { vat, accountNumber };
      }

      if (strictVatCheck) LineItems.tryVerifyRate(item, vat);

      invoiceRows.push({
        AccountNumber: accountNumber,
        VAT: parseFloat((vat * 100).toString().slice(0, 16)),
        ArticleNumber: item.sku,
        Description: Articles.sanitizeTextForFortnox(item.name),
        DeliveredQuantity: item.quantity,
        Price: LineItems.getTotalWithTax(item),
      });
    }

    if (highestRate.vat === -1) {
      throw new Error("Could not determine VAT of items in order.");
    }

    Invoices.tryAddShippingCost(invoiceRows, order, highestRate);
    Invoices.tryAddGiftCardExpense(invoiceRows, order);
    Invoices.tryAddRounding(invoiceRows, order);
    /*     Invoices.tryAddPaymentFeeCost(
      invoiceRows,
      order,
      currencyRate,
      paymentMethod
    );
 */
    return invoiceRows;
  }

  // NOTE: Unused
  private static tryAddPaymentFeeCost(
    invoiceRows: InvoiceRow[],
    order: WcOrder,
    currencyRate: number,
    paymentMethod: "Stripe" | "PayPal"
  ): void {
    let paymentFee: number | undefined;
    WcOrders.tryVerifyCurrencyRate(order, currencyRate);

    let currency: "SEK" | "USD" | "EUR" | undefined;

    let debit: number | undefined;

    if (paymentMethod === "Stripe") {
      const stripeCurrency = order.meta_data.find(
        (data) => data.key === "_stripe_currency"
      )?.value;

      if (stripeCurrency !== "SEK") {
        throw new Error(
          `Unxepected Currency for Stripe Charge: ${stripeCurrency}`
        );
      }
      paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);
      debit = paymentFee / currencyRate;
    } else {
      currency = WcOrders.tryGetCurrency(order);
      paymentFee =
        WcOrders.tryGetPaymentFee(order, paymentMethod) * currencyRate;

      if (currency === "SEK") {
        if (currencyRate !== 1) {
          throw new Error(
            `Invalid SEK Currency Rate for PayPal Payment Fee: ${currencyRate}`
          );
        }
      } else if (currencyRate === 1) {
        throw new Error(
          `Non SEK Currency: ${currency}, for PayPal Payment Fee expected valid Currency rate.`
        );
      }
      debit = paymentFee / currencyRate;
    }

    invoiceRows.push({
      AccountNumber: 6570,
      ArticleNumber: `PaymentFee.${paymentMethod}`,
      Description: `Payment Fee: ${order.id} via ${paymentMethod}`,
      DeliveredQuantity: 1,
      Price: -debit,
    });
  }

  public static hasGiftCardRedeem(invoice: Invoice): boolean {
    return invoice.InvoiceRows.some((item) =>
      item.ArticleNumber.includes("GIFTCARD-REDEEM")
    );
  }

  private static tryAddRounding(
    invoiceRows: InvoiceRow[],
    order: WcOrder
  ): void {
    const { total } = order;
    const ROUNDING_THRESHOLD = 0.05;
    const ROUNDING_MINIMUM = 0.01;

    const expectedTotal = WcOrders.tryGetAccurateTotal(
      order,
      ROUNDING_THRESHOLD
    );
    const diff = expectedTotal - parseFloat(total);

    if (diff === 0) return;

    // TODO: Should ROUNDING_THRESHOLD be the same for all Currencies?
    if (Math.abs(diff) > ROUNDING_THRESHOLD) {
      throw new Error(
        `Unexpected rounding ${diff}, expected total: ${
          expectedTotal ??
          WcOrders.tryGetAccurateTotal(order, ROUNDING_THRESHOLD)
        }, order total: ${total}`
      );
    }

    if (Math.abs(diff) > ROUNDING_MINIMUM) {
      invoiceRows.push({
        AccountNumber: 3740,
        ArticleNumber: "ROUNDING",
        Description: "Rounding",
        DeliveredQuantity: 1,
        Price: diff,
      });
    }
  }

  public static tryCreateGiftCardRedeemArticles(
    invoice: Invoice,
    allowEmpty = false
  ): Article[] {
    const articles: Article[] = [];

    invoice.InvoiceRows.forEach((item): void => {
      const { ArticleNumber, Description } = item;

      if (ArticleNumber.includes("GIFTCARD-REDEEM"))
        articles.push({ ArticleNumber, Description: Description ?? "" });
    });

    if (articles.length === 0) {
      if (allowEmpty) {
        return [];
      }
      throw new Error("Invoice is missing expected Gift Card Redeem");
    }

    return articles;
  }

  private static tryAddGiftCardExpense(
    invoiceRows: InvoiceRow[],
    order: WcOrder
  ): void {
    const { gift_cards } = order;

    if (!WcOrders.hasGiftCardsRedeem(order)) return;

    const storePrefix = WcOrders.getMetaDataValueByKey(
      order,
      "_storefront_prefix"
    );

    gift_cards?.forEach((card: WcOrderGiftCard) => {
      const { code } = card;
      invoiceRows.push({
        AccountNumber: 2421,
        ArticleNumber: `${
          storePrefix ? `${storePrefix}.` : ""
        }GIFTCARD-REDEEM.${code}`,

        Description: `${
          storePrefix ? `${storePrefix} - ` : ""
        }Gift Card Redeem: ${code}`,
        Price: -card.amount,
        DeliveredQuantity: 1,
      });
    });
  }

  private static tryAddShippingCost(
    invoiceRows: InvoiceRow[],
    order: WcOrder,
    rate: Rate
  ): void {
    const shippingCost = WcOrders.getShippingTotal(order);

    if (shippingCost === 0) {
      return;
    }

    const shippingTax = WcOrders.getShippingTax(order);
    const calculatedVat = Math.abs(shippingTax / shippingCost);

    if (calculatedVat - rate.vat > 1e-3) {
      const isReduced = calculatedVat < rate.vat;
      rate = Accounts.getRate(order.billing.country, isReduced);

      if (calculatedVat - rate.vat > 1e-3) {
        throw new Error(
          `Shipping Rate Missmatch: ${calculatedVat * 100}% VAT, expected ${
            rate.vat * 100
          }% VAT`
        );
      }
    }

    invoiceRows.push({
      AccountNumber: rate.accountNumber,
      ArticleNumber: "Shipping.Cost",
      Description: "Fraktkostnad",
      DeliveredQuantity: 1,
      Price: shippingCost + shippingTax,
      VAT: rate.vat * 100,
    });
  }

  public static tryCreateInvoice(
    order: WcOrder,
    currencyRate: number,
    storefrontPrefix: "GB" | "ND",
    expectedOrderStatus: "completed" | "refunded" | string = "completed",
    strictVatCheck = true
  ): Invoice {
    if (order.status !== expectedOrderStatus) {
      throw new Error(`Unexpected order status: '${order.status}'`);
    }

    if (!order.billing.email) {
      throw new Error("Order is missing customer email in 'billing'");
    }

    const { containsOnlyGiftCards } = WcOrders.tryGetGiftCardsPurchases(order);

    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    const invoice: Invoice = {
      ...this.tryGenerateCashPaymentInvoice(
        order,
        storefrontPrefix,
        containsOnlyGiftCards
      ),

      InvoiceDate: WcOrders.getPaymentDate(order),

      CurrencyRate: WcOrders.tryVerifyCurrencyRate(order, currencyRate),

      InvoiceRows: Invoices.tryGenerateInvoiceRows(
        order,
        paymentMethod,
        strictVatCheck
      ),
    };

    return invoice;
  }
}
