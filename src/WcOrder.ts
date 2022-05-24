/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
// To parse this data:
//
//   import { Convert, WcOrder } from "./file";
//
//   const wcOrder = Convert.toWcOrder(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface WcOrder {
    id:                 number;
    parentID:           number;
    number:             string;
    orderKey:           string;
    createdVia:         string;
    version:            string;
    status:             string;
    currency:           string;
    dateCreated:        Date;
    dateCreatedGmt:     Date;
    dateModified:       Date;
    dateModifiedGmt:    Date;
    discountTotal:      string;
    discountTax:        string;
    shippingTotal:      string;
    shippingTax:        string;
    cartTax:            string;
    total:              string;
    totalTax:           string;
    pricesIncludeTax:   boolean;
    customerID:         number;
    customerIPAddress:  string;
    customerUserAgent:  string;
    customerNote:       string;
    billing:            Address;
    shipping:           Address;
    paymentMethod:      string;
    paymentMethodTitle: string;
    transactionID:      string;
    datePaid:           Date;
    datePaidGmt:        Date;
    dateCompleted:      null;
    dateCompletedGmt:   null;
    cartHash:           string;
    metaData:           MetaData[];
    lineItems:          LineItem[];
    taxLines:           TaxLine[];
    shippingLines:      ShippingLine[];
    feeLines:           any[];
    couponLines:        any[];
    refunds:            any[];
    links:              Links;
}

export interface Address {
    firstName: string;
    lastName:  string;
    company:   string;
    address1:  string;
    address2:  string;
    city:      string;
    state:     string;
    postcode:  string;
    country:   string;
    email?:    string;
    phone?:    string;
}

export interface LineItem {
    id:          number;
    name:        string;
    productID:   number;
    variationID: number;
    quantity:    number;
    taxClass:    string;
    subtotal:    string;
    subtotalTax: string;
    total:       string;
    totalTax:    string;
    taxes:       Tax[];
    metaData:    MetaData[];
    sku:         string;
    price:       number;
}

export interface MetaData {
    id:    number;
    key:   string;
    value: string;
}

export interface Tax {
    id:       number;
    total:    string;
    subtotal: string;
}

export interface Links {
    self:       Collection[];
    collection: Collection[];
}

export interface Collection {
    href: string;
}

export interface ShippingLine {
    id:          number;
    methodTitle: string;
    methodID:    string;
    total:       string;
    totalTax:    string;
    taxes:       any[];
    metaData:    any[];
}

export interface TaxLine {
    id:               number;
    rateCode:         string;
    rateID:           number;
    label:            string;
    compound:         boolean;
    taxTotal:         string;
    shippingTaxTotal: string;
    metaData:         any[];
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class WcOrderConvert {
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
    "WcOrder": o([
        { json: "id", js: "id", typ: 0 },
        { json: "parent_id", js: "parentID", typ: 0 },
        { json: "number", js: "number", typ: "" },
        { json: "order_key", js: "orderKey", typ: "" },
        { json: "created_via", js: "createdVia", typ: "" },
        { json: "version", js: "version", typ: "" },
        { json: "status", js: "status", typ: "" },
        { json: "currency", js: "currency", typ: "" },
        { json: "date_created", js: "dateCreated", typ: Date },
        { json: "date_created_gmt", js: "dateCreatedGmt", typ: Date },
        { json: "date_modified", js: "dateModified", typ: Date },
        { json: "date_modified_gmt", js: "dateModifiedGmt", typ: Date },
        { json: "discount_total", js: "discountTotal", typ: "" },
        { json: "discount_tax", js: "discountTax", typ: "" },
        { json: "shipping_total", js: "shippingTotal", typ: "" },
        { json: "shipping_tax", js: "shippingTax", typ: "" },
        { json: "cart_tax", js: "cartTax", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "total_tax", js: "totalTax", typ: "" },
        { json: "prices_include_tax", js: "pricesIncludeTax", typ: true },
        { json: "customer_id", js: "customerID", typ: 0 },
        { json: "customer_ip_address", js: "customerIPAddress", typ: "" },
        { json: "customer_user_agent", js: "customerUserAgent", typ: "" },
        { json: "customer_note", js: "customerNote", typ: "" },
        { json: "billing", js: "billing", typ: r("Ing") },
        { json: "shipping", js: "shipping", typ: r("Ing") },
        { json: "payment_method", js: "paymentMethod", typ: "" },
        { json: "payment_method_title", js: "paymentMethodTitle", typ: "" },
        { json: "transaction_id", js: "transactionID", typ: "" },
        { json: "date_paid", js: "datePaid", typ: Date },
        { json: "date_paid_gmt", js: "datePaidGmt", typ: Date },
        { json: "date_completed", js: "dateCompleted", typ: null },
        { json: "date_completed_gmt", js: "dateCompletedGmt", typ: null },
        { json: "cart_hash", js: "cartHash", typ: "" },
        { json: "meta_data", js: "metaData", typ: a(r("MetaDatum")) },
        { json: "line_items", js: "lineItems", typ: a(r("LineItem")) },
        { json: "tax_lines", js: "taxLines", typ: a(r("TaxLine")) },
        { json: "shipping_lines", js: "shippingLines", typ: a(r("ShippingLine")) },
        { json: "fee_lines", js: "feeLines", typ: a("any") },
        { json: "coupon_lines", js: "couponLines", typ: a("any") },
        { json: "refunds", js: "refunds", typ: a("any") },
        { json: "_links", js: "links", typ: r("Links") },
    ], false),
    "Ing": o([
        { json: "first_name", js: "firstName", typ: "" },
        { json: "last_name", js: "lastName", typ: "" },
        { json: "company", js: "company", typ: "" },
        { json: "address_1", js: "address1", typ: "" },
        { json: "address_2", js: "address2", typ: "" },
        { json: "city", js: "city", typ: "" },
        { json: "state", js: "state", typ: "" },
        { json: "postcode", js: "postcode", typ: "" },
        { json: "country", js: "country", typ: "" },
        { json: "email", js: "email", typ: u(undefined, "") },
        { json: "phone", js: "phone", typ: u(undefined, "") },
    ], false),
    "LineItem": o([
        { json: "id", js: "id", typ: 0 },
        { json: "name", js: "name", typ: "" },
        { json: "product_id", js: "productID", typ: 0 },
        { json: "variation_id", js: "variationID", typ: 0 },
        { json: "quantity", js: "quantity", typ: 0 },
        { json: "tax_class", js: "taxClass", typ: "" },
        { json: "subtotal", js: "subtotal", typ: "" },
        { json: "subtotal_tax", js: "subtotalTax", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "total_tax", js: "totalTax", typ: "" },
        { json: "taxes", js: "taxes", typ: a(r("Tax")) },
        { json: "meta_data", js: "metaData", typ: a(r("MetaDatum")) },
        { json: "sku", js: "sku", typ: "" },
        { json: "price", js: "price", typ: 0 },
    ], false),
    "MetaDatum": o([
        { json: "id", js: "id", typ: 0 },
        { json: "key", js: "key", typ: "" },
        { json: "value", js: "value", typ: "" },
    ], false),
    "Tax": o([
        { json: "id", js: "id", typ: 0 },
        { json: "total", js: "total", typ: "" },
        { json: "subtotal", js: "subtotal", typ: "" },
    ], false),
    "Links": o([
        { json: "self", js: "self", typ: a(r("Collection")) },
        { json: "collection", js: "collection", typ: a(r("Collection")) },
    ], false),
    "Collection": o([
        { json: "href", js: "href", typ: "" },
    ], false),
    "ShippingLine": o([
        { json: "id", js: "id", typ: 0 },
        { json: "method_title", js: "methodTitle", typ: "" },
        { json: "method_id", js: "methodID", typ: "" },
        { json: "total", js: "total", typ: "" },
        { json: "total_tax", js: "totalTax", typ: "" },
        { json: "taxes", js: "taxes", typ: a("any") },
        { json: "meta_data", js: "metaData", typ: a("any") },
    ], false),
    "TaxLine": o([
        { json: "id", js: "id", typ: 0 },
        { json: "rate_code", js: "rateCode", typ: "" },
        { json: "rate_id", js: "rateID", typ: 0 },
        { json: "label", js: "label", typ: "" },
        { json: "compound", js: "compound", typ: true },
        { json: "tax_total", js: "taxTotal", typ: "" },
        { json: "shipping_tax_total", js: "shippingTaxTotal", typ: "" },
        { json: "meta_data", js: "metaData", typ: a("any") },
    ], false),
};
