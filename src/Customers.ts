import CultureInfo from "./CultureInfo";
import type { Customer, CustomerVatTypes, Invoice } from "./types";

abstract class Customers {
  public static getVatType(countryNameOrIso: string): CustomerVatTypes {
    const countryIso = CultureInfo.tryGetCountryIso(countryNameOrIso);

    if (CultureInfo.isInsideEU(countryIso)) {
      if (/se/i.test(countryIso)) {
        return "SEVAT";
      }
      return "EUVAT";
    }
    return "EXPORT";
  }

  public static tryCreateCustomer(invoice: Invoice): Customer {
    const {
      Address1,
      Address2,
      City,
      ZipCode,
      Country,

      DeliveryName,
      DeliveryAddress1,
      DeliveryAddress2,
      DeliveryCity,
      DeliveryZipCode,
      DeliveryCountry,
    } = invoice;

    const CountryCode = CultureInfo.tryGetCountryIso(Country);
    const DeliveryCountryCode =
      Country === DeliveryCountry
        ? CountryCode
        : CultureInfo.tryGetCountryIso(DeliveryCountry);

    return {
      Name: invoice.CustomerName,
      Type: "PRIVATE",
      Email: invoice.EmailInformation?.EmailAddressTo,
      CountryCode,

      VATType: Customers.getVatType(DeliveryCountryCode),

      Address1,
      Address2,
      City,
      ZipCode,
      Country,

      DeliveryName,
      DeliveryAddress1,
      DeliveryAddress2,
      DeliveryCity,
      DeliveryZipCode,
      DeliveryCountry,
    };
  }
}

export default Customers;
