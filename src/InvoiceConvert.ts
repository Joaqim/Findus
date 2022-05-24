/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

// To parse this data:
//
//   import { Convert, Welcome } from "./file";
//
//   const welcome = Convert.toWelcome(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import type Invoice from "@Invoice";

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class InvoiceConvert {
  public static toInvoice(json: string): Invoice {
    return cast(JSON.parse(json), r("Invoice"));
  }

  public static welcomeToJson(value: Invoice): string {
    return JSON.stringify(uncast(value, r("Invoice")), null, 2);
  }
}

function invalidValue(typ: unknown, value: unknown, key = ""): never {
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

function jsonToJSProperties(typ: any): unknown {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach(
      (p: any) => (map[p.json] = { key: p.js, typ: p.typ })
    );
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProperties(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  value: any,
  typ: any,
  getProperties: any,
  key: any = ""
): any {
  function transformPrimitive(typ: string, value_: any): any {
    if (typeof typ === typeof value_) return value_;
    return invalidValue(typ, value_, key);
  }

  function transformUnion(typs: any[], value_: any): any {
    // val must validate against one typ in typs
    const l = typs.length;

    for (let index = 0; index < l; index++) {
      const typ = typs[index];

      try {
        return transform(value_, typ, getProperties);
      } catch {}
    }
    return invalidValue(typs, value_);
  }

  function transformEnum(cases: string[], value_: any): any {
    if (cases.includes(value_)) return value_;
    return invalidValue(cases, value_);
  }

  function transformArray(typ: any, value_: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(value_)) return invalidValue("array", value_);
    return value_.map((element) => transform(element, typ, getProperties));
  }

  function transformDate(value_: any): any {
    if (value_ === null) {
      return null;
    }
    const d = new Date(value_);

    if (isNaN(d.valueOf())) {
      return invalidValue("Date", value_);
    }
    return d;
  }

  function transformObject(
    properties: Record<string, any>,
    additional: any,
    value_: any
  ): any {
    if (
      value_ === null ||
      typeof value_ !== "object" ||
      Array.isArray(value_)
    ) {
      return invalidValue("object", value_);
    }
    const result: any = {};
    Object.getOwnPropertyNames(properties).forEach((key) => {
      const property = properties[key];
      const v = Object.prototype.hasOwnProperty.call(value_, key)
        ? value_[key]
        : undefined;
      result[property.key] = transform(
        v,
        property.typ,
        getProperties,
        property.key
      );
    });
    Object.getOwnPropertyNames(value_).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(properties, key)) {
        result[key] = transform(value_[key], additional, getProperties, key);
      }
    });
    return result;
  }

  if (typ === "any") return value;

  if (typ === null) {
    if (value === null) return value;
    return invalidValue(typ, value);
  }

  if (typ === false) return invalidValue(typ, value);

  while (typeof typ === "object" && typ.ref !== undefined) {
    typ = typeMap[typ.ref];
  }

  if (Array.isArray(typ)) return transformEnum(typ, value);

  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, value)
      : typ.hasOwnProperty("arrayItems")
      ? transformArray(typ.arrayItems, value)
      : typ.hasOwnProperty("props")
      ? transformObject(getProperties(typ), typ.additional, value)
      : invalidValue(typ, value);
  }

  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof value !== "number") return transformDate(value);
  return transformPrimitive(typ, value);
}

function cast<T>(value: any, typ: any): T {
  return transform(value, typ, jsonToJSProperties);
}

function uncast<T>(value: T, typ: any): any {
  return transform(value, typ, jsToJSONProperties);
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(properties: any[], additional: any) {
  return { props: properties, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  Invoice: o(
    [
      { json: "@url", js: "url", typ: "" },
      { json: "@urlTaxReductionList", js: "urlTaxReductionList", typ: "" },
      { json: "Address1", js: "address1", typ: "" },
      { json: "Address2", js: "address2", typ: "" },
      { json: "AdministrationFee", js: "administrationFee", typ: 0 },
      { json: "AdministrationFeeVAT", js: "administrationFeeVAT", typ: 0 },
      { json: "Balance", js: "balance", typ: 0 },
      { json: "BasisTaxReduction", js: "basisTaxReduction", typ: 0 },
      { json: "Booked", js: "booked", typ: true },
      { json: "Cancelled", js: "cancelled", typ: true },
      { json: "City", js: "city", typ: "" },
      { json: "Comments", js: "comments", typ: "" },
      { json: "ContractReference", js: "contractReference", typ: 0 },
      { json: "ContributionPercent", js: "contributionPercent", typ: 3.14 },
      { json: "ContributionValue", js: "contributionValue", typ: 0 },
      { json: "CostCenter", js: "costCenter", typ: "" },
      { json: "Country", js: "country", typ: "" },
      { json: "Credit", js: "credit", typ: "" },
      { json: "CreditInvoiceReference", js: "creditInvoiceReference", typ: "" },
      { json: "Currency", js: "currency", typ: "" },
      { json: "CurrencyRate", js: "currencyRate", typ: 0 },
      { json: "CurrencyUnit", js: "currencyUnit", typ: 0 },
      { json: "CustomerName", js: "customerName", typ: "" },
      { json: "CustomerNumber", js: "customerNumber", typ: "" },
      { json: "DeliveryAddress1", js: "deliveryAddress1", typ: "" },
      { json: "DeliveryAddress2", js: "deliveryAddress2", typ: "" },
      { json: "DeliveryCity", js: "deliveryCity", typ: "" },
      { json: "DeliveryCountry", js: "deliveryCountry", typ: "" },
      { json: "DeliveryDate", js: "deliveryDate", typ: null },
      { json: "DeliveryName", js: "deliveryName", typ: "" },
      { json: "DeliveryZipCode", js: "deliveryZipCode", typ: "" },
      { json: "DocumentNumber", js: "documentNumber", typ: "" },
      { json: "DueDate", js: "dueDate", typ: Date },
      {
        json: "EDIInformation",
        js: "ediInformation",
        typ: r("EDIInformation"),
      },
      { json: "EUQuarterlyReport", js: "euQuarterlyReport", typ: true },
      {
        json: "ExternalInvoiceReference1",
        js: "externalInvoiceReference1",
        typ: "",
      },
      {
        json: "ExternalInvoiceReference2",
        js: "externalInvoiceReference2",
        typ: "",
      },
      { json: "Freight", js: "freight", typ: 0 },
      { json: "FreightVAT", js: "freightVAT", typ: 3.14 },
      { json: "Gross", js: "gross", typ: 0 },
      { json: "HouseWork", js: "houseWork", typ: true },
      { json: "InvoiceDate", js: "invoiceDate", typ: Date },
      { json: "InvoicePeriodEnd", js: "invoicePeriodEnd", typ: "" },
      { json: "InvoicePeriodStart", js: "invoicePeriodStart", typ: "" },
      { json: "InvoiceReference", js: "invoiceReference", typ: "" },
      { json: "InvoiceRows", js: "invoiceRows", typ: a(r("InvoiceRow")) },
      { json: "InvoiceType", js: "invoiceType", typ: "" },
      { json: "Labels", js: "labels", typ: a(r("Label")) },
      { json: "Language", js: "language", typ: "" },
      { json: "LastRemindDate", js: "lastRemindDate", typ: null },
      { json: "Net", js: "net", typ: 0 },
      { json: "NotCompleted", js: "notCompleted", typ: true },
      { json: "NoxFinans", js: "noxFinans", typ: true },
      { json: "OCR", js: "ocr", typ: "" },
      { json: "OfferReference", js: "offerReference", typ: "" },
      { json: "OrderReference", js: "orderReference", typ: "" },
      { json: "OrganisationNumber", js: "organisationNumber", typ: "" },
      { json: "OurReference", js: "ourReference", typ: "" },
      { json: "PaymentWay", js: "paymentWay", typ: "" },
      { json: "Phone1", js: "phone1", typ: "" },
      { json: "Phone2", js: "phone2", typ: "" },
      { json: "PriceList", js: "priceList", typ: "" },
      { json: "PrintTemplate", js: "printTemplate", typ: "" },
      { json: "Project", js: "project", typ: "" },
      { json: "Remarks", js: "remarks", typ: "" },
      { json: "Reminders", js: "reminders", typ: 0 },
      { json: "RoundOff", js: "roundOff", typ: 3.14 },
      { json: "Sent", js: "sent", typ: true },
      { json: "TaxReduction", js: "taxReduction", typ: null },
      { json: "TaxReductionType", js: "taxReductionType", typ: "" },
      { json: "TermsOfDelivery", js: "termsOfDelivery", typ: "" },
      { json: "TermsOfPayment", js: "termsOfPayment", typ: "" },
      { json: "Total", js: "total", typ: 0 },
      { json: "TotalToPay", js: "totalToPay", typ: 0 },
      { json: "TotalVAT", js: "totalVAT", typ: 3.14 },
      { json: "VATIncluded", js: "vatIncluded", typ: true },
      { json: "VoucherNumber", js: "voucherNumber", typ: null },
      { json: "VoucherSeries", js: "voucherSeries", typ: null },
      { json: "VoucherYear", js: "voucherYear", typ: null },
      { json: "WayOfDelivery", js: "wayOfDelivery", typ: "" },
      { json: "YourOrderNumber", js: "yourOrderNumber", typ: "" },
      { json: "YourReference", js: "yourReference", typ: "" },
      { json: "ZipCode", js: "zipCode", typ: "" },
    ],
    false
  ),
  EDIInformation: o(
    [
      {
        json: "EDIGlobalLocationNumber",
        js: "ediGlobalLocationNumber",
        typ: "",
      },
      {
        json: "EDIGlobalLocationNumberDelivery",
        js: "ediGlobalLocationNumberDelivery",
        typ: "",
      },
      { json: "EDIInvoiceExtra1", js: "ediInvoiceExtra1", typ: "" },
      { json: "EDIInvoiceExtra2", js: "ediInvoiceExtra2", typ: "" },
      {
        json: "EDIOurElectronicReference",
        js: "ediOurElectronicReference",
        typ: "",
      },
      {
        json: "EDIYourElectronicReference",
        js: "ediYourElectronicReference",
        typ: "",
      },
    ],
    false
  ),
  InvoiceRow: o(
    [
      { json: "AccountNumber", js: "accountNumber", typ: 0 },
      { json: "ArticleNumber", js: "articleNumber", typ: "" },
      { json: "ContributionPercent", js: "contributionPercent", typ: 3.14 },
      { json: "ContributionValue", js: "contributionValue", typ: 0 },
      { json: "CostCenter", js: "costCenter", typ: null },
      { json: "DeliveredQuantity", js: "deliveredQuantity", typ: "" },
      { json: "Description", js: "description", typ: "" },
      { json: "Discount", js: "discount", typ: 0 },
      { json: "DiscountType", js: "discountType", typ: "" },
      { json: "HouseWork", js: "houseWork", typ: true },
      {
        json: "HouseWorkHoursToReport",
        js: "houseWorkHoursToReport",
        typ: null,
      },
      { json: "HouseWorkType", js: "houseWorkType", typ: null },
      { json: "Price", js: "price", typ: 0 },
      { json: "PriceExcludingVAT", js: "priceExcludingVAT", typ: 0 },
      { json: "Project", js: "project", typ: "" },
      { json: "Total", js: "total", typ: 0 },
      { json: "TotalExcludingVAT", js: "totalExcludingVAT", typ: 0 },
      { json: "Unit", js: "unit", typ: "" },
      { json: "VAT", js: "vat", typ: 0 },
    ],
    false
  ),
  Label: o([{ json: "Id", js: "id", typ: 0 }], false),
};
