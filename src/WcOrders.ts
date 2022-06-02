import type { Rate } from "./Accounts";
import CultureInfo from "./CultureInfo";
import type { Customer, LineItem, MetaData, TaxLine, WcOrder } from "./types";

export interface TaxLabel {
  vat: number;
  label?: string;
}

abstract class WcOrders {
  public static getPaymentMethod(order: WcOrder): "Stripe" | "PayPal" {
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

    throw new Error(
      `Unexpected Payment Method: '${payment_method}', '${order.payment_method_title}'`
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

    const isStandard = item.tax_class !== "reduced-rate";
    const taxRates = WcOrders.tryGetTaxRateLabels(order.tax_lines);

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
      // Throws error on undefined
      const vat = regex.exec(taxLabel!);

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

  public static tryGetTaxRateLabels(taxes: TaxLine[]): {
    standard: TaxLabel;
    reduced: TaxLabel;
  } {
    let labels: TaxLabel[] = [];
    taxes.forEach((tax: TaxLine) => {
      const vat = WcOrders.getTaxRate(tax);
      const taxLabel = { vat, label: tax.label };

      if (!taxLabel) {
        throw new Error("Missing tax label");
      }

      // Make sure lowest VAT is last value in tuple
      if (labels[0]?.vat >= vat) labels.push(taxLabel);
      else labels = [taxLabel, ...labels];
    });

    return { standard: labels[0], reduced: labels[1] };
  }

  public static getDocumentSource(order: WcOrder): string | null {
    return order.meta_data.find(
      (entry: MetaData) => entry.key === "pdf_invoice_source"
    )?.value as string;
  }

  public static tryGetDocumentLink(
    order: WcOrder,
    storefrontUrl?: string
  ): string {
    // Try to get Document link from metadata
    const pdfLink = order.meta_data.find(
      (entry: MetaData) => entry.key === "_wcpdf_document_link"
    )?.value as string;

    if (pdfLink && pdfLink !== "") {
      return pdfLink;
    } else {
      // Try to get Order key from metadata
      let orderKey = order.meta_data.find(
        (entry: MetaData) => entry.key === "_wc_order_key"
      )?.value;

      if (!orderKey) {
        orderKey = order.order_key;
      }

      if (!orderKey) {
        throw new Error(`Order is missing document_link and order_key`);
      }

      if (!storefrontUrl) {
        const url = order.meta_data.find(
          (entry: MetaData) => entry.key === "storefront_url"
        )?.value;
        if (!url) {
          throw new Error(
            `Could not get 'storefront_url' from order meta_data`
          );
        }
        return `${url}/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&template_type=invoice&order_ids=${order.id}&order_key=${orderKey}`;
      }

      return `${storefrontUrl}/wp-admin/admin-ajax.php?action=generate_wpo_wcpdf&template_type=invoice&order_ids=${order.id}&order_key=${orderKey}`;
    }
  }
  public static tryGetInvoiceReference(order: WcOrder): number | undefined {
    if (!order.meta_data) return;
    let reference = order.meta_data.find(
      (entry: MetaData) => entry.key === "_fortnox_invoice_number"
    )?.value as string;

    if (!reference) {
      throw new Error(
        `Order: ${order.id} is missing '_fortnox_invoice_number' referenec in meta data.`
      );
    }
    return parseInt(reference);
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

  public static tryGetCustomerName(order: WcOrder): string {
    if (order.billing.first_name || order.billing.last_name) {
      return `${order.billing.first_name} ${order.billing.last_name}`.trim();
    } else if (order.shipping.first_name || order.shipping.last_name) {
      return `${order.shipping.first_name} ${order.shipping.last_name}`.trim();
    } else {
      throw new Error(
        `Order: ${order.id} is missing customer name for billing`
      );
    }
  }
  public static tryGetDeliveryName(order: WcOrder): string {
    if (order.shipping.first_name || order.shipping.last_name) {
      return `${order.shipping.first_name} ${order.shipping.last_name}`.trim();
    } else if (order.billing.first_name || order.billing.last_name) {
      return `${order.billing.first_name} ${order.billing.last_name}`.trim();
    } else {
      throw new Error(
        `Order: ${order.id} is missing customer name for delivery`
      );
    }
  }

  public static tryGetAddresses(order: WcOrder): Customer {
    return {
      Country: CultureInfo.tryGetEnglishName(order.billing.country),
      Address1: order.billing.address_1 ?? order.shipping.address_1,
      Address2: order.billing.address_2 ?? order.shipping.address_2,
      ZipCode: order.billing.postcode ?? order.shipping.postcode,
      City: order.billing.city ?? order.shipping.city,

      DeliveryCountry: CultureInfo.tryGetEnglishName(order.shipping.country),
      DeliveryAddress1: order.shipping.address_1 ?? order.billing.address_1,
      DeliveryAddress2: order.shipping.address_2 ?? order.billing.address_2,
      DeliveryZipCode: order.shipping.postcode ?? order.billing.postcode,
      DeliveryCity: order.shipping.city ?? order.billing.city,
    };
  }
}

export default WcOrders;
