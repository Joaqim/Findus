import type { SupplierInvoice, WcOrder } from "./types";
import WcOrders from "./WcOrders";

export default class SupplierInvoices {
  private static tryCreateBasicSupplierInvoice(
    order: WcOrder,
    currency: "SEK" | "USD" | "EUR",
    currencyRate?: number
  ): SupplierInvoice {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);
    const dateString = new Date(
      order.date_paid as unknown as string
    ).toLocaleDateString("sv-SE");

    if (currencyRate === 100) {
      throw new Error("Placeholder");
    }

    return {
      InvoiceNumber: order.id as string,
      Currency: currency,
      // CurrencyRate: currencyRate,
      InvoiceDate: dateString,
      DueDate: dateString,
      // SupplierNumber: WcOrders.tryGetPaymentMethod(order),
      SupplierNumber: paymentMethod === "PayPal" ? "54" : "55",

      SalesType: "STOCK",
      SupplierInvoiceRows: [],
    };
  }

  public static tryCreatePaymentFeeInvoice(
    order: WcOrder,
    currencyRate = 1
  ): SupplierInvoice {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    if (paymentMethod === "GiftCard") {
      throw new Error("Cannot create payment fee for Gift Card purchases");
    }

    const expense = WcOrders.tryCreatePaymentFeeExpense(
      order,
      currencyRate,
      paymentMethod
    );
    let currency: "SEK" | "USD" | "EUR" | undefined;

    if (paymentMethod === "Stripe") {
      const stripeCurrency = order.meta_data.find(
        (data) => data.key === "_stripe_currency"
      )?.value;

      if (stripeCurrency !== "SEK") {
        throw new Error(
          `Unxepected Currency for Stripe Charge: ${stripeCurrency}`
        );
      }
      currency = "SEK";
      currencyRate = 1;
    } else {
      currency = WcOrders.tryGetCurrency(order);

      if (currency === "SEK") {
        if (currencyRate !== 1) {
          throw new Error(
            `Invalid SEK Currency Rate for Supplier Invoice: ${currencyRate}`
          );
        }
      } else if (currencyRate === 1) {
        throw new Error(
          `Non SEK Currency: ${currency}, for '${paymentMethod}' fee, Supplier Invoice expects valid Currency rate`
        );
      }
    }

    const invoice = SupplierInvoices.tryCreateBasicSupplierInvoice(
      order,
      currency,
      currencyRate
    );

    invoice.Total = expense.Debit;

    return invoice;
  }
}
