/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */

import { Article, Customer, Invoice, WcOrder } from "src/types";
import TypeMap from "./TypeMap";

export function invalidValue(typ: any, value: any, key: any = ""): never {
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

function jsonToJSProperties(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
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
    typ = (TypeMap as any)[typ.ref];
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

function reference(name: string) {
  return { ref: name };
}

export default class JsonConvert {
  public static toArticle(json: string): Article {
    return cast(JSON.parse(json),reference("Article"));
  }

  public static articleToJson(value: Article): string {
    return JSON.stringify(uncast(value,reference("Article")), null, 2);
  }

  public static toInvoice(json: string): Invoice {
    return cast(JSON.parse(json),reference("Invoice"));
  }

  public static invoiceToJson(value: Invoice): string {
    return JSON.stringify(uncast(value,reference("Invoice")), null, 2);
  }

  public static toWcOrder(json: string): WcOrder {
    return cast(JSON.parse(json),reference("WcOrder"));
  }

  public static wcOrderToJson(value: WcOrder): string {
    return JSON.stringify(uncast(value,reference("WcOrder")), null, 2);
  }

  public static toCustomer(json: string): Customer {
    return cast(JSON.parse(json),reference("Customer"));
  }

  public static customerToJson(value: Customer): string {
    return JSON.stringify(uncast(value,reference("Customer")), null, 2);
  }
}
