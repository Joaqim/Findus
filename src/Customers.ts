import CultureInfo from "./CultureInfo";
import type { Customer, CustomerVatTypes, Invoice, WcOrder } from "./types";

abstract class Customers {
  public static getVatType(countryIso: string): CustomerVatTypes {
    if (CultureInfo.isInsideEU(countryIso)) {
      if (/se/i.test(countryIso)) {
        return "SEVAT";
      }
      return "EUVAT";
    }
    return "EXPORT";
  }

  public static createCustomer(order: WcOrder, invoice: Invoice): Customer {
    const {
      address1,
      address2,
      city,
      zipCode,

      deliveryName,
      deliveryAddress1,
      deliveryAddress2,
      deliveryCity,
      deliveryZipCode,
    } = invoice;

    const countryCode = order.shipping.country.toUpperCase();

    return {
      name: invoice.customerName,
      type: "PRIVATE",
      email: order.billing.email,
      countryCode,

      vatType: Customers.getVatType(countryCode),

      address1,
      address2,
      city,
      zipCode,

      deliveryName,
      deliveryAddress1,
      deliveryAddress2,
      deliveryCity,
      deliveryZipCode,
    };
  }
}

export default Customers;
