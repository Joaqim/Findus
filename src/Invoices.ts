/* eslint-disable class-methods-use-this */
import Accounts from "./Accounts";
import CultureInfo from "./CultureInfo";
import LineItems from "./LineItems";
import type { InvoiceInit, InvoiceRowInit, WcOrder } from "./types";

export default abstract class Invoices {
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
          AccountNumber: accountNumber,
          VAT: vat,
          ArticleNumber: item.sku,
          DeliveredQuantity: item.quantity.toString(),
          Price: LineItems.getTotalWithTax(item),
        });
      }

      const invoice: InvoiceInit = {
        InvoiceType: "CASHINVOICE",
        InvoiceDate: order.datePaid,
        PaymentWay: "CARD",
        VATIncluded: true,
        Currency: currency,
        CurrencyRate: currencyRate,
        YourOrderNumber: order.id.toString(),
        OurReference: "Findus-JS",
        // externalInvoiceReference1 = order.id.toString()
        InvoiceRows: [],

        // Customer
        CustomerName:
          `${order.billing.firstName} ${order.billing.lastName}`.trim(),

        Country: country,
        Address1: order.billing.address1,
        Address2: order.billing.address2,
        ZipCode: order.billing.postcode,
        City: order.billing.city,

        DeliveryCountry: deliveryCountry,
        DeliveryAddress1: order.shipping.address1,
        DeliveryAddress2: order.shipping.address2,
        DeliveryZipCode: order.shipping.postcode,
        DeliveryCity: order.shipping.city,

        // Shipping cost
        Freight: shippingCost,
      };
      return invoice;
    } catch (error) {
      throw error;
    }
  }
}
