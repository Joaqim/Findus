/* eslint-disable @typescript-eslint/explicit-function-return-type */
function array(typ: unknown) {
  return { arrayItems: typ };
}

function union(...typs: unknown[]) {
  return { unionMembers: typs };
}

function object(properties: unknown[], additional: unknown) {
  return { properties, additional };
}

function reference(name: string) {
  return { reference: name };
}

export default {
  Article: object(
    [
      { json: "ArticleNumber", js: "ArticleNumber", typ: "" },
      { json: "Description", js: "Description", typ: "" },
      { json: "Type", js: "Type", typ: union(undefined, "") },
    ],
    false
  ),
  Invoice: object(
    [
      { json: "@url", js: "Url", typ: "" },
      { json: "@urlTaxReductionList", js: "UrlTaxReductionList", typ: "" },
      { json: "Address1", js: "Address1", typ: "" },
      { json: "Address2", js: "Address2", typ: "" },
      { json: "AdministrationFee", js: "AdministrationFee", typ: 0 },
      { json: "AdministrationFeeVAT", js: "AdministrationFeeVAT", typ: 0 },
      { json: "Balance", js: "Balance", typ: 0 },
      { json: "BasisTaxReduction", js: "BasisTaxReduction", typ: 0 },
      { json: "Booked", js: "Booked", typ: true },
      { json: "Cancelled", js: "Cancelled", typ: true },
      { json: "City", js: "City", typ: "" },
      { json: "Comments", js: "Comments", typ: "" },
      { json: "ContractReference", js: "ContractReference", typ: 0 },
      { json: "ContributionPercent", js: "ContributionPercent", typ: 3.14 },
      { json: "ContributionValue", js: "ContributionValue", typ: 0 },
      { json: "CostCenter", js: "CostCenter", typ: "" },
      { json: "Country", js: "Country", typ: "" },
      { json: "Credit", js: "Credit", typ: "" },
      { json: "CreditInvoiceReference", js: "CreditInvoiceReference", typ: "" },
      { json: "Currency", js: "Currency", typ: "" },
      { json: "CurrencyRate", js: "CurrencyRate", typ: 0 },
      { json: "CurrencyUnit", js: "CurrencyUnit", typ: 0 },
      { json: "CustomerName", js: "CustomerName", typ: "" },
      { json: "CustomerNumber", js: "CustomerNumber", typ: "" },
      { json: "DeliveryAddress1", js: "DeliveryAddress1", typ: "" },
      { json: "DeliveryAddress2", js: "DeliveryAddress2", typ: "" },
      { json: "DeliveryCity", js: "DeliveryCity", typ: "" },
      { json: "DeliveryCountry", js: "DeliveryCountry", typ: "" },
      { json: "DeliveryDate", js: "DeliveryDate", typ: null },
      { json: "DeliveryName", js: "DeliveryName", typ: "" },
      { json: "DeliveryZipCode", js: "DeliveryZipCode", typ: "" },
      { json: "DocumentNumber", js: "DocumentNumber", typ: "" },
      { json: "DueDate", js: "DueDate", typ: Date },
      {
        json: "EDIInformation",
        js: "EDIInformation",
        typ: reference("EDIInformation"),
      },
      { json: "EUQuarterlyReport", js: "EUQuarterlyReport", typ: true },
      {
        json: "externalInvoiceReference1",
        js: "ExternalInvoiceReference1",
        typ: "",
      },
      {
        json: "ExternalInvoiceReference2",
        js: "ExternalInvoiceReference2",
        typ: "",
      },
      { json: "Freight", js: "Freight", typ: 0 },
      { json: "freightVAT", js: "FreightVAT", typ: 3.14 },
      { json: "Gross", js: "Gross", typ: 0 },
      { json: "HouseWork", js: "HouseWork", typ: true },
      { json: "InvoiceDate", js: "InvoiceDate", typ: Date },
      { json: "InvoicePeriodEnd", js: "InvoicePeriodEnd", typ: "" },
      { json: "InvoicePeriodStart", js: "InvoicePeriodStart", typ: "" },
      { json: "InvoiceReference", js: "InvoiceReference", typ: "" },
      {
        json: "InvoiceRows",
        js: "InvoiceRows",
        typ: array(reference("InvoiceRow")),
      },
      { json: "InvoiceType", js: "InvoiceType", typ: "" },
      { json: "labels", js: "Labels", typ: array(reference("Label")) },
      { json: "Language", js: "Language", typ: "" },
      { json: "LastRemindDate", js: "LastRemindDate", typ: null },
      { json: "Net", js: "Net", typ: 0 },
      { json: "NotCompleted", js: "NotCompleted", typ: true },
      { json: "NoxFinans", js: "NoxFinans", typ: true },
      { json: "OCR", js: "OCR", typ: "" },
      { json: "OfferReference", js: "OfferReference", typ: "" },
      { json: "OrderReference", js: "OrderReference", typ: "" },
      { json: "OrganisationNumber", js: "OrganisationNumber", typ: "" },
      { json: "OurReference", js: "OurReference", typ: "" },
      { json: "PaymentWay", js: "PaymentWay", typ: "" },
      { json: "Phone1", js: "Phone1", typ: "" },
      { json: "Phone2", js: "Phone2", typ: "" },
      { json: "PriceList", js: "PriceList", typ: "" },
      { json: "PrintTemplate", js: "PrintTemplate", typ: "" },
      { json: "Project", js: "Project", typ: "" },
      { json: "Remarks", js: "Remarks", typ: "" },
      { json: "Reminders", js: "Reminders", typ: 0 },
      { json: "RoundOff", js: "RoundOff", typ: 3.14 },
      { json: "Sent", js: "Sent", typ: true },
      { json: "TaxReduction", js: "TaxReduction", typ: null },
      { json: "TaxReductionType", js: "TaxReductionType", typ: "" },
      { json: "TermsOfDelivery", js: "TermsOfDelivery", typ: "" },
      { json: "TermsOfPayment", js: "TermsOfPayment", typ: "" },
      { json: "Total", js: "Total", typ: 0 },
      { json: "TotalToPay", js: "TotalToPay", typ: 0 },
      { json: "TotalVAT", js: "TotalVAT", typ: 3.14 },
      { json: "VATIncluded", js: "VatIncluded", typ: true },
      { json: "VoucherNumber", js: "VoucherNumber", typ: null },
      { json: "VoucherSeries", js: "VoucherSeries", typ: null },
      { json: "VoucherYear", js: "VoucherYear", typ: null },
      { json: "WayOfDelivery", js: "WayOfDelivery", typ: "" },
      { json: "YourOrderNumber", js: "YourOrderNumber", typ: "" },
      { json: "YourReference", js: "YourReference", typ: "" },
      { json: "ZipCode", js: "ZipCode", typ: "" },
    ],
    false
  ),
  EDIInformation: object(
    [
      {
        json: "EDIGlobalLocationNumber",
        js: "EDIGlobalLocationNumber",
        typ: "",
      },
      {
        json: "EDIGlobalLocationNumberDelivery",
        js: "EDIGlobalLocationNumberDelivery",
        typ: "",
      },
      { json: "EDIInvoiceExtra1", js: "EDIInvoiceExtra1", typ: "" },
      { json: "EDIInvoiceExtra2", js: "EDIInvoiceExtra2", typ: "" },
      {
        json: "EDIOurElectronicReference",
        js: "EDIOurElectronicReference",
        typ: "",
      },
      {
        json: "EDIYourElectronicReference",
        js: "EDIYourElectronicReference",
        typ: "",
      },
    ],
    false
  ),
  InvoiceRow: object(
    [
      { json: "AccountNumber", js: "AccountNumber", typ: 0 },
      { json: "ArticleNumber", js: "ArticleNumber", typ: "" },
      { json: "ContributionPercent", js: "ContributionPercent", typ: 3.14 },
      { json: "ContributionValue", js: "ContributionValue", typ: 0 },
      { json: "CostCenter", js: "CostCenter", typ: null },
      { json: "DeliveredQuantity", js: "DeliveredQuantity", typ: "" },
      { json: "Description", js: "Description", typ: "" },
      { json: "Discount", js: "Discount", typ: 0 },
      { json: "DiscountType", js: "DiscountType", typ: "" },
      { json: "HouseWork", js: "HouseWork", typ: true },
      {
        json: "HouseWorkHoursToReport",
        js: "HouseWorkHoursToReport",
        typ: null,
      },
      { json: "HouseWorkType", js: "HouseWorkType", typ: null },
      { json: "Price", js: "Price", typ: 0 },
      { json: "PriceExcludingVAT", js: "PriceExcludingVAT", typ: 0 },
      { json: "Project", js: "Project", typ: "" },
      { json: "Total", js: "Total", typ: 0 },
      { json: "TotalExcludingVAT", js: "TotalExcludingVAT", typ: 0 },
      { json: "Unit", js: "Unit", typ: "" },
      { json: "VAT", js: "VAT", typ: 0 },
    ],
    false
  ),
  Label: object([{ json: "Id", js: "Id", typ: 0 }], false),
  WcOrder: object(
    [
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
      { json: "billing", js: "billing", typ: reference("Address") },
      { json: "shipping", js: "shipping", typ: reference("Address") },
      { json: "payment_method", js: "paymentMethod", typ: "" },
      { json: "payment_method_title", js: "paymentMethodTitle", typ: "" },
      { json: "transaction_id", js: "transactionID", typ: "" },
      { json: "date_paid", js: "datePaid", typ: Date },
      { json: "date_paid_gmt", js: "datePaidGmt", typ: Date },
      { json: "date_completed", js: "dateCompleted", typ: null },
      { json: "date_completed_gmt", js: "dateCompletedGmt", typ: null },
      { json: "cart_hash", js: "cartHash", typ: "" },
      { json: "meta_data", js: "metaData", typ: array(reference("MetaDatum")) },
      {
        json: "line_items",
        js: "lineItems",
        typ: array(reference("LineItem")),
      },
      { json: "tax_lines", js: "taxLines", typ: array(reference("TaxLine")) },
      {
        json: "shipping_lines",
        js: "shippingLines",
        typ: array(reference("ShippingLine")),
      },
      { json: "fee_lines", js: "feeLines", typ: array("any") },
      { json: "coupon_lines", js: "couponLines", typ: array("any") },
      { json: "refunds", js: "refunds", typ: array("any") },
      { json: "_links", js: "links", typ: reference("Links") },
    ],
    false
  ),
  Address: object(
    [
      { json: "first_name", js: "firstName", typ: "" },
      { json: "last_name", js: "lastName", typ: "" },
      { json: "company", js: "company", typ: "" },
      { json: "address_1", js: "address1", typ: "" },
      { json: "address_2", js: "address2", typ: "" },
      { json: "city", js: "city", typ: "" },
      { json: "state", js: "state", typ: "" },
      { json: "postcode", js: "postcode", typ: "" },
      { json: "country", js: "country", typ: "" },
      { json: "email", js: "email", typ: union(undefined, "") },
      { json: "phone", js: "phone", typ: union(undefined, "") },
    ],
    false
  ),
  LineItem: object(
    [
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
      { json: "taxes", js: "taxes", typ: array(reference("Tax")) },
      { json: "meta_data", js: "metaData", typ: array(reference("MetaDatum")) },
      { json: "sku", js: "sku", typ: "" },
      { json: "price", js: "price", typ: 0 },
    ],
    false
  ),
  MetaDatum: object(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "key", js: "key", typ: "" },
      { json: "value", js: "value", typ: "" },
    ],
    false
  ),
  Tax: object(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "total", js: "total", typ: "" },
      { json: "subtotal", js: "subtotal", typ: "" },
    ],
    false
  ),
  Links: object(
    [
      { json: "self", js: "self", typ: array(reference("Collection")) },
      {
        json: "collection",
        js: "collection",
        typ: array(reference("Collection")),
      },
    ],
    false
  ),
  Collection: object([{ json: "href", js: "href", typ: "" }], false),
  ShippingLine: object(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "method_title", js: "methodTitle", typ: "" },
      { json: "method_id", js: "methodID", typ: "" },
      { json: "total", js: "total", typ: "" },
      { json: "total_tax", js: "totalTax", typ: "" },
      { json: "taxes", js: "taxes", typ: array("any") },
      { json: "meta_data", js: "metaData", typ: array("any") },
    ],
    false
  ),
  TaxLine: object(
    [
      { json: "id", js: "id", typ: 0 },
      { json: "rate_code", js: "rateCode", typ: "" },
      { json: "rate_id", js: "rateID", typ: 0 },
      { json: "label", js: "label", typ: "" },
      { json: "compound", js: "compound", typ: true },
      { json: "tax_total", js: "taxTotal", typ: "" },
      { json: "shipping_tax_total", js: "shippingTaxTotal", typ: "" },
      { json: "meta_data", js: "metaData", typ: array("any") },
    ],
    false
  ),
  Customer: object(
    [
      { json: "@url", js: "Url", typ: union(undefined, "") },
      { json: "Active", js: "Active", typ: union(undefined, true) },
      { json: "Address1", js: "Address1", typ: union(undefined, "") },
      { json: "Address2", js: "Address2", typ: union(undefined, null) },
      { json: "City", js: "City", typ: union(undefined, "") },
      { json: "Comments", js: "Comments", typ: union(undefined, null) },
      { json: "CostCenter", js: "CostCenter", typ: union(undefined, null) },
      { json: "Country", js: "Country", typ: union(undefined, "") },
      { json: "CountryCode", js: "CountryCode", typ: union(undefined, "") },
      { json: "Currency", js: "Currency", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "CustomerNumber",
        typ: union(undefined, ""),
      },
      {
        json: "DefaultDeliveryTypes",
        js: "DefaultDeliveryTypes",
        typ: union(undefined, reference("Default")),
      },
      {
        json: "DefaultTemplates",
        js: "DefaultTemplates",
        typ: union(undefined, reference("Default")),
      },
      {
        json: "DeliveryAddress1",
        js: "DeliveryAddress1",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryAddress2",
        Js: "DeliveryAddress2",
        typ: union(undefined, null),
      },
      { json: "DeliveryCity", js: "DeliveryCity", typ: union(undefined, null) },
      {
        json: "DeliveryCountry",
        js: "DeliveryCountry",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryCountryCode",
        js: "DeliveryCountryCode",
        typ: union(undefined, null),
      },
      { json: "DeliveryFax", js: "DeliveryFax", typ: union(undefined, null) },
      { json: "DeliveryName", js: "DeliveryName", typ: union(undefined, null) },
      {
        json: "DeliveryPhone1",
        js: "DeliveryPhone1",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryPhone2",
        js: "DeliveryPhone2",
        typ: union(undefined, null),
      },
      {
        json: "DeliveryZipCode",
        js: "DeliveryZipCode",
        typ: union(undefined, null),
      },
      { json: "Email", js: "Email", typ: union(undefined, "") },
      { json: "EmailInvoice", js: "EmailInvoice", typ: union(undefined, "") },
      {
        json: "EmailInvoiceBCC",
        js: "EmailInvoiceBCC",
        typ: union(undefined, ""),
      },
      {
        json: "EmailInvoiceCC",
        js: "EmailInvoiceCC",
        typ: union(undefined, ""),
      },
      { json: "EmailOffer", js: "EmailOffer", typ: union(undefined, "") },
      { json: "EmailOfferBCC", js: "EmailOfferBCC", typ: union(undefined, "") },
      { json: "EmailOfferCC", js: "EmailOfferCC", typ: union(undefined, "") },
      { json: "EmailOrder", js: "EmailOrder", typ: union(undefined, "") },
      { json: "EmailOrderBCC", js: "EmailOrderBCC", typ: union(undefined, "") },
      { json: "EmailOrderCC", js: "EmailOrderCC", typ: union(undefined, "") },
      { json: "Fax", js: "Fax", typ: union(undefined, null) },
      { json: "GLN", js: "GLN", typ: union(undefined, null) },
      { json: "GLNDelivery", js: "GLNDelivery", typ: union(undefined, null) },
      {
        json: "InvoiceAdministrationFee",
        js: "InvoiceAdministrationFee",
        typ: union(undefined, null),
      },
      {
        json: "InvoiceDiscount",
        js: "InvoiceDiscount",
        typ: union(undefined, null),
      },
      {
        json: "InvoiceFreight",
        js: "InvoiceFreight",
        typ: union(undefined, null),
      },
      { json: "InvoiceRemark", js: "InvoiceRemark", typ: union(undefined, "") },
      { json: "Name", js: "Name", typ: union(undefined, "") },
      {
        json: "OrganisationNumber",
        js: "OrganisationNumber",
        typ: union(undefined, ""),
      },
      { json: "OurReference", js: "OurReference", typ: union(undefined, "") },
      { json: "Phone1", js: "Phone1", typ: union(undefined, "") },
      { json: "Phone2", js: "Phone2", typ: union(undefined, null) },
      { json: "PriceList", js: "PriceList", typ: union(undefined, "") },
      { json: "Project", js: "Project", typ: union(undefined, "") },
      { json: "SalesAccount", js: "SalesAccount", typ: union(undefined, null) },
      {
        json: "ShowPriceVATIncluded",
        js: "ShowPriceVATIncluded",
        typ: union(undefined, true),
      },
      {
        json: "TermsOfDelivery",
        js: "TermsOfDelivery",
        typ: union(undefined, ""),
      },
      {
        json: "TermsOfPayment",
        js: "TermsOfPayment",
        typ: union(undefined, ""),
      },
      { json: "Type", js: "Type", typ: union(undefined, "") },
      { json: "VATNumber", js: "VATNumber", typ: union(undefined, "") },
      { json: "VATType", js: "VATType", typ: union(undefined, "") },
      {
        json: "VisitingAddress",
        js: "VisitingAddress",
        typ: union(undefined, null),
      },
      { json: "VisitingCity", js: "VisitingCity", typ: union(undefined, null) },
      {
        json: "VisitingCountry",
        js: "VisitingCountry",
        typ: union(undefined, null),
      },
      {
        json: "VisitingCountryCode",
        js: "VisitingCountryCode",
        typ: union(undefined, null),
      },
      {
        json: "VisitingZipCode",
        js: "VisitingZipCode",
        typ: union(undefined, null),
      },
      { json: "WWW", js: "WWW", typ: union(undefined, "") },
      { json: "WayOfDelivery", js: "WayOfDelivery", typ: union(undefined, "") },
      { json: "YourReference", js: "YourReference", typ: union(undefined, "") },
      { json: "ZipCode", js: "ZipCode", typ: union(undefined, "") },
    ],
    false
  ),
  Default: object(
    [
      { json: "Invoice", js: "Invoice", typ: union(undefined, "") },
      { json: "Offer", js: "Offer", typ: union(undefined, "") },
      { json: "Order", js: "Order", typ: union(undefined, "") },
      { json: "CashInvoice", js: "CashInvoice", typ: union(undefined, "") },
    ],
    false
  ),
  CouponLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "code", js: "code", typ: union(undefined, "") },
      { json: "discount", js: "discount", typ: union(undefined, "") },
      { json: "discount_tax", js: "discountTax", typ: union(undefined, "") },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("CouponLineMetaData"))),
      },
    ],
    false
  ),
  CouponLineMetaData: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "key", js: "key", typ: union(undefined, "") },
      {
        json: "value",
        js: "value",
        typ: union(undefined, reference("DisplayValueClass")),
      },
      { json: "display_key", js: "displayKey", typ: union(undefined, "") },
      {
        json: "display_value",
        js: "displayValue",
        typ: union(undefined, reference("DisplayValueClass")),
      },
    ],
    false
  ),
  DisplayValueClass: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "code", js: "code", typ: union(undefined, "") },
      { json: "amount", js: "amount", typ: union(undefined, "") },
      { json: "status", js: "status", typ: union(undefined, "") },
      {
        json: "date_created",
        js: "dateCreated",
        typ: union(undefined, reference("DateCreatedClass")),
      },
      {
        json: "date_modified",
        js: "dateModified",
        typ: union(undefined, reference("DateCreatedClass")),
      },
      { json: "date_expires", js: "dateExpires", typ: union(undefined, null) },
      { json: "discount_type", js: "discountType", typ: union(undefined, "") },
      { json: "description", js: "description", typ: union(undefined, "") },
      { json: "usage_count", js: "usageCount", typ: union(undefined, 0) },
      {
        json: "individual_use",
        js: "individualUse",
        typ: union(undefined, true),
      },
      {
        json: "product_ids",
        js: "productIDS",
        typ: union(undefined, array("any")),
      },
      {
        json: "excluded_product_ids",
        js: "excludedProductIDS",
        typ: union(undefined, array("any")),
      },
      { json: "usage_limit", js: "usageLimit", typ: union(undefined, 0) },
      {
        json: "usage_limit_per_user",
        js: "usageLimitPerUser",
        typ: union(undefined, 0),
      },
      {
        json: "limit_usage_to_x_items",
        js: "limitUsageToXItems",
        typ: union(undefined, 0),
      },
      {
        json: "free_shipping",
        js: "freeShipping",
        typ: union(undefined, true),
      },
      {
        json: "product_categories",
        js: "productCategories",
        typ: union(undefined, array("any")),
      },
      {
        json: "excluded_product_categories",
        js: "excludedProductCategories",
        typ: union(undefined, array("any")),
      },
      {
        json: "exclude_sale_items",
        js: "excludeSaleItems",
        typ: union(undefined, true),
      },
      {
        json: "minimum_amount",
        js: "minimumAmount",
        typ: union(undefined, ""),
      },
      {
        json: "maximum_amount",
        js: "maximumAmount",
        typ: union(undefined, ""),
      },
      {
        json: "email_restrictions",
        js: "emailRestrictions",
        typ: union(undefined, array("any")),
      },
      { json: "virtual", js: "virtual", typ: union(undefined, true) },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("DisplayValueMetaData"))),
      },
    ],
    false
  ),
  DateCreatedClass: object(
    [
      { json: "date", js: "date", typ: union(undefined, Date) },
      { json: "timezone_type", js: "timezoneType", typ: union(undefined, 0) },
      { json: "timezone", js: "timezone", typ: union(undefined, "") },
    ],
    false
  ),
  DisplayValueMetaData: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "key", js: "key", typ: union(undefined, "") },
      {
        json: "value",
        js: "value",
        typ: union(undefined, union(undefined, array("any"))),
      },
    ],
    false
  ),
};
