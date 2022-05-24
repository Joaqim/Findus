export type CustomerVatTypes = "SEVAT" | "SEREVERSEDVAT" | "EUREVERSEDVAT" | "EUVAT" | "EXPORT";

export type CustomerType = "PRIVATE" | "COMPANY";

// To parse this data:
//
//   import { Convert, Customer } from "./file";
//
//   const customer = Convert.toCustomer(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export default interface Customer {
  url?: string;
  active?: boolean;
  address1?: string;
  address2?: string;
  city?: string;
  comments?: string;
  costCenter?: null;
  country?: string;
  countryCode?: string;
  currency?: string;
  customerNumber?: string;
  defaultDeliveryTypes?: Default;
  defaultTemplates?: Default;
  deliveryAddress1?: string;
  deliveryAddress2?: string;
  deliveryCity?: string;
  deliveryCountry?: string;
  deliveryCountryCode?: string;
  deliveryFax?: null;
  deliveryName?: string;
  deliveryPhone1?: string;
  deliveryPhone2?: null;
  deliveryZipCode?: string;
  email?: string;
  emailInvoice?: string;
  emailInvoiceBCC?: string;
  emailInvoiceCC?: string;
  emailOffer?: string;
  emailOfferBCC?: string;
  emailOfferCC?: string;
  emailOrder?: string;
  emailOrderBCC?: string;
  emailOrderCC?: string;
  fax?: null;
  gln?: null;
  glnDelivery?: null;
  invoiceAdministrationFee?: null;
  invoiceDiscount?: null;
  invoiceFreight?: null;
  invoiceRemark?: string;
  name?: string;
  organisationNumber?: string;
  ourReference?: string;
  phone1?: string;
  phone2?: string;
  priceList?: string;
  project?: string;
  salesAccount?: null;
  showPriceVATIncluded?: boolean;
  termsOfDelivery?: string;
  termsOfPayment?: string;
  type?: CustomerType;
  vatNumber?: string;
  vatType?: CustomerVatTypes;
  visitingAddress?: null;
  visitingCity?: null;
  visitingCountry?: null;
  visitingCountryCode?: null;
  visitingZipCode?: null;
  www?: string;
  wayOfDelivery?: string;
  yourReference?: string;
  zipCode?: string;
}

export interface Default {
  invoice?: string;
  offer?: string;
  order?: string;
  cashInvoice?: string;
}
