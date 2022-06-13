/* eslint-disable class-methods-use-this */
import Accounts, { Rate } from "./Accounts";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type { Invoice, InvoiceRow, MetaData, Refund, WcOrder } from "./types";
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

  public static tryCreatePartialRefund(
    order: WcOrder,
    /* invoice: Invoice, */
    creditInvoice: Partial<Invoice>,
    refund: Refund
  ): Partial<Invoice> {
    // TODO: this shouldn't be caught here - the credit invoice is
    // expected to be completely new.
    if (
      creditInvoice.Credit === false ||
      (creditInvoice.InvoiceRows && creditInvoice.InvoiceRows?.length > 0)
    ) {
      throw new Error("Credit Invoice for Partial refund is invalid.");
    }

    creditInvoice.InvoiceRows = [];

    const refundAmount = parseFloat(refund.amount);

    if (!refund.line_items && refundAmount > 0) {
      const taxLabels = WcOrders.tryGetTaxRateLabels(order.tax_lines);
      const rate = taxLabels.reduced ?? taxLabels.standard;
      /* creditInvoice.InvoiceRows.push({
      }); */
    }

    for (const item of refund.line_items) {
      const account = Accounts.tryGetSalesRateForItem(order, item);
      creditInvoice.InvoiceRows.push({
        AccountNumber: account.accountNumber,
        ArticleNumber: item.sku,
        VAT: account.vat,
        DeliveredQuantity: item.quantity,
        Price: LineItems.getTotalWithTax(item),
      });
    }

    return creditInvoice;
  }

  public static tryCreateFullRefund(
    order: WcOrder,
    creditInvoice: Partial<Invoice>
  ): Partial<Invoice> {
    const invoiceRows: InvoiceRow[] = [];

    order.line_items.forEach((item): void => {
      const account = Accounts.tryGetSalesRateForItem(order, item);
      invoiceRows.push({
        ArticleNumber: item.sku,
        DeliveredQuantity: item.quantity,
        AccountNumber: account.accountNumber,
        Price: LineItems.getTotalWithTax(item),
      });
    });
    return {
      ...creditInvoice,
      InvoiceRows: invoiceRows,
    };
  }

  private static tryGenerateCashPaymentInvoice(
    order: WcOrder
  ): Omit<Invoice, "Currency" | "CurrencyRate"> {
    const orderId = order.id.toString();

    const orderPrefix = order.meta_data.find(
      (meta: MetaData) => meta.key === "storefront_prefix"
    )?.value;

    return {
      InvoiceType: "CASHINVOICE",
      PaymentWay: "CARD",

      VATIncluded: true,
      YourOrderNumber: orderPrefix ? `${orderPrefix}-${orderId}` : orderId,

      OurReference: "Findus",
      InvoiceRows: [],

      // Customer
      CustomerName: WcOrders.tryGetCustomerName(order),
      DeliveryName: WcOrders.tryGetDeliveryName(order),
      EmailInformation: {
        EmailAddressTo: order.billing.email,
      },

      ...WcOrders.tryGetAddresses(order),
    };
  }

  private static generateInvoiceRows(
    order: WcOrder,
    paymentMethod?: string
  ): InvoiceRow[] {
    const invoiceRows: InvoiceRow[] = [];

    let highestRate: Rate | null = null;

    for (const item of order.line_items) {
      const isReduced = item.tax_class !== "reduced-rate";
      const { vat, accountNumber } = Accounts.getRate(
        order.billing.country,
        isReduced,
        paymentMethod ?? WcOrders.getPaymentMethod(order)
      );

      if (item.price > 0 && (!highestRate || vat > highestRate.vat)) {
        highestRate = { vat, accountNumber };
      }

      invoiceRows.push({
        AccountNumber: accountNumber,
        VAT: vat,
        ArticleNumber: item.sku,
        DeliveredQuantity: item.quantity,
        Price: LineItems.getTotalWithTax(item),
      });
    }

    if (highestRate === null) {
      throw new Error("Could not determine VAT of items in order.");
    }

    Invoices.tryAddShippingCost(invoiceRows, order, highestRate);

    return invoiceRows;
  }

  private static tryAddShippingCost(
    invoiceRows: InvoiceRow[],
    order: WcOrder,
    rate: Rate
  ) {
    const shippingCost = parseFloat(order.shipping_total);
    const shippingTax = parseFloat(order.shipping_total);
    if (!CultureInfo.isInsideEU(order.billing.country) && shippingTax !== 0) {
      throw new Error(
        `Unexpected shipping Tax for Order outside EU: Tax: ${shippingTax}, Country: ${order.billing.country}. Expected '0'`
      );
    }

    if (shippingCost !== 0) {
      invoiceRows.push({
        AccountNumber: 5710,
        ArticleNumber: "Shipping.Cost",
        // This shouldn't be needed as 5710 has no pre-defined VAT
        VAT: 0,
        Price: shippingCost,
      });
      if (shippingTax !== 0) {
        invoiceRows.push({
          AccountNumber: rate.accountNumber,
          ArticleNumber: "Shipping.Cost.VAT",
          // Do not calculated VAT for this row
          VAT: 0,
          Price: shippingTax,
        });
      }
    }
  }

  public static tryAddPaymentFee(
    invoiceRows: InvoiceRow[],
    order: WcOrder,
    rate: Rate,
    paymentMethod: "Stripe" | "PayPal"
  ) {
    let paymentFee: number | undefined;

    const getMetaData = (
      metaDatas: MetaData[],
      key: string
    ): MetaData | undefined =>
      metaDatas.find((value: MetaData) => value.key === key);

    if (paymentMethod === "Stripe") {
      paymentFee = parseFloat(
        getMetaData(order.meta_data, "_stripe_fee")?.value as string
      );
    } else if (paymentMethod === "PayPal") {
      paymentFee = parseFloat(
        getMetaData(order.meta_data, "_paypal_transaction_fee")?.value as string
      );
    }

    if (
      !paymentFee ||
      paymentFee <= 0 ||
      paymentFee >= parseFloat(order.total)
    ) {
      throw new Error(
        `Unexpected fee amount for '${paymentMethod}': ${paymentFee}`
      );
    }

    /*
    let salesAccount = Accounts.getVatAccount(
      order.billing.country,
      paymentMethod
    );

    invoiceRows.push({
      ArticleNumber: `Payment.Fee.${paymentMethod}`,
      AccountNumber: salesAccount.standard.accountNumber,
      Price: paymentFee,
      Description: `${paymentMethod} Avgift - Utgående`,
    });
    */

    invoiceRows.push({
      AccountNumber: 6570,
      ArticleNumber: `Payment.Fee.${paymentMethod}`,
      Price: paymentFee,
      Description: `${paymentMethod} Avgift`,
    });
  }

  public static tryCreateInvoice(order: WcOrder, currencyRate = 1): Invoice {
    const invoice: Invoice = {
      ...this.tryGenerateCashPaymentInvoice(order),

      InvoiceDate: new Date(order.date_paid),

      Currency: order.currency.toUpperCase(),

      CurrencyRate: WcOrders.tryVerifyCurrencyRate(order, currencyRate),

      OurReference: "findus",

      InvoiceRows: Invoices.generateInvoiceRows(order),

      // Customer
      CustomerName: WcOrders.tryGetCustomerName(order),
      DeliveryName: WcOrders.tryGetDeliveryName(order),

      // Billing and Shipping Addresses
      ...WcOrders.tryGetAddresses(order),

      // Shipping cost
      Freight: parseFloat(order.shipping_total),
    };
    return invoice;
  }
}
