/* eslint
         no-empty: ["error", { "allowEmptyCatch": true }]
*/
import type { WcOrder } from "src/types";

interface ArrayType extends Record<string, unknown> {
  arrayItems: unknown;
}
interface ReferenceType extends Record<string, unknown> {
  ref: string;
}

interface UnionType extends Record<string, unknown> {
  unionMembers: unknown[];
}

interface ObjectType extends Record<string, unknown> {
  props: unknown[];
  // eslint-disable-next-line no-use-before-define
  additional: Types[] | Types[] | unknown;
  // eslint-disable-next-line no-use-before-define
  jsToJSON?: Record<string, PropertyType>;
  // eslint-disable-next-line no-use-before-define
  jsonToJS?: Record<string, PropertyType>;
}

interface PropertyType {
  key: string;
  typ: ObjectType;
}

interface JSONProperty {
  json: string;
  js: string;
  typ: ObjectType;
}

function array(typ: unknown): ArrayType {
  return { arrayItems: typ };
}

function union(...typs: unknown[]): UnionType {
  return { unionMembers: typs };
}

function object(properties: unknown[], additional: unknown): ObjectType {
  return { props: properties, additional };
}

function reference(name: string): ReferenceType {
  return { ref: name };
}

function jsonToJSProperties(typ: ObjectType): Record<string, PropertyType> {
  if (typ.jsonToJS === undefined) {
    const map: Record<string, PropertyType> = {};
    typ.props.forEach((p) => {
      const { json, js, typ: typ_ } = p as JSONProperty;
      map[json] = { key: js, typ: typ_ };
    });
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProperties(typ: ObjectType): Record<string, PropertyType> {
  if (typ.jsToJSON === undefined) {
    const map: Record<string, PropertyType> = {};
    typ.props.forEach((p) => {
      const { json, js, typ: typ_ } = p as JSONProperty;
      map[json] = { key: js, typ: typ_ };
    });
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function invalidValue(typ: unknown, value: unknown, key: unknown = ""): never {
  if (key) {
    throw new Error(
      `Invalid value for key "${key}". Expected type ${JSON.stringify(
        typ
      )} but got ${JSON.stringify(value)}`
    );
  }
  throw new Error(
    `Invalid value ${JSON.stringify(value)} for type ${JSON.stringify(typ)}`
  );
}
type Types = ArrayType | ObjectType | UnionType | ReferenceType;

const typeMap: Record<string, ObjectType> = {
  ArticleBrief: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      { json: "ArticleNumber", js: "articleNumber", typ: union(undefined, "") },
      { json: "Description", js: "description", typ: union(undefined, "") },
      {
        json: "DisposableQuantity",
        js: "disposableQuantity",
        typ: union(undefined, ""),
      },
      { json: "EAN", js: "ean", typ: union(undefined, "") },
      { json: "Housework", js: "housework", typ: union(undefined, true) },
      { json: "PurchasePrice", js: "purchasePrice", typ: union(undefined, "") },
      {
        json: "QuantityInStock",
        js: "quantityInStock",
        typ: union(undefined, ""),
      },
      {
        json: "ReservedQuantity",
        js: "reservedQuantity",
        typ: union(undefined, ""),
      },
      { json: "SalesPrice", js: "salesPrice", typ: union(undefined, 0) },
      { json: "StockPlace", js: "stockPlace", typ: union(undefined, "") },
      { json: "StockValue", js: "stockValue", typ: union(undefined, "") },
      { json: "Unit", js: "unit", typ: union(undefined, null) },
      {
        json: "WebshopArticle",
        js: "webshopArticle",
        typ: union(undefined, true),
      },
    ],
    false
  ),
  CustomerBrief: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      { json: "Address1", js: "address1", typ: union(undefined, "") },
      { json: "Address2", js: "address2", typ: union(undefined, "") },
      { json: "City", js: "city", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "customerNumber",
        typ: union(undefined, ""),
      },
      { json: "Email", js: "email", typ: union(undefined, "") },
      { json: "Name", js: "name", typ: union(undefined, "") },
      {
        json: "OrganisationNumber",
        js: "organisationNumber",
        typ: union(undefined, ""),
      },
      { json: "Phone", js: "phone", typ: union(undefined, "") },
      { json: "ZipCode", js: "zipCode", typ: union(undefined, "") },
    ],
    false
  ),
  Customer: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      { json: "Active", js: "active", typ: union(undefined, true) },
      { json: "Address1", js: "address1", typ: union(undefined, "") },
      { json: "Address2", js: "address2", typ: union(undefined, null) },
      { json: "City", js: "city", typ: union(undefined, "") },
      { json: "Comments", js: "comments", typ: union(undefined, null) },
      { json: "CostCenter", js: "costCenter", typ: union(undefined, null) },
      { json: "Country", js: "country", typ: union(undefined, "") },
      { json: "CountryCode", js: "countryCode", typ: union(undefined, "") },
      { json: "Currency", js: "currency", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "customerNumber",
        typ: union(undefined, ""),
      },
      {
        json: "DefaultDeliveryTypes",
        js: "defaultDeliveryTypes",
        typ: union(undefined, reference("Default")),
      },
      {
        json: "DefaultTemplates",
        js: "defaultTemplates",
        typ: union(undefined, reference("Default")),
      },
      {
        json: "DeliveryAddress1",
        js: "deliveryAddress1",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryAddress2",
        js: "deliveryAddress2",
        typ: union(undefined, null),
      },
      { json: "DeliveryCity", js: "deliveryCity", typ: union(undefined, null) },
      {
        json: "DeliveryCountry",
        js: "deliveryCountry",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryCountryCode",
        js: "deliveryCountryCode",
        typ: union(undefined, null),
      },
      { json: "DeliveryFax", js: "deliveryFax", typ: union(undefined, null) },
      { json: "DeliveryName", js: "deliveryName", typ: union(undefined, null) },
      {
        json: "DeliveryPhone1",
        js: "deliveryPhone1",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryPhone2",
        js: "deliveryPhone2",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryZipCode",
        js: "deliveryZipCode",
        typ: union(undefined, null),
      },
      { json: "Email", js: "email", typ: union(undefined, "") },
      { json: "EmailInvoice", js: "emailInvoice", typ: union(undefined, "") },
      {
        json: "EmailInvoiceBCC",
        js: "emailInvoiceBCC",
        typ: union(undefined, ""),
      },
      {
        json: "EmailInvoiceCC",
        js: "emailInvoiceCC",
        typ: union(undefined, ""),
      },
      { json: "EmailOffer", js: "emailOffer", typ: union(undefined, "") },
      { json: "EmailOfferBCC", js: "emailOfferBCC", typ: union(undefined, "") },
      { json: "EmailOfferCC", js: "emailOfferCC", typ: union(undefined, "") },
      { json: "EmailOrder", js: "emailOrder", typ: union(undefined, "") },
      { json: "EmailOrderBCC", js: "emailOrderBCC", typ: union(undefined, "") },
      { json: "EmailOrderCC", js: "emailOrderCC", typ: union(undefined, "") },
      { json: "Fax", js: "fax", typ: union(undefined, null) },
      { json: "GLN", js: "gln", typ: union(undefined, null) },
      { json: "GLNDelivery", js: "glnDelivery", typ: union(undefined, null) },
      {
        json: "InvoiceAdministrationFee",
        js: "invoiceAdministrationFee",
        typ: union(undefined, null),
      },
      {
        json: "InvoiceDiscount",
        js: "invoiceDiscount",
        typ: union(undefined, null),
      },
      {
        json: "InvoiceFreight",
        js: "invoiceFreight",
        typ: union(undefined, null),
      },
      { json: "InvoiceRemark", js: "invoiceRemark", typ: union(undefined, "") },
      { json: "Name", js: "name", typ: union(undefined, "") },
      {
        json: "OrganisationNumber",
        js: "organisationNumber",
        typ: union(undefined, ""),
      },
      { json: "OurReference", js: "ourReference", typ: union(undefined, "") },
      { json: "Phone1", js: "phone1", typ: union(undefined, "") },
      { json: "Phone2", js: "phone2", typ: union(undefined, null) },
      { json: "PriceList", js: "priceList", typ: union(undefined, "") },
      { json: "Project", js: "project", typ: union(undefined, "") },
      { json: "SalesAccount", js: "salesAccount", typ: union(undefined, null) },
      {
        json: "ShowPriceVATIncluded",
        js: "showPriceVATIncluded",
        typ: union(undefined, true),
      },
      {
        json: "TermsOfDelivery",
        js: "termsOfDelivery",
        typ: union(undefined, ""),
      },
      {
        json: "TermsOfPayment",
        js: "termsOfPayment",
        typ: union(undefined, ""),
      },
      { json: "Type", js: "type", typ: union(undefined, "") },
      { json: "VATNumber", js: "vatNumber", typ: union(undefined, "") },
      { json: "VATType", js: "vatType", typ: union(undefined, "") },
      {
        json: "VisitingAddress",
        js: "visitingAddress",
        typ: union(undefined, null),
      },
      { json: "VisitingCity", js: "visitingCity", typ: union(undefined, null) },
      {
        json: "VisitingCountry",
        js: "visitingCountry",
        typ: union(undefined, null),
      },
      {
        json: "VisitingCountryCode",
        js: "visitingCountryCode",
        typ: union(undefined, null),
      },
      {
        json: "VisitingZipCode",
        js: "visitingZipCode",
        typ: union(undefined, null),
      },
      { json: "WWW", js: "www", typ: union(undefined, "") },
      { json: "WayOfDelivery", js: "wayOfDelivery", typ: union(undefined, "") },
      { json: "YourReference", js: "yourReference", typ: union(undefined, "") },
      { json: "ZipCode", js: "zipCode", typ: union(undefined, "") },
    ],
    false
  ),
  Default: object(
    [
      { json: "Invoice", js: "invoice", typ: union(undefined, "") },
      { json: "Offer", js: "offer", typ: union(undefined, "") },
      { json: "Order", js: "order", typ: union(undefined, "") },
      { json: "CashInvoice", js: "cashInvoice", typ: union(undefined, "") },
    ],
    false
  ),
  NewWcOrder: object([], false),
  InvoiceBrief: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      { json: "Balance", js: "balance", typ: union(undefined, 0) },
      { json: "Booked", js: "booked", typ: union(undefined, true) },
      { json: "Cancelled", js: "cancelled", typ: union(undefined, true) },
      { json: "CostCenter", js: "costCenter", typ: union(undefined, "") },
      { json: "Currency", js: "currency", typ: union(undefined, "") },
      { json: "CurrencyRate", js: "currencyRate", typ: union(undefined, "") },
      { json: "CurrencyUnit", js: "currencyUnit", typ: union(undefined, 0) },
      { json: "CustomerName", js: "customerName", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "customerNumber",
        typ: union(undefined, ""),
      },
      {
        json: "DocumentNumber",
        js: "documentNumber",
        typ: union(undefined, ""),
      },
      { json: "DueDate", js: "dueDate", typ: union(undefined, Date) },
      {
        json: "ExternalInvoiceReference1",
        js: "externalInvoiceReference1",
        typ: union(undefined, ""),
      },
      {
        json: "ExternalInvoiceReference2",
        js: "externalInvoiceReference2",
        typ: union(undefined, ""),
      },
      { json: "InvoiceDate", js: "invoiceDate", typ: union(undefined, Date) },
      { json: "InvoiceType", js: "invoiceType", typ: union(undefined, "") },
      { json: "NoxFinans", js: "noxFinans", typ: union(undefined, true) },
      { json: "OCR", js: "ocr", typ: union(undefined, "") },
      { json: "Project", js: "project", typ: union(undefined, "") },
      { json: "Sent", js: "sent", typ: union(undefined, true) },
      {
        json: "TermsOfPayment",
        js: "termsOfPayment",
        typ: union(undefined, ""),
      },
      { json: "Total", js: "total", typ: union(undefined, 0) },
      { json: "WayOfDelivery", js: "wayOfDelivery", typ: union(undefined, "") },
    ],
    false
  ),
  Invoice: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      {
        json: "@urlTaxReductionList",
        js: "urlTaxReductionList",
        typ: union(undefined, ""),
      },
      { json: "Address1", js: "address1", typ: union(undefined, "") },
      { json: "Address2", js: "address2", typ: union(undefined, "") },
      {
        json: "AdministrationFee",
        js: "administrationFee",
        typ: union(undefined, 0),
      },
      {
        json: "AdministrationFeeVAT",
        js: "administrationFeeVAT",
        typ: union(undefined, 0),
      },
      { json: "Balance", js: "balance", typ: union(undefined, 0) },
      {
        json: "BasisTaxReduction",
        js: "basisTaxReduction",
        typ: union(undefined, 0),
      },
      { json: "Booked", js: "booked", typ: union(undefined, true) },
      { json: "Cancelled", js: "cancelled", typ: union(undefined, true) },
      { json: "City", js: "city", typ: union(undefined, "") },
      { json: "Comments", js: "comments", typ: union(undefined, "") },
      {
        json: "ContractReference",
        js: "contractReference",
        typ: union(undefined, 0),
      },
      {
        json: "ContributionPercent",
        js: "contributionPercent",
        typ: union(undefined, 3.14),
      },
      {
        json: "ContributionValue",
        js: "contributionValue",
        typ: union(undefined, 0),
      },
      { json: "CostCenter", js: "costCenter", typ: union(undefined, "") },
      { json: "Country", js: "country", typ: union(undefined, "") },
      { json: "Credit", js: "credit", typ: union(undefined, "") },
      {
        json: "CreditInvoiceReference",
        js: "creditInvoiceReference",
        typ: union(undefined, ""),
      },
      { json: "Currency", js: "currency", typ: union(undefined, "") },
      { json: "CurrencyRate", js: "currencyRate", typ: union(undefined, 0) },
      { json: "CurrencyUnit", js: "currencyUnit", typ: union(undefined, 0) },
      { json: "CustomerName", js: "customerName", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "customerNumber",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryAddress1",
        js: "deliveryAddress1",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryAddress2",
        js: "deliveryAddress2",
        typ: union(undefined, ""),
      },
      { json: "DeliveryCity", js: "deliveryCity", typ: union(undefined, "") },
      {
        json: "DeliveryCountry",
        js: "deliveryCountry",
        typ: union(undefined, ""),
      },
      { json: "DeliveryDate", js: "deliveryDate", typ: union(undefined, null) },
      { json: "DeliveryName", js: "deliveryName", typ: union(undefined, "") },
      {
        json: "DeliveryZipCode",
        js: "deliveryZipCode",
        typ: union(undefined, ""),
      },
      {
        json: "DocumentNumber",
        js: "documentNumber",
        typ: union(undefined, ""),
      },
      { json: "DueDate", js: "dueDate", typ: union(undefined, Date) },
      {
        json: "EDIInformation",
        js: "ediInformation",
        typ: union(undefined, reference("EDIInformation")),
      },
      {
        json: "EUQuarterlyReport",
        js: "euQuarterlyReport",
        typ: union(undefined, true),
      },
      {
        json: "EmailInformation",
        js: "emailInformation",
        typ: union(undefined, reference("EmailInformation")),
      },
      {
        json: "ExternalInvoiceReference1",
        js: "externalInvoiceReference1",
        typ: union(undefined, ""),
      },
      {
        json: "ExternalInvoiceReference2",
        js: "externalInvoiceReference2",
        typ: union(undefined, ""),
      },
      { json: "Freight", js: "freight", typ: union(undefined, 0) },
      { json: "FreightVAT", js: "freightVAT", typ: union(undefined, 3.14) },
      { json: "Gross", js: "gross", typ: union(undefined, 0) },
      { json: "HouseWork", js: "houseWork", typ: union(undefined, true) },
      { json: "InvoiceDate", js: "invoiceDate", typ: union(undefined, Date) },
      {
        json: "InvoicePeriodEnd",
        js: "invoicePeriodEnd",
        typ: union(undefined, ""),
      },
      {
        json: "InvoicePeriodStart",
        js: "invoicePeriodStart",
        typ: union(undefined, ""),
      },
      {
        json: "InvoiceReference",
        js: "invoiceReference",
        typ: union(undefined, ""),
      },
      {
        json: "InvoiceRows",
        js: "invoiceRows",
        typ: union(undefined, array(reference("InvoiceRow"))),
      },
      { json: "InvoiceType", js: "invoiceType", typ: union(undefined, "") },
      {
        json: "Labels",
        js: "labels",
        typ: union(undefined, array(reference("Label"))),
      },
      { json: "Language", js: "language", typ: union(undefined, "") },
      {
        json: "LastRemindDate",
        js: "lastRemindDate",
        typ: union(undefined, null),
      },
      { json: "Net", js: "net", typ: union(undefined, 0) },
      { json: "NotCompleted", js: "notCompleted", typ: union(undefined, true) },
      { json: "NoxFinans", js: "noxFinans", typ: union(undefined, true) },
      { json: "OCR", js: "ocr", typ: union(undefined, "") },
      {
        json: "OfferReference",
        js: "offerReference",
        typ: union(undefined, ""),
      },
      {
        json: "OrderReference",
        js: "orderReference",
        typ: union(undefined, ""),
      },
      {
        json: "OrganisationNumber",
        js: "organisationNumber",
        typ: union(undefined, ""),
      },
      { json: "OurReference", js: "ourReference", typ: union(undefined, "") },
      { json: "PaymentWay", js: "paymentWay", typ: union(undefined, "") },
      { json: "Phone1", js: "phone1", typ: union(undefined, "") },
      { json: "Phone2", js: "phone2", typ: union(undefined, "") },
      { json: "PriceList", js: "priceList", typ: union(undefined, "") },
      { json: "PrintTemplate", js: "printTemplate", typ: union(undefined, "") },
      { json: "Project", js: "project", typ: union(undefined, "") },
      { json: "Remarks", js: "remarks", typ: union(undefined, "") },
      { json: "Reminders", js: "reminders", typ: union(undefined, 0) },
      { json: "RoundOff", js: "roundOff", typ: union(undefined, 3.14) },
      { json: "Sent", js: "sent", typ: union(undefined, true) },
      { json: "TaxReduction", js: "taxReduction", typ: union(undefined, null) },
      {
        json: "TaxReductionType",
        js: "taxReductionType",
        typ: union(undefined, ""),
      },
      {
        json: "TermsOfDelivery",
        js: "termsOfDelivery",
        typ: union(undefined, ""),
      },
      {
        json: "TermsOfPayment",
        js: "termsOfPayment",
        typ: union(undefined, ""),
      },
      { json: "Total", js: "total", typ: union(undefined, 0) },
      { json: "TotalToPay", js: "totalToPay", typ: union(undefined, 0) },
      { json: "TotalVAT", js: "totalVAT", typ: union(undefined, 3.14) },
      { json: "VATIncluded", js: "vatIncluded", typ: union(undefined, true) },
      {
        json: "VoucherNumber",
        js: "voucherNumber",
        typ: union(undefined, null),
      },
      {
        json: "VoucherSeries",
        js: "voucherSeries",
        typ: union(undefined, null),
      },
      { json: "VoucherYear", js: "voucherYear", typ: union(undefined, null) },
      { json: "WayOfDelivery", js: "wayOfDelivery", typ: union(undefined, "") },
      {
        json: "YourOrderNumber",
        js: "yourOrderNumber",
        typ: union(undefined, ""),
      },
      { json: "YourReference", js: "yourReference", typ: union(undefined, "") },
      { json: "ZipCode", js: "zipCode", typ: union(undefined, "") },
    ],
    false
  ),
  EDIInformation: object(
    [
      {
        json: "EDIGlobalLocationNumber",
        js: "ediGlobalLocationNumber",
        typ: union(undefined, ""),
      },
      {
        json: "EDIGlobalLocationNumberDelivery",
        js: "ediGlobalLocationNumberDelivery",
        typ: union(undefined, ""),
      },
      {
        json: "EDIInvoiceExtra1",
        js: "ediInvoiceExtra1",
        typ: union(undefined, ""),
      },
      {
        json: "EDIInvoiceExtra2",
        js: "ediInvoiceExtra2",
        typ: union(undefined, ""),
      },
      {
        json: "EDIOurElectronicReference",
        js: "ediOurElectronicReference",
        typ: union(undefined, ""),
      },
      {
        json: "EDIYourElectronicReference",
        js: "ediYourElectronicReference",
        typ: union(undefined, ""),
      },
    ],
    false
  ),
  EmailInformation: object(
    [
      {
        json: "EmailAddressBCC",
        js: "emailAddressBCC",
        typ: union(undefined, null),
      },
      {
        json: "EmailAddressCC",
        js: "emailAddressCC",
        typ: union(undefined, null),
      },
      {
        json: "EmailAddressFrom",
        js: "emailAddressFrom",
        typ: union(undefined, null),
      },
      {
        json: "EmailAddressTo",
        js: "emailAddressTo",
        typ: union(undefined, ""),
      },
      { json: "EmailBody", js: "emailBody", typ: union(undefined, "") },
      { json: "EmailSubject", js: "emailSubject", typ: union(undefined, "") },
    ],
    false
  ),
  InvoiceRow: object(
    [
      { json: "AccountNumber", js: "accountNumber", typ: union(undefined, 0) },
      { json: "ArticleNumber", js: "articleNumber", typ: union(undefined, "") },
      {
        json: "ContributionPercent",
        js: "contributionPercent",
        typ: union(undefined, 3.14),
      },
      {
        json: "ContributionValue",
        js: "contributionValue",
        typ: union(undefined, 0),
      },
      { json: "CostCenter", js: "costCenter", typ: union(undefined, null) },
      {
        json: "DeliveredQuantity",
        js: "deliveredQuantity",
        typ: union(undefined, ""),
      },
      { json: "Description", js: "description", typ: union(undefined, "") },
      { json: "Discount", js: "discount", typ: union(undefined, 0) },
      { json: "DiscountType", js: "discountType", typ: union(undefined, "") },
      { json: "HouseWork", js: "houseWork", typ: union(undefined, true) },
      {
        json: "HouseWorkHoursToReport",
        js: "houseWorkHoursToReport",
        typ: union(undefined, null),
      },
      {
        json: "HouseWorkType",
        js: "houseWorkType",
        typ: union(undefined, null),
      },
      { json: "Price", js: "price", typ: union(undefined, 0) },
      {
        json: "PriceExcludingVAT",
        js: "priceExcludingVAT",
        typ: union(undefined, 0),
      },
      { json: "Project", js: "project", typ: union(undefined, "") },
      { json: "Total", js: "total", typ: union(undefined, 0) },
      {
        json: "TotalExcludingVAT",
        js: "totalExcludingVAT",
        typ: union(undefined, 0),
      },
      { json: "Unit", js: "unit", typ: union(undefined, "") },
      { json: "VAT", js: "vat", typ: union(undefined, 0) },
    ],
    false
  ),
  Label: object([{ json: "Id", js: "id", typ: union(undefined, 0) }], false),
  WcOrder: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "parent_id", js: "parent_id", typ: union(undefined, 0) },
      { json: "status", js: "status", typ: union(undefined, "") },
      { json: "currency", js: "currency", typ: union(undefined, "") },
      { json: "version", js: "version", typ: union(undefined, "") },
      {
        json: "prices_include_tax",
        js: "prices_include_tax",
        typ: union(undefined, true),
      },
      { json: "date_created", js: "date_created", typ: union(undefined, Date) },
      {
        json: "date_modified",
        js: "date_modified",
        typ: union(undefined, Date),
      },
      {
        json: "discount_total",
        js: "discount_total",
        typ: union(undefined, ""),
      },
      { json: "discount_tax", js: "discount_tax", typ: union(undefined, "") },
      {
        json: "shipping_total",
        js: "shipping_total",
        typ: union(undefined, ""),
      },
      { json: "shipping_tax", js: "shipping_tax", typ: union(undefined, "") },
      { json: "cart_tax", js: "cart_tax", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "total_tax", typ: union(undefined, "") },
      { json: "customer_id", js: "customer_id", typ: union(undefined, 0) },
      { json: "order_key", js: "order_key", typ: union(undefined, "") },
      {
        json: "billing",
        js: "billing",
        typ: union(undefined, reference("Ing")),
      },
      {
        json: "shipping",
        js: "shipping",
        typ: union(undefined, reference("Ing")),
      },
      {
        json: "payment_method",
        js: "payment_method",
        typ: union(undefined, ""),
      },
      {
        json: "payment_method_title",
        js: "payment_method_title",
        typ: union(undefined, ""),
      },
      {
        json: "transaction_id",
        js: "transaction_id",
        typ: union(undefined, ""),
      },
      {
        json: "customer_ip_address",
        js: "customer_ip_address",
        typ: union(undefined, ""),
      },
      {
        json: "customer_user_agent",
        js: "customer_user_agent",
        typ: union(undefined, ""),
      },
      { json: "created_via", js: "created_via", typ: union(undefined, "") },
      { json: "customer_note", js: "customer_note", typ: union(undefined, "") },
      {
        json: "date_completed",
        js: "date_completed",
        typ: union(undefined, Date),
      },
      { json: "date_paid", js: "date_paid", typ: union(undefined, Date) },
      { json: "cart_hash", js: "cart_hash", typ: union(undefined, "") },
      { json: "number", js: "number", typ: union(undefined, "") },
      {
        json: "meta_data",
        js: "meta_data",
        typ: union(undefined, array(reference("WcOrderMetaDatum"))),
      },
      {
        json: "line_items",
        js: "line_items",
        typ: union(undefined, array(reference("LineItem"))),
      },
      {
        json: "tax_lines",
        js: "tax_lines",
        typ: union(undefined, array(reference("TaxLine"))),
      },
      {
        json: "shipping_lines",
        js: "shipping_lines",
        typ: union(undefined, array(reference("ShippingLine"))),
      },
      {
        json: "fee_lines",
        js: "fee_lines",
        typ: union(undefined, array("unknown")),
      },
      {
        json: "coupon_lines",
        js: "coupon_lines",
        typ: union(undefined, array("unknown")),
      },
      {
        json: "refunds",
        js: "refunds",
        typ: union(undefined, array("unknown")),
      },
      { json: "payment_url", js: "payment_url", typ: union(undefined, "") },
      {
        json: "date_created_gmt",
        js: "date_created_gmt",
        typ: union(undefined, Date),
      },
      {
        json: "date_modified_gmt",
        js: "date_modified_gmt",
        typ: union(undefined, Date),
      },
      {
        json: "date_completed_gmt",
        js: "date_completed_gmt",
        typ: union(undefined, Date),
      },
      {
        json: "date_paid_gmt",
        js: "date_paid_gmt",
        typ: union(undefined, Date),
      },
      {
        json: "currency_symbol",
        js: "currency_symbol",
        typ: union(undefined, ""),
      },
      {
        json: "_wcpdf_document_link",
        js: "_wcpdf_document_link",
        typ: union(undefined, ""),
      },
      { json: "_wc_order_key", js: "_wc_order_key", typ: union(undefined, "") },
      {
        json: "_links",
        js: "_links",
        typ: union(undefined, reference("Links")),
      },
    ],
    false
  ),
  Links: object(
    [
      {
        json: "self",
        js: "self",
        typ: union(undefined, array(reference("Collection"))),
      },
      {
        json: "collection",
        js: "collection",
        typ: union(undefined, array(reference("Collection"))),
      },
      {
        json: "customer",
        js: "customer",
        typ: union(undefined, array(reference("Collection"))),
      },
    ],
    false
  ),
  Collection: object(
    [{ json: "href", js: "href", typ: union(undefined, "") }],
    false
  ),
  Ing: object(
    [
      { json: "first_name", js: "first_name", typ: union(undefined, "") },
      { json: "last_name", js: "last_name", typ: union(undefined, "") },
      { json: "company", js: "company", typ: union(undefined, "") },
      { json: "address_1", js: "address_1", typ: union(undefined, "") },
      { json: "address_2", js: "address_2", typ: union(undefined, "") },
      { json: "city", js: "city", typ: union(undefined, "") },
      { json: "state", js: "state", typ: union(undefined, "") },
      { json: "postcode", js: "postcode", typ: union(undefined, "") },
      { json: "country", js: "country", typ: union(undefined, "") },
      { json: "email", js: "email", typ: union(undefined, "") },
      { json: "phone", js: "phone", typ: union(undefined, "") },
    ],
    false
  ),
  LineItem: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "name", js: "name", typ: union(undefined, "") },
      { json: "product_id", js: "product_id", typ: union(undefined, 0) },
      { json: "variation_id", js: "variation_id", typ: union(undefined, 0) },
      { json: "quantity", js: "quantity", typ: union(undefined, 0) },
      { json: "tax_class", js: "tax_class", typ: union(undefined, "") },
      { json: "subtotal", js: "subtotal", typ: union(undefined, "") },
      { json: "subtotal_tax", js: "subtotal_tax", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "total_tax", typ: union(undefined, "") },
      {
        json: "taxes",
        js: "taxes",
        typ: union(undefined, array(reference("Tax"))),
      },
      {
        json: "meta_data",
        js: "meta_data",
        typ: union(undefined, array(reference("LineItemMetaDatum"))),
      },
      { json: "sku", js: "sku", typ: union(undefined, "") },
      { json: "price", js: "price", typ: union(undefined, 3.14) },
      { json: "parent_name", js: "parent_name", typ: union(undefined, null) },
      {
        json: "composite_parent",
        js: "composite_parent",
        typ: union(undefined, ""),
      },
      {
        json: "composite_children",
        js: "composite_children",
        typ: union(undefined, array("unknown")),
      },
      { json: "bundled_by", js: "bundled_by", typ: union(undefined, "") },
      {
        json: "bundled_item_title",
        js: "bundled_item_title",
        typ: union(undefined, ""),
      },
      {
        json: "bundled_items",
        js: "bundled_items",
        typ: union(undefined, array("unknown")),
      },
    ],
    false
  ),
  LineItemMetaDatum: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "key", js: "key", typ: union(undefined, "") },
      { json: "value", js: "value", typ: union(undefined, "") },
      { json: "display_key", js: "display_key", typ: union(undefined, "") },
      { json: "display_value", js: "display_value", typ: union(undefined, "") },
    ],
    false
  ),
  Tax: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "subtotal", js: "subtotal", typ: union(undefined, "") },
    ],
    false
  ),
  WcOrderMetaDatum: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "key", js: "key", typ: union(undefined, "") },
      {
        json: "value",
        js: "value",
        typ: union(undefined, union(reference("ValueClass"), "")),
      },
    ],
    false
  ),
  ValueClass: object(
    [
      { json: "fbc", js: "fbc", typ: union(undefined, null) },
      { json: "fbp", js: "fbp", typ: union(undefined, "") },
      { json: "pys_landing", js: "pys_landing", typ: union(undefined, "") },
      { json: "pys_source", js: "pys_source", typ: union(undefined, "") },
      { json: "pys_utm", js: "pys_utm", typ: union(undefined, "") },
      {
        json: "pys_browser_time",
        js: "pys_browser_time",
        typ: union(undefined, ""),
      },
      { json: "orders_count", js: "orders_count", typ: union(undefined, 0) },
      {
        json: "avg_order_value",
        js: "avg_order_value",
        typ: union(undefined, 3.14),
      },
      { json: "ltv", js: "ltv", typ: union(undefined, 3.14) },
    ],
    false
  ),
  ShippingLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "method_title", js: "method_title", typ: union(undefined, "") },
      { json: "method_id", js: "method_id", typ: union(undefined, "") },
      { json: "instance_id", js: "instance_id", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "total_tax", typ: union(undefined, "") },
      { json: "taxes", js: "taxes", typ: union(undefined, array("unknown")) },
      {
        json: "meta_data",
        js: "meta_data",
        typ: union(undefined, array(reference("LineItemMetaDatum"))),
      },
    ],
    false
  ),
  TaxLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "rate_code", js: "rate_code", typ: union(undefined, "") },
      { json: "rate_id", js: "rate_id", typ: union(undefined, 0) },
      { json: "label", js: "label", typ: union(undefined, "") },
      { json: "compound", js: "compound", typ: union(undefined, true) },
      { json: "tax_total", js: "tax_total", typ: union(undefined, "") },
      {
        json: "shipping_tax_total",
        js: "shipping_tax_total",
        typ: union(undefined, ""),
      },
      { json: "rate_percent", js: "rate_percent", typ: union(undefined, 3.14) },
      {
        json: "meta_data",
        js: "meta_data",
        typ: union(undefined, array("unknown")),
      },
    ],
    false
  ),
};

function transform(
  value: unknown | string,
  typ: Types | Types[] | "unknown" | unknown | number | string | boolean,
  getProperties: (object_: ObjectType) => Record<string, PropertyType>,
  key: unknown = ""
): unknown {
  function transformPrimitive(primitive: unknown, value_: unknown): unknown {
    if (typeof primitive === typeof value_) return value_;
    return invalidValue(primitive, value_, key);
  }

  function transformUnion(typs: unknown[], value_: unknown): unknown {
    // val must validate against one typ in typs
    const l = typs.length;

    for (let index = 0; index < l; index += 1) {
      try {
        return transform(value_, typs[index], getProperties);
      } catch {}
    }
    return invalidValue(typs, value_);
  }

  function transformEnum(cases: string[], value_: string): unknown {
    if (cases.includes(value_)) return value_;
    return invalidValue(cases, value_);
  }

  function transformArray(type: unknown, value_: unknown): unknown {
    // val must be an array with no invalid elements
    if (!Array.isArray(value_)) return invalidValue("array", value_);
    return value_.map((element) => transform(element, type, getProperties));
  }

  function transformDate(value_: number | string): unknown {
    if (value_ === null) {
      return null;
    }
    const d = new Date(value_);

    if (Number.isNaN(d.valueOf())) {
      return invalidValue("Date", value_);
    }
    return d;
  }

  function transformObject(
    properties: Record<string, PropertyType>,
    additional: Types | Types[] | unknown,
    value_:
      | Types
      | "undefined"
      | undefined
      | null
      | unknown
      | unknown[]
      | Record<string, unknown>
  ): unknown {
    if (
      value_ === null ||
      typeof value_ !== "object" ||
      Array.isArray(value_)
    ) {
      return invalidValue("object", value_);
    }
    const result: Record<string, unknown> = {};
    Object.getOwnPropertyNames(properties).forEach((propertyKey) => {
      const property = properties[propertyKey];
      const v = Object.prototype.hasOwnProperty.call(value_, propertyKey)
        ? (value_ as Record<string, unknown>)[propertyKey]
        : undefined;
      result[property.key] = transform(
        v,
        property.typ,
        getProperties,
        property.key
      );
    });
    Object.getOwnPropertyNames(value_).forEach((valueKey) => {
      if (!Object.prototype.hasOwnProperty.call(properties, valueKey)) {
        result[valueKey] = transform(
          (value_ as Record<string, unknown>)[valueKey],
          additional,
          getProperties,
          valueKey
        );
      }
    });
    return result;
  }

  if (typ === "unknown") return value;

  if (typ === null) {
    if (value === null) return value;
    return invalidValue(typ, value);
  }

  if (typ === false) return invalidValue(typ, value);

  while (typeof typ === "object" && (typ as ReferenceType).ref !== undefined) {
    typ = typeMap[(typ as ReferenceType).ref];
  }

  if (Array.isArray(typ) && typeof value === "string")
    return transformEnum(typ, value);

  if (typeof typ === "object") {
    if (Object.prototype.hasOwnProperty.call(typ, "unionMembers")) {
      return transformUnion((typ as UnionType).unionMembers, value);
    }

    if (Object.prototype.hasOwnProperty.call(typ, "arrayItems")) {
      return transformArray((typ as ArrayType).arrayItems, value);
    }

    if (Object.prototype.hasOwnProperty.call(typ, "props")) {
      return transformObject(
        getProperties(typ as ObjectType),
        (typ as ObjectType).additional,
        value
      );
    }

    return invalidValue(typ, value);

    /*
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, value)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, value)
      : typ.hasOwnProperty("props")
      ? transformObject(getProperties(typ), typ.additional, value)
      : invalidValue(typ, value);
      */
  }

  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof value === "string") return transformDate(value);
  return transformPrimitive(typ, value);
}

function cast<T>(value: unknown, typ: unknown): T {
  return transform(value, typ, jsonToJSProperties) as T;
}

function uncast<T>(value: T, typ: unknown): unknown {
  return transform(value, typ, jsToJSONProperties);
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export default class WooConvert {
  public static toWcOrder(json: string): WcOrder {
    return cast(JSON.parse(json), reference("WcOrder"));
  }

  public static wcOrderToJson(value: WcOrder): string {
    return JSON.stringify(uncast(value, reference("WcOrder")), null, 2);
  }
}
