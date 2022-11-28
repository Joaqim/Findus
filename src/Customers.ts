import CultureInfo from "./CultureInfo";
import type { Customer, CustomerVatTypes, WcOrder } from "./types";
import type { Required } from "./utils";
import WcOrders from "./WcOrders";

abstract class Customers {
  public static getCustomerVatType(countryNameOrIso: string): CustomerVatTypes {
    const countryIso = CultureInfo.tryGetCountryIso(countryNameOrIso);

    if (CultureInfo.isInsideEU(countryIso)) {
      if (/se/i.test(countryIso)) {
        return "SEVAT";
      }
      return "EUVAT";
    }
    return "EXPORT";
  }

  public static tryCreateCustomer(
    order: WcOrder,
    requireShippingAddress = true
  ): Customer {
    let addresses:
      | undefined
      | Required<Customer, "CountryCode" | "DeliveryCountryCode">;
    let VATType: undefined | CustomerVatTypes;

    try {
      addresses = WcOrders.tryGetCustomerAddresses(order);

      VATType = Customers.getCustomerVatType(addresses.DeliveryCountryCode);
    } catch (error) {
      if (requireShippingAddress) {
        throw new Error((error as Error).message);
      }
    }

    return {
      Name: WcOrders.tryGetCustomerName(order),
      Type: "PRIVATE",
      Email: WcOrders.tryGetCustomerEmail(order),
      VATType,
      ...addresses,
    };
  }
}

export default Customers;
