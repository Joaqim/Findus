/* eslint-disable class-methods-use-this */
import type { Rate } from "./Accounts";
import Accounts from "./Accounts";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type {
  InvoiceInit,
  InvoiceRowInit,
  LineItem,
  MetaData,
  WcOrder,
} from "./types";
import type { TaxLabel } from "./WcOrders";
import WcOrders from "./WcOrders";

export default abstract class Invoices {
  private sanitizeCountryName(countryName: string): string {
    switch (countryName) {
      case "PRC":
        return "China";
      default:
        return countryName;
    }
  }

  public static verifyRateForItem(
    order: WcOrder,
    rate: Rate,
    item: LineItem
  ): TaxLabel {
    if (rate.vat == 0) {
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

  // TODO: Add PaymentFee to Verifikat / Accrual Invoice
  public static addPaymentFee(
    invoiceRows: InvoiceRowInit[], // AccrualInvoiceRows?
    order: WcOrder,
    rate: Rate,
    paymentMethod: "Stripe" | "PayPal"
  ) {
    let feeData: MetaData | undefined;

    const getMetaData = (
      metaDatas: MetaData[],
      key: string
    ): MetaData | undefined =>
      metaDatas.find((value: MetaData) => value.key === key);

    if (paymentMethod === "Stripe") {
      feeData = getMetaData(order.metaData, "_stripe_fee");
    } else if (paymentMethod === "PayPal") {
      feeData = getMetaData(order.metaData, "_paypal_transaction_fee");
    }

    if (!feeData || parseFloat(feeData.value) < 0) {
      throw new Error(`Unexpected Fee: ${paymentMethod}`);
    }
    const fee = parseFloat(feeData.value);

    if (fee <= 0 || fee >= parseFloat(order.total)) {
      throw new Error(`Unexpected fee amount for '${feeData.key}': ${fee}`);
    }

    /*
    let salesAccount = Accounts.getSalesAccount(order.billing.country)

    invoiceRows.push({
                accountNumber:
                credit: fee,
                info: $"{paymentMethod} Avgift - Utgående"
    });

    invoiceRows.push({accountNumber: 6570, debit: fee, info: `${paymentMethod} Avgift`});
    */
  }

  public createInvoice(order: WcOrder, currencyRate = 1): InvoiceInit | null {
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

      const paymentMethod = Invoices.getPaymentMethod(order);

      const shippingCost = parseFloat(order.shippingTotal);

      const invoiceRows: InvoiceRowInit[] = [];

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
          accountNumber,
          vat,
          articleNumber: item.sku,
          deliveredQuantity: item.quantity.toString(),
          price: LineItems.getTotalWithTax(item),
        });
      }

      const invoice: InvoiceInit = {
        invoiceType: "CASHINVOICE",
        invoiceDate: order.datePaid,
        paymentWay: "CARD",
        vatIncluded: true,
        currency,
        currencyRate,
        yourOrderNumber: order.id.toString(),
        ourReference: "Findus-JS",
        // externalInvoiceReference1 = order.id.toString()
        invoiceRows: [],

        // Customer
        customerName:
          `${order.billing.firstName} ${order.billing.lastName}`.trim(),
        country: this.sanitizeCountryName(country),
        address1: order.billing.address1,
        address2: order.billing.address2,
        zipCode: order.billing.postcode,
        city: order.billing.city,
        deliveryCountry: this.sanitizeCountryName(deliveryCountry),
        deliveryAddress1: order.shipping.address1,
        deliveryAddress2: order.shipping.address2,
        deliveryZipCode: order.shipping.postcode,
        deliveryCity: order.shipping.city,

        // Shipping cost
        freight: shippingCost,
      };
      return invoice;
    } catch (error) {
      throw error;
    }
  }
}
