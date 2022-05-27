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
      Address1,
      Address2,
      City,
      ZipCode,

      DeliveryName,
      DeliveryAddress1,
      DeliveryAddress2,
      DeliveryCity,
      DeliveryZipCode,
    } = invoice;

    const CountryCode = order.shipping.country.toUpperCase();

    return {
      Name: invoice.CustomerName,
      Type: "PRIVATE",
      Email: order.billing.email,
      CountryCode,

      VATType: Customers.getVatType(CountryCode),

      Address1,
      Address2,
      City,
      ZipCode,

      DeliveryName,
      DeliveryAddress1,
      DeliveryAddress2,
      DeliveryCity,
      DeliveryZipCode,
    };
  }
}

export default Customers;
