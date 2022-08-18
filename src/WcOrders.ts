import type { Rate } from "./Accounts";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type {
  Customer,
  Expense,
  WcOrder,
  WcOrderLineItem,
  WcOrderMetaData,
  WcOrderTaxLine,
} from "./types";
import type { Required } from "./utils";
import { removeEmojis, sanitizeTextForFortnox } from "./utils";

export interface TaxLabel {
  vat: number;
  label?: string;
}

// const DECIMAL_PRECISION_CURRENCY_RATE = 14;

abstract class WcOrders {
  public static tryVerifyOrder(order: WcOrder): void {
    if (!order.prices_include_tax) {
      throw new Error(
        `Unexpected: 'prices_include_tax' is ${false}, expected: true`
      );
    }
  }

  public static filterMetaDataByKeys(
    meta_data: WcOrderMetaData[],
    filtered_keys: string[]
  ): WcOrderMetaData[] {
    return meta_data.filter((datum) => filtered_keys.includes(datum.key));
  }

  public static hasInvoiceReference = (order: WcOrder): boolean =>
    order.meta_data.findIndex(
      ({ key }) => key === "_fortnox_invoice_reference"
    ) !== -1;

  public static getInvoiceReference = (order: WcOrder): string | undefined =>
    order.meta_data.find(({ key }) => key === "_fortnox_invoice_reference")
      ?.value;

  public static tryCreatePaymentFeeExpense(
    order: WcOrder,
    currencyRate: number
  ): Expense {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);
    const paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);

    if (
      !paymentFee ||
      paymentFee <= 0 ||
      paymentFee >= parseFloat(order.total)
    ) {
      throw new Error(
        `Unexpected fee amount for '${paymentMethod}': ${paymentFee}`
      );
    }

    const expenseCodes = {
      PayPal: "PAPLFE",
      Stripe: "STRPFE",
    };

    return {
      Code: expenseCodes[paymentMethod],
      Text: `Betalningsavgift: ${order.id} via ${paymentMethod}`,
      Account: 6570,
      Debit: paymentFee,
      Currency: WcOrders.tryGetCurrency(order),
      CurrencyRate: WcOrders.tryVerifyCurrencyRate(order, currencyRate),
    };
  }

  public static tryGetPaymentFee(
    order: WcOrder,
    paymentMethod: string
  ): number {
    let paymentFee: number | undefined;

    const getMetaData = (
      metaDatas: WcOrderMetaData[],
      key: string
    ): WcOrderMetaData | undefined =>
      metaDatas.find((value: WcOrderMetaData) => value.key === key);

    if (paymentMethod === "Stripe") {
      paymentFee = parseFloat(
        getMetaData(order.meta_data, "_stripe_fee")?.value as string
      );
    } else if (paymentMethod === "PayPal") {
      paymentFee = parseFloat(
        getMetaData(order.meta_data, "_paypal_transaction_fee")?.value as string
      );
    }

    if (!paymentFee) {
      throw new Error(`Missing '${paymentMethod}' Payment Fee.`);
    }

    return paymentFee;
  }

  public static hasPaymentFee(order: WcOrder, paymentMethod: string): boolean {
    const paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);
    return typeof paymentFee === "number" && paymentFee > 0;
  }

  public static getShippingTotal(order: WcOrder): number {
    return typeof order.shipping_total === "string"
      ? parseFloat(order.shipping_total)
      : order.shipping_total;
  }

  public static getShippingTax(order: WcOrder): number {
    return typeof order.shipping_tax === "string"
      ? parseFloat(order.shipping_tax)
      : order.shipping_tax;
  }

  public static tryGetPaymentMethod(order: WcOrder): "Stripe" | "PayPal" {
    const { payment_method } = order;

    /*
    if (!paymentMethod || paymentMethod === "") {
      throw new Error("Beställningen behöver bokföras manuellt.");
    }
    */
    // NOTE: Matches stripe & stripe_{bancontant,ideal,sofort}, but not *_stripe

    if (/^stripe\S*/i.test(payment_method)) {
      return "Stripe";
    }
    // NOTE: Matches paypal & (ppec_paypal)_paypal, but not paypal_*

    if (/^\S*paypal$/i.test(payment_method)) {
      return "PayPal";
    }

    if (order.created_via === "admin") {
      throw new Error("Order was created manually by 'admin'.");
    }

    throw new Error(
      `Unexpected Payment Method: '${payment_method}', '${order.payment_method_title}. Order was created by '${order.created_via}'`
    );
  }

  public static tryGetAccurateTotal(order: WcOrder): number {
    let total = 0;
    order.line_items.forEach((item) => {
      total += item.price * item.quantity + LineItems.getAccurateTaxTotal(item);
    });

    // TODO: Is this correct?
    total += WcOrders.getShippingTotal(order) + WcOrders.getShippingTax(order);

    const diff = Math.abs(total - parseFloat(order.total));

    // NOTE: Less accurate for Naudrinks orders
    /* if (typeof order.id === "string" && order.id.includes("ND")) {
      if (diff >= 0.001) {
        throw new Error(
          `WooCommerce order total does not match calculated total. Difference: ${total}, ${order.total} = ${diff}`
        );
      }
      return total;
    } */

    // Should not deviate more than 1-E13 from WooCommerce total cost
    if (diff > 0.000_000_000_000_1) {
      if (diff >= 0.01) {
        throw new Error("Critical Error!");
      }
      throw new Error(
        `WooCommerce order total does not match calculated total. Difference: WooCommerce: ${order.total}, calculated: ${total} = ${diff}`
      );
    }

    return total;
  }

  public static tryVerifyCurrencyRate(
    order: WcOrder,
    currencyRate?: number
  ): number | undefined {
    if (order.currency === "SEK") {
      if (currencyRate && currencyRate !== 1)
        throw new Error(`Unexpected Currency Rate for SEK: ${currencyRate}`);
      return 1;
    }

    if (currencyRate) {
      return currencyRate;
    }

    try {
      return WcOrders.tryGetCurrencyRate(order);
    } catch {
      return undefined;
    }
  }

  public static tryGetCurrency(order: WcOrder): "SEK" | "EUR" | "USD" {
    if (!/SEK|EUR|USD/.test(order.currency)) {
      throw new Error(
        `Unexpected Currency: ${order.currency}, expected: SEK, EUR or USD.`
      );
    }
    return order.currency as "SEK" | "EUR" | "USD";
  }

  public static tryGetCurrencyRate(
    order: WcOrder,
    accurateTotal?: number
  ): number {
    const paymentMethod = WcOrders.tryGetPaymentMethod(order);

    if (paymentMethod !== "Stripe") {
      throw new Error(
        `Findus can only deduce Currency Rate with Stripe payments. Unsupported payment method: ${paymentMethod} - ${order.payment_method_title}`
      );
    }

    if (
      order.meta_data.some((d) => d.key === "_stripe_refund_id") ||
      (order.refunds.length > 0 &&
        order.refunds.reduce(
          (total, current) => total + parseFloat(current.total ?? "0"),
          0
        ) !== 0)
    ) {
      throw new Error(
        "Cannot deduce Stripe Currency Rate if Order is partially refunded."
      );
    }

    const stripeCharge = order.meta_data.find(
      (d) => d.key === "_stripe_charge_captured"
    )?.value as string;
    const stripeFee = order.meta_data.find((d) => d.key === "_stripe_fee")
      ?.value as string;
    const stripeNet = order.meta_data.find((d) => d.key === "_stripe_net")
      ?.value as string;
    const stripeCurrency = order.meta_data.find(
      (d) => d.key === "_stripe_currency"
    )?.value as string;

    if (!stripeCharge || parseFloat(stripeCharge) <= 0) {
      throw new Error(
        `Unexpected: Order 'meta_data' of key '_stripe_charge_captured' has value '${stripeCharge}' `
      );
    }

    if (!stripeFee || parseFloat(stripeFee) <= 0) {
      throw new Error(
        `Unexpected: Order 'meta_data' of key '_stripe_fee' has value '${stripeFee}' `
      );
    }

    if (!stripeNet || parseFloat(stripeNet) < 0) {
      throw new Error(
        `Unexpected: Order 'meta_data' of key '_stripe_net' has value '${stripeNet}' `
      );
    }

    if (!stripeCurrency) {
      throw new Error(
        `Unexpected: Order 'meta_data' of key '_stripe_currency' has value '${stripeCurrency}' `
      );
    }

    if (stripeCurrency !== "SEK") {
      throw new Error(
        `Stripe Payment with currency: ${stripeCurrency} is unexpected`
      );
    }

    if (`${order.currency}-${stripeCurrency}` === "SEK-SEK") return 1;

    const total = accurateTotal ?? WcOrders.tryGetAccurateTotal(order);
    const stripeCurrencyRate =
      (parseFloat(stripeFee) + parseFloat(stripeNet)) / total;

    if (stripeCurrencyRate <= 0.5) {
      throw new Error(
        `Invalid calculated currency rate for Stripe payment: ${stripeCurrencyRate}`
      );
    }

    return stripeCurrencyRate;
  }

  public static verifyRateForItem(
    order: WcOrder,
    rate: Rate,
    item: WcOrderLineItem
  ): TaxLabel {
    if (rate.vat === 0) {
      return { vat: 0, label: "0% Vat" };
    }

    const taxRates = WcOrders.tryGetTaxRateLabels(order.tax_lines);
    let taxLabel: TaxLabel;

    if (Object.is(taxRates.standard, taxRates.reduced)) {
      taxLabel = taxRates.standard;
    } else {
      if (item.tax_class === "") {
        throw new Error(
          `Unexpected empty tax class for item: '${item.name}', expected either 'normal-rate' or 'reduced-rate'`
        );
      }
      const isStandard = item.tax_class !== "reduced-rate";
      taxLabel = isStandard ? taxRates.standard : taxRates.reduced;
    }

    if (rate.vat !== taxLabel.vat) {
      throw new Error(
        `VAT Rate miss-match, expected value: ${rate.vat} VAT, but WooCommerce gave: ${taxLabel.vat}% VAT, with label: ${taxLabel.label}`
      );
    }
    return taxLabel;
  }

  public static getPaymentDate = (order: WcOrder): string =>
    new Date(order.date_paid).toLocaleDateString("sv-SE");

  public static getTaxRate(tax: WcOrderTaxLine): number {
    const taxLabel = tax.label;

    try {
      // eslint-disable-next-line unicorn/no-unsafe-regex
      const regex = /(?:\d+(?:\.\d*)?|\.\d+)%/;
      // Throws error on undefined
      const vat = regex.exec(taxLabel);

      if (!vat || vat.length !== 1) {
        throw new Error(
          `Could not parse VAT Percentage from Tax Label: ${taxLabel}`
        );
      }
      return parseFloat(vat[0]) / 100;
    } catch {
      throw new Error(`Unexpected Tax label: ${taxLabel}`);
    }
  }

  public static tryGetTaxRateLabels(taxes: WcOrderTaxLine[]): {
    standard: TaxLabel;
    reduced: TaxLabel;
  } {
    let labels: TaxLabel[] = [];

    taxes.forEach((tax: WcOrderTaxLine) => {
      const vat = WcOrders.getTaxRate(tax);
      const taxLabel = { vat, label: tax.label };

      if (!taxLabel) {
        throw new Error("Missing tax label");
      }

      // Make sure lowest VAT is the last value in tuple
      if (labels[0]?.vat >= vat) labels.push(taxLabel);
      else labels = [taxLabel, ...labels];
    });

    return { standard: labels[0], reduced: labels[1] };
  }

  public static getDocumentSource(order: WcOrder): string | null {
    return order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "pdf_invoice_source"
    )?.value as string;
  }

  public static getStorefrontUrl(order: WcOrder): string | undefined {
    return order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "storefront_url"
    )?.value as string;
  }

  public static getStorefrontPrefix(order: WcOrder): string | undefined {
    return order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "storefront_prefix"
    )?.value as string;
  }

  public static tryGetDocumentLink(
    order: WcOrder,
    storefrontUrl?: string
  ): string {
    // Try to get Document link from metadata
    const pdfLink = order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "_wcpdf_document_link"
    )?.value as string;

    if (pdfLink && pdfLink !== "") {
      return pdfLink;
    }
    // Try to get Order key from metadata
    let orderKey = order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "_wc_order_key"
    )?.value;

    if (!orderKey) {
      orderKey = order.order_key;
    }

    if (!orderKey) {
      throw new Error(`Order is missing document_link and order_key`);
    }

    if (!storefrontUrl) {
      const storeUrl = WcOrders.getStorefrontUrl(order);

      if (!storeUrl) {
        throw new Error(`Could not get 'storefront_url' from order meta_data`);
      }

      let orderId = order.id;

      // Remove optional storefront_prefix from order ID
      if (typeof orderId === "string" && orderId.includes("-")) {
        orderId = orderId.split("-")[1];
      }

      return `${storeUrl}/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&template_type=invoice&order_ids=${orderId}&order_key=${orderKey}`;
    }

    return `${storefrontUrl}/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&template_type=invoice&order_ids=${order.id}&order_key=${orderKey}`;
  }

  public static tryGetInvoiceReference(order: WcOrder): number {
    if (!order.meta_data) return 0;
    const reference = order.meta_data.find(
      (entry: WcOrderMetaData) => entry.key === "_fortnox_invoice_number"
    )?.value as string;

    if (!reference) {
      throw new Error(
        `Order is missing '_fortnox_invoice_number' referenced in meta data.`
      );
    }
    return parseInt(reference, 10);
  }

  public static tryCanBeRefunded(order: WcOrder): boolean {
    if (order.status === "completed" && order.refunds?.length === 0) {
      throw new Error(
        "Order status is 'completed' but has no partial refunds."
      );
    } else if (order.status !== "refunded") {
      throw new Error(
        `Unexpected order status: '${order.status}', expected full refund 'refunded' or partial refund 'completed'.`
      );
    }
    return true;
  }

  public static tryGetCustomerName(order: WcOrder): string {
    try {
      return this.tryGetBillingName(order);
    } catch {
      try {
        return this.tryGetDeliveryName(order);
      } catch {
        throw new Error(
          `Order is missing customer name for 'billing' and failed to fallback to 'shipping'`
        );
      }
    }
  }

  public static tryGetDeliveryName(order: WcOrder): string {
    if (order.shipping.first_name || order.shipping.last_name) {
      return removeEmojis(
        `${order.shipping.first_name} ${order.shipping.last_name}`
      ).trim();
    }
    throw new Error(`Order is missing customer name for shipping`);
  }

  public static tryGetBillingName(order: WcOrder): string {
    if (order.billing.first_name || order.billing.last_name) {
      return removeEmojis(
        `${order.billing.first_name} ${order.billing.last_name}`
      ).trim();
    }
    throw new Error(`Order is missing customer name for billing`);
  }

  public static tryGetCustomerEmail(order: WcOrder): string {
    // TODO: Verify email is valid
    if (order.billing.email) {
      return order.billing.email;
    }
    throw new Error(`Order is missing customer email in billing.`);
  }

  public static tryGetCustomerAddresses(
    order: WcOrder
  ): Required<Customer, "CountryCode" | "DeliveryCountryCode"> {
    const CountryCode = CultureInfo.tryGetCountryIso(order.billing.country);

    const DeliveryCountryCode = CultureInfo.tryGetCountryIso(
      order.shipping.country
    );

    if (!CountryCode) {
      throw new Error(
        `Failed to create customer, failed to determine 'order.billing.country'`
      );
    }

    if (!DeliveryCountryCode) {
      throw new Error(
        `Failed to create customer, failed to determine 'order.shipping.country'`
      );
    }

    return {
      CountryCode,
      DeliveryCountryCode,

      Address1: sanitizeTextForFortnox(order.billing.address_1),
      Address2: sanitizeTextForFortnox(order.billing.address_2),
      ZipCode: sanitizeTextForFortnox(order.billing.postcode),
      City: sanitizeTextForFortnox(order.billing.city),

      DeliveryName: sanitizeTextForFortnox(WcOrders.tryGetDeliveryName(order)),
      DeliveryAddress1: sanitizeTextForFortnox(order.shipping.address_1),
      DeliveryAddress2: sanitizeTextForFortnox(order.shipping.address_2),
      DeliveryZipCode: sanitizeTextForFortnox(order.shipping.postcode),
      DeliveryCity: sanitizeTextForFortnox(order.shipping.city),
    };
  }
}

export default WcOrders;
