import type { Rate } from "./Accounts";
import CultureInfo from "./CultureInfo";
import type { Customer, LineItem, TaxLine, WcOrder } from "./types";

export interface TaxLabel {
  vat: number;
  label: string;
}

abstract class WcOrders {
  public static getPaymentMethod(order: WcOrder): "Stripe" | "PayPal" {
    const { paymentMethod } = order;

    if (!paymentMethod || paymentMethod === "") {
      throw new Error("Beställningen behöver bokföras manuellt.");
    }
    // NOTE: Matches stripe & stripe_{bancontant,ideal,sofort}, but not *_stripe

    if (/^stripe\S*/i.test(paymentMethod)) {
      return "Stripe";
    }
    // NOTE: Matches paypal & (ppec_paypal)_paypal, but not paypal_*

    if (/^\S*paypal$/i.test(paymentMethod)) {
      return "PayPal";
    }

    throw new Error(
      `Unexpected Payment Method: '${paymentMethod}', '${order.paymentMethodTitle}'`
    );
  }

  public static verifyRateForItem(
    order: WcOrder,
    rate: Rate,
    item: LineItem
  ): TaxLabel {
    if (rate.vat === 0) {
      return { vat: 0, label: "0% Vat" };
    }

    const isStandard = item.taxClass !== "reduced-rate";
    const taxRates = WcOrders.getTaxRateLabels(order.taxLines);

    const taxLabel = isStandard ? taxRates.standard : taxRates.reduced;

    if (rate.vat !== taxLabel.vat) {
      throw new Error(
        `VAT Rate miss-match, expected value: ${rate.vat} VAT, but WooCommerce gave: ${taxLabel.vat}% VAT, with label: ${taxLabel.label}`
      );
    }
    return taxLabel;
  }

  public static getTaxRate(tax: TaxLine): number {
    const taxLabel = tax.label;

    try {
      // eslint-disable-next-line unicorn/no-unsafe-regex
      const regex = /(?:\d+(?:\.\d*)?|\.\d+)%/;
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

  public static getTaxRateLabels(taxes: TaxLine[]): {
    standard: TaxLabel;
    reduced: TaxLabel;
  } {
    let labels: TaxLabel[] = [];
    taxes.forEach((tax: TaxLine) => {
      const vat = WcOrders.getTaxRate(tax);
      const taxLabel = { vat, label: tax.label };

      // Make sure lowest VAT is last value in tuple
      if (labels[0]?.vat >= vat) labels.push(taxLabel);
      else labels = [taxLabel, ...labels];
    });

    return { standard: labels[0], reduced: labels[1] };
  }

  public static tryGetDocumentLink(order: WcOrder): string {
    // Try to get Document link from metadata
    const pdfLink = order.metaData.find(
      (entry) => entry.key === "_wcpdf_document_link"
    )?.value;

    if (pdfLink && pdfLink !== "") {
      return pdfLink;
    } else {
      // Try to get Order key from metadata
      const orderKey = order.metaData.find(
        (entry) => entry.key === "_wc_order_key"
      );

      if (!orderKey) {
        throw new Error(
          `Order: ${order.id} is missing document_link and order_key`
        );
      }
      return `https://gamerbulk.com/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&template_type=invoice&order_ids=${order.id}&order_key=${orderKey}`;
    }
  }
  public static tryGetInvoiceReference(order: WcOrder): number | undefined {
    let ref = order.metaData.find(
      (entry) => entry.key === "_fortnox_invoice_number"
    )?.value;
    if (!ref) {
      throw new Error(
        `Order: ${order.id} is missing '_fortnox_invoice_number' referenec in meta data.`
      );
    }
    return parseInt(ref);
  }

  public static tryCanBeRefunded(order: WcOrder) {
    if (order.status === "completed" && order.refunds?.length === 0) {
      throw new Error(
        "Order status is 'completed' and is not partially refunded."
      );
    } else if (order.status !== "refunded") {
      throw new Error(
        `Unexpected order status: '${order.status}', expected 'refunded' or alternatively 'completed' with partial refund.`
      );
    }
  }

  public static getCustomerName(order: WcOrder): string {
    return `${order.billing.firstName} ${order.billing.lastName}`.trim();
  }

  public static tryGetAddresses(order: WcOrder): Customer {
    return {
      Country: CultureInfo.tryGetEnglishName(order.billing.country),
      Address1: order.billing.address1,
      Address2: order.billing.address2,
      ZipCode: order.billing.postcode,
      City: order.billing.city,

      DeliveryCountry: CultureInfo.tryGetEnglishName(order.shipping.country),
      DeliveryAddress1: order.shipping.address1,
      DeliveryAddress2: order.shipping.address2,
      DeliveryZipCode: order.shipping.postcode,
      DeliveryCity: order.shipping.city,
    };
  }
}

export default WcOrders;
