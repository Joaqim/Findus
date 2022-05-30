/* eslint-disable class-methods-use-this */
import Accounts from "./Accounts";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type { Invoice, InvoiceRow, Refund, WcOrder } from "./types";
import WcOrders from "./WcOrders";

export default abstract class Invoices {
  public static tryCanBeRefunded(invoice: Invoice) {
    if (invoice.Cancelled === true) {
      throw new Error("Invoice has already been Cancelled.");
    } else if (invoice.Booked == true) {
      throw new Error("Invoice has not been Booked in Fortnox.");
    } else if (invoice.CreditInvoiceReference) {
      throw new Error("Invoice has an existing Credit Invoice");
    }
  }

  public tryCreatePartialRefund(
    order: WcOrder,
    /*invoice: Invoice,*/
    creditInvoice: Invoice,
    refunds: Refund[]
  ): Invoice {
    if (refunds.length === 0) {
      throw new Error("Order does not have refunds.");
    } else if (refunds.length !== 1) {
      throw new Error(
        "Partial Refund for previously refunded order is not supported."
      );
    }

    // TODO: this shouldn't be caught here - the credit invoice is
    // expected to be completely new.
    if (
      creditInvoice.Credit === false ||
      creditInvoice.InvoiceRows?.length > 0
    ) {
      throw new Error("Credit Invoice for Partial refund is invalid.");
    }

    for (const refund of refunds) {
      // TODO: this might not be neccessary
      // TODO: make type definitions non-opts match Fortnox specification.
      if (!creditInvoice.InvoiceRows) {
        creditInvoice.InvoiceRows = [];
      }

      if(!refund.lineItems) {
        throw new Error("Order is not partially refunded.")
      }

      for (const item of refund.lineItems) {
        const acc = Accounts.tryGetSalesRateForItem(order, item);
        creditInvoice.InvoiceRows.push({
          AccountNumber: acc.accountNumber,
          ArticleNumber: item.sku,
          VAT: acc.vat,
          DeliveredQuantity: item.quantity,
          Price: LineItems.getTotalWithTax(item),
        });
      }
    }

    return creditInvoice;
  }

  public tryCreateRefund(
    order: WcOrder,
    currencyRate: number,
    customerNumber?: string
  ): Invoice {
    const invoiceRows: InvoiceRow[] = [];

    order.lineItems.forEach((item): InvoiceRow => {
      const acc = Accounts.tryGetSalesRateForItem(order, item);
      return {
        ArticleNumber: item.sku,
        DeliveredQuantity: item.quantity,
        AccountNumber: acc.accountNumber,
        Price: LineItems.getTotalWithTax(item),
      };
    });
    return {
      InvoiceType: "CASHINVOICE",
      InvoiceDate: new Date(),
      PaymentWay: "CARD",
      VATIncluded: true,

      Currency: order.currency,
      CurrencyRate: currencyRate,

      CustomerNumber: customerNumber,
      YourOrderNumber: order.id.toString(),

      OurReference: "Findus-JS",

      InvoiceRows: invoiceRows,

      CustomerName: WcOrders.getCustomerName(order),
      ...WcOrders.tryGetAddresses(order),
    };
  }

  public createInvoice(order: WcOrder, currencyRate = 1): Invoice | null {
    const currency = order.currency;

    if (currency.toUpperCase() === "SEK" && currencyRate !== 1)
      throw new Error(`Unexpected Currency Rate for SEK: ${currencyRate}`);

    // eslint-disable-next-line no-useless-catch
    try {
      const countryIso = order.billing.country;
      const country = CultureInfo.tryGetEnglishName(countryIso);
      const deliveryCountry = CultureInfo.tryGetEnglishName(
        order.billing.country
      );

      const paymentMethod = WcOrders.getPaymentMethod(order);

      const shippingCost = parseFloat(order.shippingTotal);

      const invoiceRows: InvoiceRow[] = [];

      let highestRate = 0;

      for (const item of order.lineItems) {
        const isReduced = item.taxClass !== "reduced-rate";
        const { vat, accountNumber } = Accounts.getRate(
          countryIso,
          isReduced,
          paymentMethod
        );

        if (vat > highestRate) {
          highestRate = vat;
        }

        invoiceRows.push({
          AccountNumber: accountNumber,
          VAT: vat,
          ArticleNumber: item.sku,
          DeliveredQuantity: item.quantity,
          Price: LineItems.getTotalWithTax(item),
        });
      }

      const invoice: Invoice = {
        InvoiceType: "CASHINVOICE",
        InvoiceDate: order.datePaid,
        PaymentWay: "CARD",

        VATIncluded: true,

        Currency: currency,
        CurrencyRate: currencyRate,
        YourOrderNumber: order.id.toString(),

        OurReference: "Findus-JS",
        // externalInvoiceReference1 = order.id.toString()
        InvoiceRows: [],

        // Customer
        CustomerName: WcOrders.getCustomerName(order),
        ...WcOrders.tryGetAddresses(order),

        // Shipping cost
        Freight: shippingCost,
      };
      return invoice;
    } catch (error) {
      throw error;
    }
  }
}
