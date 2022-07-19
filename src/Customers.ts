import CultureInfo from "./CultureInfo";
import type { Customer, CustomerVatTypes, WcOrder } from "./types";
import WcOrders from "./WcOrders";

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

  public static tryCreateCustomer(order: WcOrder): Customer {
    const addresses = WcOrders.tryGetCustomerAddresses(order);

    return {
      Name: WcOrders.tryGetCustomerName(order),
      Type: "PRIVATE",
      Email: WcOrders.tryGetCustomerEmail(order),

      VATType: Customers.getVatType(addresses.DeliveryCountryCode),
      ...addresses,
    };
  }
}

export default Customers;
