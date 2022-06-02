// To parse this data:
//
//   import { Convert, ArticleBrief, CustomerBrief, Customer, NewWcOrder, InvoiceBrief, Invoice, WcOrder } from "./file";
//
//   const articleBrief = Convert.toArticleBrief(json);
//   const customerBrief = Convert.toCustomerBrief(json);
//   const customer = Convert.toCustomer(json);
//   const newWcOrder = Convert.toNewWcOrder(json);
//   const invoiceBrief = Convert.toInvoiceBrief(json);
//   const invoice = Convert.toInvoice(json);
//   const wcOrder = Convert.toWcOrder(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

import { WcOrder } from "src/types";



// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export default class WooConvert {
    public static toWcOrder(json: string): WcOrder {
        return cast(JSON.parse(json), r("WcOrder"));
    }

    public static wcOrderToJson(value: WcOrder): string {
        return JSON.stringify(uncast(value, r("WcOrder")), null, 2);
    }
}

function invalidValue(typ: any, val: any, key: any = ''): never {
    if (key) {
        throw Error(`Invalid value for key "${key}". Expected type ${JSON.stringify(typ)} but got ${JSON.stringify(val)}`);
    }
    throw Error(`Invalid value ${JSON.stringify(val)} for type ${JSON.stringify(typ)}`, );
}

function jsonToJSProps(typ: any): any {
    if (typ.jsonToJS === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.json] = { key: p.js, typ: p.typ });
        typ.jsonToJS = map;
    }
    return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
    if (typ.jsToJSON === undefined) {
        const map: any = {};
        typ.props.forEach((p: any) => map[p.js] = { key: p.json, typ: p.typ });
        typ.jsToJSON = map;
    }
    return typ.jsToJSON;
}

function transform(val: any, typ: any, getProps: any, key: any = ''): any {
    function transformPrimitive(typ: string, val: any): any {
        if (typeof typ === typeof val) return val;
        return invalidValue(typ, val, key);
    }

    function transformUnion(typs: any[], val: any): any {
        // val must validate against one typ in typs
        const l = typs.length;
        for (let i = 0; i < l; i++) {
            const typ = typs[i];
            try {
                return transform(val, typ, getProps);
            } catch (_) {}
        }
        return invalidValue(typs, val);
    }

    function transformEnum(cases: string[], val: any): any {
        if (cases.indexOf(val) !== -1) return val;
        return invalidValue(cases, val);
    }

    function transformArray(typ: any, val: any): any {
        // val must be an array with no invalid elements
        if (!Array.isArray(val)) return invalidValue("array", val);
        return val.map(el => transform(el, typ, getProps));
    }

    function transformDate(val: any): any {
        if (val === null) {
            return null;
        }
        const d = new Date(val);
        if (isNaN(d.valueOf())) {
            return invalidValue("Date", val);
        }
        return d;
    }

    function transformObject(props: { [k: string]: any }, additional: any, val: any): any {
        if (val === null || typeof val !== "object" || Array.isArray(val)) {
            return invalidValue("object", val);
        }
        const result: any = {};
        Object.getOwnPropertyNames(props).forEach(key => {
            const prop = props[key];
            const v = Object.prototype.hasOwnProperty.call(val, key) ? val[key] : undefined;
            result[prop.key] = transform(v, prop.typ, getProps, prop.key);
        });
        Object.getOwnPropertyNames(val).forEach(key => {
            if (!Object.prototype.hasOwnProperty.call(props, key)) {
                result[key] = transform(val[key], additional, getProps, key);
            }
        });
        return result;
    }

    if (typ === "any") return val;
    if (typ === null) {
        if (val === null) return val;
        return invalidValue(typ, val);
    }
    if (typ === false) return invalidValue(typ, val);
    while (typeof typ === "object" && typ.ref !== undefined) {
        typ = typeMap[typ.ref];
    }
    if (Array.isArray(typ)) return transformEnum(typ, val);
    if (typeof typ === "object") {
        return typ.hasOwnProperty("unionMembers") ? transformUnion(typ.unionMembers, val)
            : typ.hasOwnProperty("arrayItems")    ? transformArray(typ.arrayItems, val)
            : typ.hasOwnProperty("props")         ? transformObject(getProps(typ), typ.additional, val)
            : invalidValue(typ, val);
    }
    // Numbers can be parsed by Date but shouldn't be.
    if (typ === Date && typeof val !== "number") return transformDate(val);
    return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
    return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
    return transform(val, typ, jsToJSONProps);
}

function a(typ: any) {
    return { arrayItems: typ };
}

function u(...typs: any[]) {
    return { unionMembers: typs };
}

function o(props: any[], additional: any) {
    return { props, additional };
}

function m(additional: any) {
    return { props: [], additional };
}

function r(name: string) {
    return { ref: name };
}

const typeMap: any = {
    "ArticleBrief": o([
        { json: "@url", js: "url", typ: u(undefined, "") },
        { json: "ArticleNumber", js: "articleNumber", typ: u(undefined, "") },
        { json: "Description", js: "description", typ: u(undefined, "") },
        { json: "DisposableQuantity", js: "disposableQuantity", typ: u(undefined, "") },
        { json: "EAN", js: "ean", typ: u(undefined, "") },
        { json: "Housework", js: "housework", typ: u(undefined, true) },
        { json: "PurchasePrice", js: "purchasePrice", typ: u(undefined, "") },
        { json: "QuantityInStock", js: "quantityInStock", typ: u(undefined, "") },
        { json: "ReservedQuantity", js: "reservedQuantity", typ: u(undefined, "") },
        { json: "SalesPrice", js: "salesPrice", typ: u(undefined, 0) },
        { json: "StockPlace", js: "stockPlace", typ: u(undefined, "") },
        { json: "StockValue", js: "stockValue", typ: u(undefined, "") },
        { json: "Unit", js: "unit", typ: u(undefined, null) },
        { json: "WebshopArticle", js: "webshopArticle", typ: u(undefined, true) },
    ], false),
    "CustomerBrief": o([
        { json: "@url", js: "url", typ: u(undefined, "") },
        { json: "Address1", js: "address1", typ: u(undefined, "") },
        { json: "Address2", js: "address2", typ: u(undefined, "") },
        { json: "City", js: "city", typ: u(undefined, "") },
        { json: "CustomerNumber", js: "customerNumber", typ: u(undefined, "") },
        { json: "Email", js: "email", typ: u(undefined, "") },
        { json: "Name", js: "name", typ: u(undefined, "") },
        { json: "OrganisationNumber", js: "organisationNumber", typ: u(undefined, "") },
        { json: "Phone", js: "phone", typ: u(undefined, "") },
        { json: "ZipCode", js: "zipCode", typ: u(undefined, "") },
    ], false),
    "Customer": o([
        { json: "@url", js: "url", typ: u(undefined, "") },
        { json: "Active", js: "active", typ: u(undefined, true) },
        { json: "Address1", js: "address1", typ: u(undefined, "") },
        { json: "Address2", js: "address2", typ: u(undefined, null) },
        { json: "City", js: "city", typ: u(undefined, "") },
        { json: "Comments", js: "comments", typ: u(undefined, null) },
        { json: "CostCenter", js: "costCenter", typ: u(undefined, null) },
        { json: "Country", js: "country", typ: u(undefined, "") },
        { json: "CountryCode", js: "countryCode", typ: u(undefined, "") },
        { json: "Currency", js: "currency", typ: u(undefined, "") },
        { json: "CustomerNumber", js: "customerNumber", typ: u(undefined, "") },
        { json: "DefaultDeliveryTypes", js: "defaultDeliveryTypes", typ: u(undefined, r("Default")) },
        { json: "DefaultTemplates", js: "defaultTemplates", typ: u(undefined, r("Default")) },
        { json: "DeliveryAddress1", js: "deliveryAddress1", typ: u(undefined, null) },
        { json: "DeliveryAddress2", js: "deliveryAddress2", typ: u(undefined, null) },
        { json: "DeliveryCity", js: "deliveryCity", typ: u(undefined, null) },
        { json: "DeliveryCountry", js: "deliveryCountry", typ: u(undefined, null) },
        { json: "DeliveryCountryCode", js: "deliveryCountryCode", typ: u(undefined, null) },
        { json: "DeliveryFax", js: "deliveryFax", typ: u(undefined, null) },
        { json: "DeliveryName", js: "deliveryName", typ: u(undefined, null) },
        { json: "DeliveryPhone1", js: "deliveryPhone1", typ: u(undefined, null) },
        { json: "DeliveryPhone2", js: "deliveryPhone2", typ: u(undefined, null) },
        { json: "DeliveryZipCode", js: "deliveryZipCode", typ: u(undefined, null) },
        { json: "Email", js: "email", typ: u(undefined, "") },
        { json: "EmailInvoice", js: "emailInvoice", typ: u(undefined, "") },
        { json: "EmailInvoiceBCC", js: "emailInvoiceBCC", typ: u(undefined, "") },
        { json: "EmailInvoiceCC", js: "emailInvoiceCC", typ: u(undefined, "") },
        { json: "EmailOffer", js: "emailOffer", typ: u(undefined, "") },
        { json: "EmailOfferBCC", js: "emailOfferBCC", typ: u(undefined, "") },
        { json: "EmailOfferCC", js: "emailOfferCC", typ: u(undefined, "") },
        { json: "EmailOrder", js: "emailOrder", typ: u(undefined, "") },
        { json: "EmailOrderBCC", js: "emailOrderBCC", typ: u(undefined, "") },
        { json: "EmailOrderCC", js: "emailOrderCC", typ: u(undefined, "") },
        { json: "Fax", js: "fax", typ: u(undefined, null) },
        { json: "GLN", js: "gln", typ: u(undefined, null) },
        { json: "GLNDelivery", js: "glnDelivery", typ: u(undefined, null) },
        { json: "InvoiceAdministrationFee", js: "invoiceAdministrationFee", typ: u(undefined, null) },
        { json: "InvoiceDiscount", js: "invoiceDiscount", typ: u(undefined, null) },
        { json: "InvoiceFreight", js: "invoiceFreight", typ: u(undefined, null) },
        { json: "InvoiceRemark", js: "invoiceRemark", typ: u(undefined, "") },
        { json: "Name", js: "name", typ: u(undefined, "") },
        { json: "OrganisationNumber", js: "organisationNumber", typ: u(undefined, "") },
        { json: "OurReference", js: "ourReference", typ: u(undefined, "") },
        { json: "Phone1", js: "phone1", typ: u(undefined, "") },
        { json: "Phone2", js: "phone2", typ: u(undefined, null) },
        { json: "PriceList", js: "priceList", typ: u(undefined, "") },
        { json: "Project", js: "project", typ: u(undefined, "") },
        { json: "SalesAccount", js: "salesAccount", typ: u(undefined, null) },
        { json: "ShowPriceVATIncluded", js: "showPriceVATIncluded", typ: u(undefined, true) },
        { json: "TermsOfDelivery", js: "termsOfDelivery", typ: u(undefined, "") },
        { json: "TermsOfPayment", js: "termsOfPayment", typ: u(undefined, "") },
        { json: "Type", js: "type", typ: u(undefined, "") },
        { json: "VATNumber", js: "vatNumber", typ: u(undefined, "") },
        { json: "VATType", js: "vatType", typ: u(undefined, "") },
        { json: "VisitingAddress", js: "visitingAddress", typ: u(undefined, null) },
        { json: "VisitingCity", js: "visitingCity", typ: u(undefined, null) },
        { json: "VisitingCountry", js: "visitingCountry", typ: u(undefined, null) },
        { json: "VisitingCountryCode", js: "visitingCountryCode", typ: u(undefined, null) },
        { json: "VisitingZipCode", js: "visitingZipCode", typ: u(undefined, null) },
        { json: "WWW", js: "www", typ: u(undefined, "") },
        { json: "WayOfDelivery", js: "wayOfDelivery", typ: u(undefined, "") },
        { json: "YourReference", js: "yourReference", typ: u(undefined, "") },
        { json: "ZipCode", js: "zipCode", typ: u(undefined, "") },
    ], false),
    "Default": o([
        { json: "Invoice", js: "invoice", typ: u(undefined, "") },
        { json: "Offer", js: "offer", typ: u(undefined, "") },
        { json: "Order", js: "order", typ: u(undefined, "") },
        { json: "CashInvoice", js: "cashInvoice", typ: u(undefined, "") },
    ], false),
    "NewWcOrder": o([
    ], false),
    "InvoiceBrief": o([
        { json: "@url", js: "url", typ: u(undefined, "") },
        { json: "Balance", js: "balance", typ: u(undefined, 0) },
        { json: "Booked", js: "booked", typ: u(undefined, true) },
        { json: "Cancelled", js: "cancelled", typ: u(undefined, true) },
        { json: "CostCenter", js: "costCenter", typ: u(undefined, "") },
        { json: "Currency", js: "currency", typ: u(undefined, "") },
        { json: "CurrencyRate", js: "currencyRate", typ: u(undefined, "") },
        { json: "CurrencyUnit", js: "currencyUnit", typ: u(undefined, 0) },
        { json: "CustomerName", js: "customerName", typ: u(undefined, "") },
        { json: "CustomerNumber", js: "customerNumber", typ: u(undefined, "") },
        { json: "DocumentNumber", js: "documentNumber", typ: u(undefined, "") },
        { json: "DueDate", js: "dueDate", typ: u(undefined, Date) },
        { json: "ExternalInvoiceReference1", js: "externalInvoiceReference1", typ: u(undefined, "") },
        { json: "ExternalInvoiceReference2", js: "externalInvoiceReference2", typ: u(undefined, "") },
        { json: "InvoiceDate", js: "invoiceDate", typ: u(undefined, Date) },
        { json: "InvoiceType", js: "invoiceType", typ: u(undefined, "") },
        { json: "NoxFinans", js: "noxFinans", typ: u(undefined, true) },
        { json: "OCR", js: "ocr", typ: u(undefined, "") },
        { json: "Project", js: "project", typ: u(undefined, "") },
        { json: "Sent", js: "sent", typ: u(undefined, true) },
        { json: "TermsOfPayment", js: "termsOfPayment", typ: u(undefined, "") },
        { json: "Total", js: "total", typ: u(undefined, 0) },
        { json: "WayOfDelivery", js: "wayOfDelivery", typ: u(undefined, "") },
    ], false),
    "Invoice": o([
        { json: "@url", js: "url", typ: u(undefined, "") },
        { json: "@urlTaxReductionList", js: "urlTaxReductionList", typ: u(undefined, "") },
        { json: "Address1", js: "address1", typ: u(undefined, "") },
        { json: "Address2", js: "address2", typ: u(undefined, "") },
        { json: "AdministrationFee", js: "administrationFee", typ: u(undefined, 0) },
        { json: "AdministrationFeeVAT", js: "administrationFeeVAT", typ: u(undefined, 0) },
        { json: "Balance", js: "balance", typ: u(undefined, 0) },
        { json: "BasisTaxReduction", js: "basisTaxReduction", typ: u(undefined, 0) },
        { json: "Booked", js: "booked", typ: u(undefined, true) },
        { json: "Cancelled", js: "cancelled", typ: u(undefined, true) },
        { json: "City", js: "city", typ: u(undefined, "") },
        { json: "Comments", js: "comments", typ: u(undefined, "") },
        { json: "ContractReference", js: "contractReference", typ: u(undefined, 0) },
        { json: "ContributionPercent", js: "contributionPercent", typ: u(undefined, 3.14) },
        { json: "ContributionValue", js: "contributionValue", typ: u(undefined, 0) },
        { json: "CostCenter", js: "costCenter", typ: u(undefined, "") },
        { json: "Country", js: "country", typ: u(undefined, "") },
        { json: "Credit", js: "credit", typ: u(undefined, "") },
        { json: "CreditInvoiceReference", js: "creditInvoiceReference", typ: u(undefined, "") },
        { json: "Currency", js: "currency", typ: u(undefined, "") },
        { json: "CurrencyRate", js: "currencyRate", typ: u(undefined, 0) },
        { json: "CurrencyUnit", js: "currencyUnit", typ: u(undefined, 0) },
        { json: "CustomerName", js: "customerName", typ: u(undefined, "") },
        { json: "CustomerNumber", js: "customerNumber", typ: u(undefined, "") },
        { json: "DeliveryAddress1", js: "deliveryAddress1", typ: u(undefined, "") },
        { json: "DeliveryAddress2", js: "deliveryAddress2", typ: u(undefined, "") },
        { json: "DeliveryCity", js: "deliveryCity", typ: u(undefined, "") },
        { json: "DeliveryCountry", js: "deliveryCountry", typ: u(undefined, "") },
        { json: "DeliveryDate", js: "deliveryDate", typ: u(undefined, null) },
        { json: "DeliveryName", js: "deliveryName", typ: u(undefined, "") },
        { json: "DeliveryZipCode", js: "deliveryZipCode", typ: u(undefined, "") },
        { json: "DocumentNumber", js: "documentNumber", typ: u(undefined, "") },
        { json: "DueDate", js: "dueDate", typ: u(undefined, Date) },
        { json: "EDIInformation", js: "ediInformation", typ: u(undefined, r("EDIInformation")) },
        { json: "EUQuarterlyReport", js: "euQuarterlyReport", typ: u(undefined, true) },
        { json: "EmailInformation", js: "emailInformation", typ: u(undefined, r("EmailInformation")) },
        { json: "ExternalInvoiceReference1", js: "externalInvoiceReference1", typ: u(undefined, "") },
        { json: "ExternalInvoiceReference2", js: "externalInvoiceReference2", typ: u(undefined, "") },
        { json: "Freight", js: "freight", typ: u(undefined, 0) },
        { json: "FreightVAT", js: "freightVAT", typ: u(undefined, 3.14) },
        { json: "Gross", js: "gross", typ: u(undefined, 0) },
        { json: "HouseWork", js: "houseWork", typ: u(undefined, true) },
        { json: "InvoiceDate", js: "invoiceDate", typ: u(undefined, Date) },
        { json: "InvoicePeriodEnd", js: "invoicePeriodEnd", typ: u(undefined, "") },
        { json: "InvoicePeriodStart", js: "invoicePeriodStart", typ: u(undefined, "") },
        { json: "InvoiceReference", js: "invoiceReference", typ: u(undefined, "") },
        { json: "InvoiceRows", js: "invoiceRows", typ: u(undefined, a(r("InvoiceRow"))) },
        { json: "InvoiceType", js: "invoiceType", typ: u(undefined, "") },
        { json: "Labels", js: "labels", typ: u(undefined, a(r("Label"))) },
        { json: "Language", js: "language", typ: u(undefined, "") },
        { json: "LastRemindDate", js: "lastRemindDate", typ: u(undefined, null) },
        { json: "Net", js: "net", typ: u(undefined, 0) },
        { json: "NotCompleted", js: "notCompleted", typ: u(undefined, true) },
        { json: "NoxFinans", js: "noxFinans", typ: u(undefined, true) },
        { json: "OCR", js: "ocr", typ: u(undefined, "") },
        { json: "OfferReference", js: "offerReference", typ: u(undefined, "") },
        { json: "OrderReference", js: "orderReference", typ: u(undefined, "") },
        { json: "OrganisationNumber", js: "organisationNumber", typ: u(undefined, "") },
        { json: "OurReference", js: "ourReference", typ: u(undefined, "") },
        { json: "PaymentWay", js: "paymentWay", typ: u(undefined, "") },
        { json: "Phone1", js: "phone1", typ: u(undefined, "") },
        { json: "Phone2", js: "phone2", typ: u(undefined, "") },
        { json: "PriceList", js: "priceList", typ: u(undefined, "") },
        { json: "PrintTemplate", js: "printTemplate", typ: u(undefined, "") },
        { json: "Project", js: "project", typ: u(undefined, "") },
        { json: "Remarks", js: "remarks", typ: u(undefined, "") },
        { json: "Reminders", js: "reminders", typ: u(undefined, 0) },
        { json: "RoundOff", js: "roundOff", typ: u(undefined, 3.14) },
        { json: "Sent", js: "sent", typ: u(undefined, true) },
        { json: "TaxReduction", js: "taxReduction", typ: u(undefined, null) },
        { json: "TaxReductionType", js: "taxReductionType", typ: u(undefined, "") },
        { json: "TermsOfDelivery", js: "termsOfDelivery", typ: u(undefined, "") },
        { json: "TermsOfPayment", js: "termsOfPayment", typ: u(undefined, "") },
        { json: "Total", js: "total", typ: u(undefined, 0) },
        { json: "TotalToPay", js: "totalToPay", typ: u(undefined, 0) },
        { json: "TotalVAT", js: "totalVAT", typ: u(undefined, 3.14) },
        { json: "VATIncluded", js: "vatIncluded", typ: u(undefined, true) },
        { json: "VoucherNumber", js: "voucherNumber", typ: u(undefined, null) },
        { json: "VoucherSeries", js: "voucherSeries", typ: u(undefined, null) },
        { json: "VoucherYear", js: "voucherYear", typ: u(undefined, null) },
        { json: "WayOfDelivery", js: "wayOfDelivery", typ: u(undefined, "") },
        { json: "YourOrderNumber", js: "yourOrderNumber", typ: u(undefined, "") },
        { json: "YourReference", js: "yourReference", typ: u(undefined, "") },
        { json: "ZipCode", js: "zipCode", typ: u(undefined, "") },
    ], false),
    "EDIInformation": o([
        { json: "EDIGlobalLocationNumber", js: "ediGlobalLocationNumber", typ: u(undefined, "") },
        { json: "EDIGlobalLocationNumberDelivery", js: "ediGlobalLocationNumberDelivery", typ: u(undefined, "") },
        { json: "EDIInvoiceExtra1", js: "ediInvoiceExtra1", typ: u(undefined, "") },
        { json: "EDIInvoiceExtra2", js: "ediInvoiceExtra2", typ: u(undefined, "") },
        { json: "EDIOurElectronicReference", js: "ediOurElectronicReference", typ: u(undefined, "") },
        { json: "EDIYourElectronicReference", js: "ediYourElectronicReference", typ: u(undefined, "") },
    ], false),
    "EmailInformation": o([
        { json: "EmailAddressBCC", js: "emailAddressBCC", typ: u(undefined, null) },
        { json: "EmailAddressCC", js: "emailAddressCC", typ: u(undefined, null) },
        { json: "EmailAddressFrom", js: "emailAddressFrom", typ: u(undefined, null) },
        { json: "EmailAddressTo", js: "emailAddressTo", typ: u(undefined, "") },
        { json: "EmailBody", js: "emailBody", typ: u(undefined, "") },
        { json: "EmailSubject", js: "emailSubject", typ: u(undefined, "") },
    ], false),
    "InvoiceRow": o([
        { json: "AccountNumber", js: "accountNumber", typ: u(undefined, 0) },
        { json: "ArticleNumber", js: "articleNumber", typ: u(undefined, "") },
        { json: "ContributionPercent", js: "contributionPercent", typ: u(undefined, 3.14) },
        { json: "ContributionValue", js: "contributionValue", typ: u(undefined, 0) },
        { json: "CostCenter", js: "costCenter", typ: u(undefined, null) },
        { json: "DeliveredQuantity", js: "deliveredQuantity", typ: u(undefined, "") },
        { json: "Description", js: "description", typ: u(undefined, "") },
        { json: "Discount", js: "discount", typ: u(undefined, 0) },
        { json: "DiscountType", js: "discountType", typ: u(undefined, "") },
        { json: "HouseWork", js: "houseWork", typ: u(undefined, true) },
        { json: "HouseWorkHoursToReport", js: "houseWorkHoursToReport", typ: u(undefined, null) },
        { json: "HouseWorkType", js: "houseWorkType", typ: u(undefined, null) },
        { json: "Price", js: "price", typ: u(undefined, 0) },
        { json: "PriceExcludingVAT", js: "priceExcludingVAT", typ: u(undefined, 0) },
        { json: "Project", js: "project", typ: u(undefined, "") },
        { json: "Total", js: "total", typ: u(undefined, 0) },
        { json: "TotalExcludingVAT", js: "totalExcludingVAT", typ: u(undefined, 0) },
        { json: "Unit", js: "unit", typ: u(undefined, "") },
        { json: "VAT", js: "vat", typ: u(undefined, 0) },
    ], false),
    "Label": o([
        { json: "Id", js: "id", typ: u(undefined, 0) },
    ], false),
    "WcOrder": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "parent_id", js: "parent_id", typ: u(undefined, 0) },
        { json: "status", js: "status", typ: u(undefined, "") },
        { json: "currency", js: "currency", typ: u(undefined, "") },
        { json: "version", js: "version", typ: u(undefined, "") },
        { json: "prices_include_tax", js: "prices_include_tax", typ: u(undefined, true) },
        { json: "date_created", js: "date_created", typ: u(undefined, Date) },
        { json: "date_modified", js: "date_modified", typ: u(undefined, Date) },
        { json: "discount_total", js: "discount_total", typ: u(undefined, "") },
        { json: "discount_tax", js: "discount_tax", typ: u(undefined, "") },
        { json: "shipping_total", js: "shipping_total", typ: u(undefined, "") },
        { json: "shipping_tax", js: "shipping_tax", typ: u(undefined, "") },
        { json: "cart_tax", js: "cart_tax", typ: u(undefined, "") },
        { json: "total", js: "total", typ: u(undefined, "") },
        { json: "total_tax", js: "total_tax", typ: u(undefined, "") },
        { json: "customer_id", js: "customer_id", typ: u(undefined, 0) },
        { json: "order_key", js: "order_key", typ: u(undefined, "") },
        { json: "billing", js: "billing", typ: u(undefined, r("Ing")) },
        { json: "shipping", js: "shipping", typ: u(undefined, r("Ing")) },
        { json: "payment_method", js: "payment_method", typ: u(undefined, "") },
        { json: "payment_method_title", js: "payment_method_title", typ: u(undefined, "") },
        { json: "transaction_id", js: "transaction_id", typ: u(undefined, "") },
        { json: "customer_ip_address", js: "customer_ip_address", typ: u(undefined, "") },
        { json: "customer_user_agent", js: "customer_user_agent", typ: u(undefined, "") },
        { json: "created_via", js: "created_via", typ: u(undefined, "") },
        { json: "customer_note", js: "customer_note", typ: u(undefined, "") },
        { json: "date_completed", js: "date_completed", typ: u(undefined, Date) },
        { json: "date_paid", js: "date_paid", typ: u(undefined, Date) },
        { json: "cart_hash", js: "cart_hash", typ: u(undefined, "") },
        { json: "number", js: "number", typ: u(undefined, "") },
        { json: "meta_data", js: "meta_data", typ: u(undefined, a(r("WcOrderMetaDatum"))) },
        { json: "line_items", js: "line_items", typ: u(undefined, a(r("LineItem"))) },
        { json: "tax_lines", js: "tax_lines", typ: u(undefined, a(r("TaxLine"))) },
        { json: "shipping_lines", js: "shipping_lines", typ: u(undefined, a(r("ShippingLine"))) },
        { json: "fee_lines", js: "fee_lines", typ: u(undefined, a("any")) },
        { json: "coupon_lines", js: "coupon_lines", typ: u(undefined, a("any")) },
        { json: "refunds", js: "refunds", typ: u(undefined, a("any")) },
        { json: "payment_url", js: "payment_url", typ: u(undefined, "") },
        { json: "date_created_gmt", js: "date_created_gmt", typ: u(undefined, Date) },
        { json: "date_modified_gmt", js: "date_modified_gmt", typ: u(undefined, Date) },
        { json: "date_completed_gmt", js: "date_completed_gmt", typ: u(undefined, Date) },
        { json: "date_paid_gmt", js: "date_paid_gmt", typ: u(undefined, Date) },
        { json: "currency_symbol", js: "currency_symbol", typ: u(undefined, "") },
        { json: "_wcpdf_document_link", js: "_wcpdf_document_link", typ: u(undefined, "") },
        { json: "_wc_order_key", js: "_wc_order_key", typ: u(undefined, "") },
        { json: "_links", js: "_links", typ: u(undefined, r("Links")) },
    ], false),
    "Links": o([
        { json: "self", js: "self", typ: u(undefined, a(r("Collection"))) },
        { json: "collection", js: "collection", typ: u(undefined, a(r("Collection"))) },
        { json: "customer", js: "customer", typ: u(undefined, a(r("Collection"))) },
    ], false),
    "Collection": o([
        { json: "href", js: "href", typ: u(undefined, "") },
    ], false),
    "Ing": o([
        { json: "first_name", js: "first_name", typ: u(undefined, "") },
        { json: "last_name", js: "last_name", typ: u(undefined, "") },
        { json: "company", js: "company", typ: u(undefined, "") },
        { json: "address_1", js: "address_1", typ: u(undefined, "") },
        { json: "address_2", js: "address_2", typ: u(undefined, "") },
        { json: "city", js: "city", typ: u(undefined, "") },
        { json: "state", js: "state", typ: u(undefined, "") },
        { json: "postcode", js: "postcode", typ: u(undefined, "") },
        { json: "country", js: "country", typ: u(undefined, "") },
        { json: "email", js: "email", typ: u(undefined, "") },
        { json: "phone", js: "phone", typ: u(undefined, "") },
    ], false),
    "LineItem": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "name", js: "name", typ: u(undefined, "") },
        { json: "product_id", js: "product_id", typ: u(undefined, 0) },
        { json: "variation_id", js: "variation_id", typ: u(undefined, 0) },
        { json: "quantity", js: "quantity", typ: u(undefined, 0) },
        { json: "tax_class", js: "tax_class", typ: u(undefined, "") },
        { json: "subtotal", js: "subtotal", typ: u(undefined, "") },
        { json: "subtotal_tax", js: "subtotal_tax", typ: u(undefined, "") },
        { json: "total", js: "total", typ: u(undefined, "") },
        { json: "total_tax", js: "total_tax", typ: u(undefined, "") },
        { json: "taxes", js: "taxes", typ: u(undefined, a(r("Tax"))) },
        { json: "meta_data", js: "meta_data", typ: u(undefined, a(r("LineItemMetaDatum"))) },
        { json: "sku", js: "sku", typ: u(undefined, "") },
        { json: "price", js: "price", typ: u(undefined, 3.14) },
        { json: "parent_name", js: "parent_name", typ: u(undefined, null) },
        { json: "composite_parent", js: "composite_parent", typ: u(undefined, "") },
        { json: "composite_children", js: "composite_children", typ: u(undefined, a("any")) },
        { json: "bundled_by", js: "bundled_by", typ: u(undefined, "") },
        { json: "bundled_item_title", js: "bundled_item_title", typ: u(undefined, "") },
        { json: "bundled_items", js: "bundled_items", typ: u(undefined, a("any")) },
    ], false),
    "LineItemMetaDatum": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "key", js: "key", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, "") },
        { json: "display_key", js: "display_key", typ: u(undefined, "") },
        { json: "display_value", js: "display_value", typ: u(undefined, "") },
    ], false),
    "Tax": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "total", js: "total", typ: u(undefined, "") },
        { json: "subtotal", js: "subtotal", typ: u(undefined, "") },
    ], false),
    "WcOrderMetaDatum": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "key", js: "key", typ: u(undefined, "") },
        { json: "value", js: "value", typ: u(undefined, u(r("ValueClass"), "")) },
    ], false),
    "ValueClass": o([
        { json: "fbc", js: "fbc", typ: u(undefined, null) },
        { json: "fbp", js: "fbp", typ: u(undefined, "") },
        { json: "pys_landing", js: "pys_landing", typ: u(undefined, "") },
        { json: "pys_source", js: "pys_source", typ: u(undefined, "") },
        { json: "pys_utm", js: "pys_utm", typ: u(undefined, "") },
        { json: "pys_browser_time", js: "pys_browser_time", typ: u(undefined, "") },
        { json: "orders_count", js: "orders_count", typ: u(undefined, 0) },
        { json: "avg_order_value", js: "avg_order_value", typ: u(undefined, 3.14) },
        { json: "ltv", js: "ltv", typ: u(undefined, 3.14) },
    ], false),
    "ShippingLine": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "method_title", js: "method_title", typ: u(undefined, "") },
        { json: "method_id", js: "method_id", typ: u(undefined, "") },
        { json: "instance_id", js: "instance_id", typ: u(undefined, "") },
        { json: "total", js: "total", typ: u(undefined, "") },
        { json: "total_tax", js: "total_tax", typ: u(undefined, "") },
        { json: "taxes", js: "taxes", typ: u(undefined, a("any")) },
        { json: "meta_data", js: "meta_data", typ: u(undefined, a(r("LineItemMetaDatum"))) },
    ], false),
    "TaxLine": o([
        { json: "id", js: "id", typ: u(undefined, 0) },
        { json: "rate_code", js: "rate_code", typ: u(undefined, "") },
        { json: "rate_id", js: "rate_id", typ: u(undefined, 0) },
        { json: "label", js: "label", typ: u(undefined, "") },
        { json: "compound", js: "compound", typ: u(undefined, true) },
        { json: "tax_total", js: "tax_total", typ: u(undefined, "") },
        { json: "shipping_tax_total", js: "shipping_tax_total", typ: u(undefined, "") },
        { json: "rate_percent", js: "rate_percent", typ: u(undefined, 3.14) },
        { json: "meta_data", js: "meta_data", typ: u(undefined, a("any")) },
    ], false),
};
