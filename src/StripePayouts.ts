import type { PayoutItemized, WcOrder } from "./types";
// import { parse } from "csv-string";

export default abstract class StripePayouts {
  public static tryGetOrderId(
    stripePayout: PayoutItemized,
    provider?: "ND" | "GB"
  ): string {
    const { description } = stripePayout;

    if (/refund/i.test(description)) return "";

    const result = /(\d{4,})$/m.exec(description);

    if (!result) {
      throw new Error(
        `Failed to get Order Id from Payout description: ${description}`
      );
    }
    const orderIdNr = result[0];

    if (provider) return `${provider}-${orderIdNr}`;

    if (description.includes("Gamerbulk")) {
      return `GB-${orderIdNr}`;
    }

    if (description.includes("NAU Shop")) {
      return `ND-${orderIdNr}`;
    }

    throw new Error(`Invalid Provider for Stripe Payout: ${description}`);
  }

  public static tryVerifyStripePayout(
    order: WcOrder,
    stripePayout: PayoutItemized
  ): void {
    try {
      const { exchange_rate } = stripePayout;

      if (
        Math.abs(
          parseFloat(order.total) * (exchange_rate ?? 1) -
            parseFloat(stripePayout.gross)
        ) > 0.1
      ) {
        throw new Error(
          `Order total '${
            parseFloat(order.total) * (exchange_rate ?? 1)
          }' does not match Stripe Payout gross: '${stripePayout.gross}'`
        );
      }

      const wcStripeFee = parseFloat(
        order.meta_data.find(({ key }) => key === "_stripe_fee")?.value
      );
      const wcStripeNet = parseFloat(
        order.meta_data.find(({ key }) => key === "_stripe_net")?.value
      );
      const wcStripeCurrency = order.meta_data.find(
        ({ key }) => key === "_stripe_currency"
      )?.value;

      if (wcStripeFee !== parseFloat(stripePayout.fee)) {
        throw new Error(
          `Order Stripe Fee '${wcStripeFee}' does not match Stripe Payout Fee: '${stripePayout.fee}'`
        );
      }

      if (wcStripeNet !== parseFloat(stripePayout.net)) {
        throw new Error(
          `Order Stripe Net '${wcStripeNet}' does not match Stripe Payout Net: '${stripePayout.net}'`
        );
      }

      if (wcStripeCurrency !== stripePayout.currency.toUpperCase()) {
        throw new Error(
          `Order Stripe Currency '${wcStripeCurrency}' does not match Stripe Payout Currency: '${stripePayout.currency.toUpperCase()}'`
        );
      }
    } catch (error) {
      throw new Error(
        `Failed to verify Stripe Payout: ${(error as Error).message}`
      );
    }
  }
}
