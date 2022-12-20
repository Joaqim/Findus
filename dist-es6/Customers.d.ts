import type { Customer, CustomerVatTypes, WcOrder } from "./types";
declare abstract class Customers {
    static getCustomerVatType(countryNameOrIso: string): CustomerVatTypes;
    static tryCreateCustomer(order: WcOrder, requireShippingAddress?: boolean): Customer;
}
export default Customers;
