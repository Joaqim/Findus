import { array, object, reference, union } from "./typeMapUtils";

const typeMap: any = {
  WcOrder: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "parent_id", js: "parentID", typ: union(undefined, 0) },
      { json: "number", js: "number", typ: union(undefined, "") },
      { json: "order_key", js: "orderKey", typ: union(undefined, "") },
      { json: "created_via", js: "createdVia", typ: union(undefined, "") },
      { json: "version", js: "version", typ: union(undefined, "") },
      { json: "status", js: "status", typ: union(undefined, "") },
      { json: "currency", js: "currency", typ: union(undefined, "") },
      { json: "date_created", js: "dateCreated", typ: union(undefined, Date) },
      {
        json: "date_created_gmt",
        js: "dateCreatedGmt",
        typ: union(undefined, Date),
      },
      { json: "date_modified", js: "dateModified", typ: union(undefined, Date) },
      {
        json: "date_modified_gmt",
        js: "dateModifiedGmt",
        typ: union(undefined, Date),
      },
      { json: "discount_total", js: "discountTotal", typ: union(undefined, "") },
      { json: "discount_tax", js: "discountTax", typ: union(undefined, "") },
      { json: "shipping_total", js: "shippingTotal", typ: union(undefined, "") },
      { json: "shipping_tax", js: "shippingTax", typ: union(undefined, "") },
      { json: "cart_tax", js: "cartTax", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "totalTax", typ: union(undefined, "") },
      {
        json: "prices_include_tax",
        js: "pricesIncludeTax",
        typ: union(undefined, true),
      },
      { json: "customer_id", js: "customerID", typ: union(undefined, 0) },
      {
        json: "customer_ip_address",
        js: "customerIPAddress",
        typ: union(undefined, ""),
      },
      {
        json: "customer_user_agent",
        js: "customerUserAgent",
        typ: union(undefined, ""),
      },
      { json: "customer_note", js: "customerNote", typ: union(undefined, "") },
      { json: "billing", js: "billing", typ: union(undefined, reference("Address")) },
      { json: "shipping", js: "shipping", typ: union(undefined, reference("Address")) },
      { json: "payment_method", js: "paymentMethod", typ: union(undefined, "") },
      {
        json: "payment_method_title",
        js: "paymentMethodTitle",
        typ: union(undefined, ""),
      },
      { json: "transaction_id", js: "transactionID", typ: union(undefined, "") },
      { json: "date_paid", js: "datePaid", typ: union(undefined, Date) },
      { json: "date_paid_gmt", js: "datePaidGmt", typ: union(undefined, Date) },
      { json: "date_completed", js: "dateCompleted", typ: union(undefined, null) },
      {
        json: "date_completed_gmt",
        js: "dateCompletedGmt",
        typ: union(undefined, null),
      },
      { json: "cart_hash", js: "cartHash", typ: union(undefined, "") },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("MetaData"))),
      },
      {
        json: "line_items",
        js: "lineItems",
        typ: union(undefined, array(reference("LineItem"))),
      },
      { json: "tax_lines", js: "taxLines", typ: union(undefined, array(reference("TaxLine"))) },
      {
        json: "shipping_lines",
        js: "shippingLines",
        typ: union(undefined, array(reference("ShippingLine"))),
      },
      { json: "fee_lines", js: "feeLines", typ: union(undefined, array("any")) },
      { json: "coupon_lines", js: "couponLines", typ: union(undefined, array("any")) },
      { json: "refunds", js: "refunds", typ: union(undefined, array("any")) },
      { json: "_links", js: "links", typ: union(undefined, reference("Links")) },
    ],
    false
  ),
  Address: object(
    [
      { json: "first_name", js: "firstName", typ: union(undefined, "") },
      { json: "last_name", js: "lastName", typ: union(undefined, "") },
      { json: "company", js: "company", typ: union(undefined, "") },
      { json: "address_1", js: "address1", typ: union(undefined, "") },
      { json: "address_2", js: "address2", typ: union(undefined, "") },
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
      { json: "product_id", js: "productID", typ: union(undefined, 0) },
      { json: "variation_id", js: "variationID", typ: union(undefined, 0) },
      { json: "quantity", js: "quantity", typ: union(undefined, 0) },
      { json: "tax_class", js: "taxClass", typ: union(undefined, "") },
      { json: "subtotal", js: "subtotal", typ: union(undefined, "") },
      { json: "subtotal_tax", js: "subtotalTax", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "totalTax", typ: union(undefined, "") },
      { json: "taxes", js: "taxes", typ: union(undefined, array(reference("Tax"))) },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("MetaData"))),
      },
      { json: "sku", js: "sku", typ: union(undefined, "") },
      { json: "price", js: "price", typ: union(undefined, 0) },
    ],
    false
  ),
  MetaData: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "key", js: "key", typ: union(undefined, "") },
      { json: "value", js: "value", typ: union(undefined, "") },
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
  Links: object(
    [
      { json: "self", js: "self", typ: union(undefined, array(reference("Collection"))) },
      {
        json: "collection",
        js: "collection",
        typ: union(undefined, array(reference("Collection"))),
      },
    ],
    false
  ),
  Collection: object([{ json: "href", js: "href", typ: union(undefined, "") }], false),
  ShippingLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "method_title", js: "methodTitle", typ: union(undefined, "") },
      { json: "method_id", js: "methodID", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "totalTax", typ: union(undefined, "") },
      { json: "taxes", js: "taxes", typ: union(undefined, array("any")) },
      { json: "meta_data", js: "metaData", typ: union(undefined, array("any")) },
    ],
    false
  ),
  TaxLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "rate_code", js: "rateCode", typ: union(undefined, "") },
      { json: "rate_id", js: "rateID", typ: union(undefined, 0) },
      { json: "label", js: "label", typ: union(undefined, "") },
      { json: "compound", js: "compound", typ: union(undefined, true) },
      { json: "tax_total", js: "taxTotal", typ: union(undefined, "") },
      {
        json: "shipping_tax_total",
        js: "shippingTaxTotal",
        typ: union(undefined, ""),
      },
      { json: "meta_data", js: "metaData", typ: union(undefined, array("any")) },
    ],
    false
  ),
    Refund: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "date_created", js: "dateCreated", typ: union(undefined, Date) },
      {
        json: "date_created_gmt",
        js: "dateCreatedGmt",
        typ: union(undefined, Date),
      },
      { json: "amount", js: "amount", typ: union(undefined, "") },
      { json: "reason", js: "reason", typ: union(undefined, "") },
      { json: "refunded_by", js: "refundedBy", typ: union(undefined, 0) },
      {
        json: "refunded_payment",
        js: "refundedPayment",
        typ: union(undefined, true),
      },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("MetaData"))),
      },
      {
        json: "line_items",
        js: "lineItems",
        typ: union(undefined, array(reference("LineItem"))),
      },
      {
        json: "_links",
        js: "links",
        typ: union(undefined, reference("Links")),
      },
    ],
    false
  ),
};

export default typeMap;