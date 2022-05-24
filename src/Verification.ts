/* eslint-disable class-methods-use-this */
import Accounts from "@Accounts";
import CultureInfo from "@CultureInfo";
import type InvoiceInit from "@InvoiceInit";
import type { InvoiceRowInit } from "@InvoiceInit";
import type { LineItem, Tax, WcOrder } from "@WcOrder";

export default class Verification {
  private sanitizeCountryName(countryName: string): string {
    switch (countryName) {
      case "PRC":
        return "China";
      default:
        return countryName;
    }
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

  public static getTotalWithTax(item: LineItem): number {
    return item.price + Verification.getTotalWithTax(item);
  }

  public static getAccurateTaxTotal(item: LineItem): number {
    let result = 0;
    item.taxes.forEach((tax: Tax) => {
      result += parseFloat(tax.total);
    });
    return result;
  }

  /* TODO: Add PaymentFee to Verifikat
  public static addPaymentFee(
    invoiceRows: InvoiceRowInit[],
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

  }
  */

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

      const paymentMethod = Verification.getPaymentMethod(order);

      const shippingCost = parseFloat(order.shippingTotal);

      const invoiceRows: InvoiceRowInit[] = [];

      let highestRate = 0;

      for (const item of order.lineItems) {
        const isReduced = item.taxClass !== "reduced-rate";
        const { rate, account } = Accounts.getRate(
          countryIso,
          isReduced,
          paymentMethod
        );

        if (rate > highestRate) {
          highestRate = rate;
        }

        invoiceRows.push({
          accountNumber: account,
          articleNumber: item.sku,
          deliveredQuantity: item.quantity.toString(),
          price: Verification.getTotalWithTax(item),
          vat: rate,
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
