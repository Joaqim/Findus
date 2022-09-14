/* eslint-disable class-methods-use-this */
import type { RefundElement } from "wooconvert";
import type { Rate } from "./Accounts";
import Accounts from "./Accounts";
import Articles from "./Articles";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type {
  Invoice,
  InvoicePayment,
  InvoiceRow,
  Refund,
  WcOrder,
} from "./types";
import { formatDate } from "./utils";
import WcOrders from "./WcOrders";

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
    paymentDate: Date
  ): InvoicePayment {
    const currencyAmount = Invoices.tryGetInvoiceCurrencyAmount(invoice);
    const CurrencyRate = currencyRate ?? invoice.CurrencyRate;

    if (!CurrencyRate) {
      throw new TypeError(`Missing Currency Rate for Invoice Payment.`);
    }

    const invoicePayment: InvoicePayment = {
      InvoiceNumber: invoice.DocumentNumber,
      Amount: currencyAmount * CurrencyRate,
      AmountCurrency: currencyAmount,
      PaymentDate: formatDate(paymentDate),
      CurrencyRate,
    };

    return invoicePayment;
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
          DeliveredQuantity: item.quantity,
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
    order: WcOrder
  ): Omit<Invoice, "CurrencyRate" | "InvoiceRows"> {
    const orderId = order.id as string;

    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    const Country = CultureInfo.tryGetEnglishName(order.billing.country);
    const DeliveryCountry = CultureInfo.tryGetEnglishName(
      order.shipping.country
    );
    let orderPrefix: string | undefined;

    if (typeof order.id === "string" && !order.id.includes("-")) {
      orderPrefix = order.meta_data.find(
        (meta) => meta.key === "storefront_prefix"
      )?.value;
    }

    const invoiceDate = new Date(order.date_paid).toLocaleDateString("sv-SE");

    // TODO: Make PayPal branching better
    return {
      InvoiceDate: invoiceDate,
      DueDate: invoiceDate,
      InvoiceType: paymentMethod === "PayPal" ? "CASHINVOICE" : "INVOICE",
      PaymentWay: paymentMethod === "PayPal" ? "CASH" : undefined,

      TermsOfPayment: "0",

      /* AccountingMethod: "CASH", */

      Currency: WcOrders.tryGetCurrency(order),

      Country,
      DeliveryCountry,

      VATIncluded: true,

      YourOrderNumber: orderPrefix ? `${orderPrefix}-${orderId}` : orderId,

      // YourReference: "findus",

      // Customer
      /* CustomerName: WcOrders.tryGetCustomerName(order),
      DeliveryName: WcOrders.tryGetDeliveryName(order),
      EmailInformation: {
        EmailAddressTo: order.billing.email,
      },

      ...WcOrders.tryGetAddresses(order), */
    };
  }

  private static generateInvoiceRows(
    order: WcOrder,
    paymentMethod: "Stripe" | "PayPal"
  ): InvoiceRow[] {
    const invoiceRows: InvoiceRow[] = [];

    let highestRate: Rate = { vat: -1, accountNumber: -1 };

    order.line_items.sort((itemA, itemB): number => itemB.price - itemA.price);

    for (const item of order.line_items) {
      // const isReduced = item.price === 0 ?? LineItems.tryHasReducedRate(item);
      const isReduced = LineItems.tryHasReducedRate(item);
      const { vat, accountNumber } = Accounts.getRate(
        order.billing.country,
        isReduced,
        paymentMethod
      );

      if (item.price > 0 && vat > highestRate.vat) {
        highestRate = { vat, accountNumber };
      }

      // LineItems.tryVerifyRate(item, vat);

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
    /*     Invoices.tryAddPaymentFeeCost(
      invoiceRows,
      order,
      currencyRate,
      paymentMethod
    );
 */
    return invoiceRows;
  }

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

    /*
    if (
      !CultureInfo.isInsideEU(order.billing.country)
    ) {
      shippingTax = 0;
      /*
      throw new Error(
        `Unexpected shipping Tax for Order outside EU. Tax: ${shippingTax}, Country: ${order.billing.country}. Expected '0'`
      );
    }
    if (shippingTax !== 0) {
      const account = Accounts.tryGetSalesAccountForOrder(order);
      let accountNumber = 0;
      let vat = 0;

      const wooShippingRate = shippingTax / shippingCost;

      if (account.reduced?.vat.toFixed(3) === wooShippingRate.toFixed(3)) {
        accountNumber = account.reduced.accountNumber;
        vat = account.reduced.vat;
      } else if (
        account.standard?.vat.toFixed(3) === wooShippingRate.toFixed(3)
      ) {
        accountNumber = account.standard.accountNumber;
        vat = account.standard.vat;
      } else {
        throw new Error(
          `Shipping VAT Account not found. VAT: ${wooShippingRate}, expected either reduced: ${account.reduced?.vat}, or standard: ${account.standard.vat} - ${rate.vat}`
        );
      }

      invoiceRows.push({
        AccountNumber: accountNumber,
        ArticleNumber: "Shipping.Cost.VAT",
        Description: `Fraktkostnad - ${(vat * 100).toFixed(2)}% Moms`,
        DeliveredQuantity: 1,
        Price: shippingTax,
      });
    } */
  }

  public static tryCreateInvoice(
    order: WcOrder,
    currencyRate: number
    /* timezoneOffset?: number */
  ): Invoice {
    if (!order.billing.email) {
      throw new Error("Order is missing customer email in 'billing'");
    }

    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    const invoice: Invoice = {
      ...this.tryGenerateCashPaymentInvoice(order),

      // InvoiceDate: formatDate(order.date_paid, timezoneOffset),
      // InvoiceDate: new Date(order.date_paid).toISOString(),
      InvoiceDate: WcOrders.getPaymentDate(order),

      CurrencyRate: WcOrders.tryVerifyCurrencyRate(order, currencyRate),

      InvoiceRows: Invoices.generateInvoiceRows(order, paymentMethod),
      // InvoiceRows: [],
    };

    return invoice;
  }
}
