import type { Voucher, WcOrder } from "./types";
export default abstract class Vouchers {
    static tryCreateVoucherForPaymentFee(order: WcOrder, currencyRate: number, storefrontPrefix: "ND" | "GB", paymentMethod_?: "Stripe" | "PayPal"): Voucher;
}
