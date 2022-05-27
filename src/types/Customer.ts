export type CustomerVatTypes =
  | "SEVAT"
  | "SEREVERSEDVAT"
  | "EUREVERSEDVAT"
  | "EUVAT"
  | "EXPORT";

export type CustomerType = "PRIVATE" | "COMPANY";

export interface Default {
  Invoice?: string;
  Offer?: string;
  Order?: string;
  CashInvoice?: string;
}

export default interface Customer {
  Url?: string;
  Active?: boolean;
  Address1?: string;
  Address2?: string;
  City?: string;
  Comments?: string;
  CostCenter?: null;
  Country?: string;
  CountryCode?: string;
  Currency?: string;
  CustomerNumber?: string;
  DefaultDeliveryTypes?: Default;
  DefaultTemplates?: Default;
  DeliveryAddress1?: string;
  DeliveryAddress2?: string;
  DeliveryCity?: string;
  DeliveryCountry?: string;
  DeliveryCountryCode?: string;
  DeliveryFax?: null;
  DeliveryName?: string;
  DeliveryPhone1?: string;
  DeliveryPhone2?: null;
  DeliveryZipCode?: string;
  Email?: string;
  EmailInvoice?: string;
  EmailInvoiceBCC?: string;
  EmailInvoiceCC?: string;
  EmailOffer?: string;
  EmailOfferBCC?: string;
  EmailOfferCC?: string;
  EmailOrder?: string;
  EmailOrderBCC?: string;
  EmailOrderCC?: string;
  Fax?: null;
  Gln?: null;
  GlnDelivery?: null;
  InvoiceAdministrationFee?: null;
  InvoiceDiscount?: null;
  InvoiceFreight?: null;
  InvoiceRemark?: string;
  Name?: string;
  OrganisationNumber?: string;
  OurReference?: string;
  Phone1?: string;
  Phone2?: string;
  PriceList?: string;
  Project?: string;
  SalesAccount?: null;
  ShowPriceVATIncluded?: boolean;
  TermsOfDelivery?: string;
  TermsOfPayment?: string;
  Type?: CustomerType;
  VATNumber?: string;
  VATType?: CustomerVatTypes;
  VisitingAddress?: null;
  VisitingCity?: null;
  VisitingCountry?: null;
  VisitingCountryCode?: null;
  VisitingZipCode?: null;
  WWW?: string;
  WayOfDelivery?: string;
  YourReference?: string;
  ZipCode?: string;
}
