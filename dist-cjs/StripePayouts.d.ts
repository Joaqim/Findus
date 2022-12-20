import type { PayoutItemized, WcOrder } from "./types";
export default abstract class StripePayouts {
    static tryGetOrderId(stripePayout: PayoutItemized, provider?: "ND" | "GB"): string;
    static tryVerifyStripePayout(order: WcOrder, stripePayout: PayoutItemized): void;
}
