import type { Voucher, WcOrder } from "./types";
import WcOrders from "./WcOrders";

export default abstract class Vouchers {
  public static tryCreateVoucherForPaymentFee(
    order: WcOrder,
    currencyRate: number,
    paymentMethod_?: "Stripe" | "PayPal"
  ): Voucher {
    WcOrders.tryVerifyCurrencyRate(order, currencyRate);

    // let currency: "SEK" | "USD" | "EUR" | undefined;

    let debit: number | undefined;

    const paymentMethod = paymentMethod_ ?? WcOrders.tryGetPaymentMethod(order);
    const paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);

    if (paymentMethod === "Stripe") {
      const stripeCurrency = order.meta_data.find(
        (data) => data.key === "_stripe_currency"
      )?.value;

      if (stripeCurrency !== "SEK") {
        throw new Error(
          `Unxepected Currency for Stripe Charge: ${stripeCurrency}`
        );
      }
      debit = paymentFee;
    } else {
      debit = paymentFee * currencyRate;
    }

    return {
      Description: `Payment Fee: ${order.id} via ${paymentMethod}`,
      TransactionDate: WcOrders.getPaymentDate(order),
      VoucherSeries: "B",
      VoucherRows: [
        {
          Account: paymentMethod === "PayPal" ? 1940 : 1580,
          Debit: 0,
          Credit: debit,
        },
        {
          Account: 6570,
          Debit: debit,
          Credit: 0,
        },
      ],
    };
  }
}
