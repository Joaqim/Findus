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
  FortnoxFile: object(
    [
      { json: "@url", js: "url", typ: union(undefined, "") },
      {
        json: "Comments",
        js: "comments",
        typ: union(undefined, union(null, "")),
      },
      { json: "Id", js: "id", typ: union(undefined, "") },
      { json: "ArchiveFileId", js: "archiveFileID", typ: union(undefined, "") },
      { json: "Name", js: "name", typ: union(undefined, "") },
      { json: "Path", js: "path", typ: union(undefined, "") },
      { json: "Size", js: "size", typ: union(undefined, 0) },
    ],
    false
  ),
  Article: object(
    [
      { json: "ArticleNumber", js: "ArticleNumber", typ: union(undefined, "") },
      { json: "Description", js: "Description", typ: union(undefined, "") },
      { json: "Type", js: "Type", typ: union(undefined, "") },
    ],
    false
  ),
  Invoice: object(
    [
      { json: "@url", js: "Url", typ: union(undefined, "") },
      {
        json: "@urlTaxReductionList",
        js: "UrlTaxReductionList",
        typ: union(undefined, ""),
      },
      { json: "Address1", js: "Address1", typ: union(undefined, "") },
      { json: "Address2", js: "Address2", typ: union(undefined, "") },
      {
        json: "AdministrationFee",
        js: "AdministrationFee",
        typ: union(undefined, 0),
      },
      {
        json: "AdministrationFeeVAT",
        js: "AdministrationFeeVAT",
        typ: union(undefined, 0),
      },
      { json: "Balance", js: "Balance", typ: union(undefined, 0) },
      {
        json: "BasisTaxReduction",
        js: "BasisTaxReduction",
        typ: union(undefined, 0),
      },
      { json: "Booked", js: "Booked", typ: union(undefined, true) },
      { json: "Cancelled", js: "Cancelled", typ: union(undefined, true) },
      { json: "City", js: "City", typ: union(undefined, "") },
      { json: "Comments", js: "Comments", typ: union(undefined, "") },
      {
        json: "ContractReference",
        js: "ContractReference",
        typ: union(undefined, 0),
      },
      {
        json: "ContributionPercent",
        js: "ContributionPercent",
        typ: union(undefined, 0),
      },
      {
        json: "ContributionValue",
        js: "ContributionValue",
        typ: union(undefined, 0),
      },
      { json: "CostCenter", js: "CostCenter", typ: union(undefined, "") },
      { json: "Country", js: "Country", typ: union(undefined, "") },
      { json: "Credit", js: "Credit", typ: union(undefined, true) },
      {
        json: "CreditInvoiceReference",
        js: "CreditInvoiceReference",
        typ: union(undefined, 0),
      },
      { json: "Currency", js: "Currency", typ: union(undefined, "") },
      { json: "CurrencyRate", js: "CurrencyRate", typ: union(undefined, 0) },
      { json: "CurrencyUnit", js: "CurrencyUnit", typ: union(undefined, 0) },
      { json: "CustomerName", js: "CustomerName", typ: union(undefined, "") },
      {
        json: "CustomerNumber",
        js: "CustomerNumber",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryAddress1",
        js: "DeliveryAddress1",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryAddress2",
        js: "DeliveryAddress2",
        typ: union(undefined, ""),
      },
      { json: "DeliveryCity", js: "DeliveryCity", typ: union(undefined, "") },
      {
        json: "DeliveryCountry",
        js: "DeliveryCountry",
        typ: union(undefined, ""),
      },
      { json: "DeliveryDate", js: "DeliveryDate", typ: union(undefined, Date) },
      { json: "DeliveryName", js: "DeliveryName", typ: union(undefined, "") },
      {
        json: "DeliveryZipCode",
        js: "DeliveryZipCode",
        typ: union(undefined, ""),
      },
      {
        json: "DocumentNumber",
        js: "DocumentNumber",
        typ: union(undefined, ""),
      },
      { json: "DueDate", js: "DueDate", typ: union(undefined, Date) },
      {
        json: "EDIInformation",
        js: "EDIInformation",
        typ: union(undefined, reference("EDIInformation")),
      },
      {
        json: "EUQuarterlyReport",
        js: "EUQuarterlyReport",
        typ: union(undefined, true),
      },
      {
        json: "externalInvoiceReference1",
        js: "ExternalInvoiceReference1",
        typ: union(undefined, ""),
      },
      {
        json: "ExternalInvoiceReference2",
        js: "ExternalInvoiceReference2",
        typ: union(undefined, ""),
      },
      { json: "Freight", js: "Freight", typ: union(undefined, 0) },
      { json: "freightVAT", js: "FreightVAT", typ: union(undefined, 0) },
      { json: "Gross", js: "Gross", typ: union(undefined, 0) },
      { json: "HouseWork", js: "HouseWork", typ: union(undefined, true) },
      { json: "InvoiceDate", js: "InvoiceDate", typ: union(undefined, Date) },
      {
        json: "InvoicePeriodEnd",
        js: "InvoicePeriodEnd",
        typ: union("", undefined),
      },
      {
        json: "InvoicePeriodStart",
        js: "InvoicePeriodStart",
        typ: union("", undefined),
      },
      {
        json: "InvoiceReference",
        js: "InvoiceReference",
        typ: union("", undefined),
      },
      {
        json: "InvoiceRows",
        js: "InvoiceRows",
        typ: array(reference("InvoiceRow")),
      },
      { json: "InvoiceType", js: "InvoiceType", typ: union(undefined, "") },
      { json: "labels", js: "Labels", typ: array(reference("Label")) },
      { json: "Language", js: "Language", typ: union(undefined, "") },
      {
        json: "LastRemindDate",
        js: "LastRemindDate",
        typ: union(undefined, Date),
      },
      { json: "Net", js: "Net", typ: union(undefined, 0) },
      { json: "NotCompleted", js: "NotCompleted", typ: union(undefined, true) },
      { json: "NoxFinans", js: "NoxFinans", typ: union(undefined, true) },
      { json: "OCR", js: "OCR", typ: union(undefined, "") },
      {
        json: "OfferReference",
        js: "OfferReference",
        typ: union(undefined, ""),
      },
      {
        json: "OrderReference",
        js: "OrderReference",
        typ: union(undefined, ""),
      },
      {
        json: "OrganisationNumber",
        js: "OrganisationNumber",
        typ: union(undefined, ""),
      },
      { json: "OurReference", js: "OurReference", typ: union(undefined, "") },
      { json: "PaymentWay", js: "PaymentWay", typ: union(undefined, "") },
      { json: "Phone1", js: "Phone1", typ: union(undefined, "") },
      { json: "Phone2", js: "Phone2", typ: union(undefined, "") },
      { json: "PriceList", js: "PriceList", typ: union(undefined, "") },
      { json: "PrintTemplate", js: "PrintTemplate", typ: union(undefined, "") },
      { json: "Project", js: "Project", typ: union(undefined, "") },
      { json: "Remarks", js: "Remarks", typ: union(undefined, "") },
      { json: "Reminders", js: "Reminders", typ: union(undefined, 0) },
      { json: "RoundOff", js: "RoundOff", typ: union(undefined, 0) },
      { json: "Sent", js: "Sent", typ: union(undefined, true) },
      { json: "TaxReduction", js: "TaxReduction", typ: union(undefined, 0) },
      {
        json: "TaxReductionType",
        js: "TaxReductionType",
        typ: union(undefined, ""),
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
      { json: "Total", js: "Total", typ: union(undefined, 0) },
      { json: "TotalToPay", js: "TotalToPay", typ: union(undefined, 0) },
      { json: "TotalVAT", js: "TotalVAT", typ: union(undefined, 0) },
      { json: "VATIncluded", js: "VatIncluded", typ: union(undefined, true) },
      {
        json: "VoucherNumber",
        js: "VoucherNumber",
        typ: union(undefined, ""),
      },
      {
        json: "VoucherSeries",
        js: "VoucherSeries",
        typ: union(undefined, ""),
      },
      { json: "VoucherYear", js: "VoucherYear", typ: union(undefined, "") },
      { json: "WayOfDelivery", js: "WayOfDelivery", typ: union(undefined, "") },
      {
        json: "YourOrderNumber",
        js: "YourOrderNumber",
        typ: union(undefined, ""),
      },
      { json: "YourReference", js: "YourReference", typ: union(undefined, "") },
      { json: "ZipCode", js: "ZipCode", typ: union(undefined, "") },
    ],
    false
  ),
  EDIInformation: object(
    [
      {
        json: "EDIGlobalLocationNumber",
        js: "EDIGlobalLocationNumber",
        typ: union(undefined, ""),
      },
      {
        json: "EDIGlobalLocationNumberDelivery",
        js: "EDIGlobalLocationNumberDelivery",
        typ: union(undefined, ""),
      },
      {
        json: "EDIInvoiceExtra1",
        js: "EDIInvoiceExtra1",
        typ: union(undefined, ""),
      },
      {
        json: "EDIInvoiceExtra2",
        js: "EDIInvoiceExtra2",
        typ: union(undefined, ""),
      },
      {
        json: "EDIOurElectronicReference",
        js: "EDIOurElectronicReference",
        typ: union(undefined, ""),
      },
      {
        json: "EDIYourElectronicReference",
        js: "EDIYourElectronicReference",
        typ: union(undefined, ""),
      },
    ],
    false
  ),
  InvoiceRow: object(
    [
      { json: "AccountNumber", js: "AccountNumber", typ: union(undefined, 0) },
      { json: "ArticleNumber", js: "ArticleNumber", typ: union(undefined, "") },
      {
        json: "ContributionPercent",
        js: "ContributionPercent",
        typ: union(undefined, 0),
      },
      {
        json: "ContributionValue",
        js: "ContributionValue",
        typ: union(undefined, 0),
      },
      { json: "CostCenter", js: "CostCenter", typ: union(undefined, "") },
      {
        json: "DeliveredQuantity",
        js: "DeliveredQuantity",
        typ: union(undefined, ""),
      },
      { json: "Description", js: "Description", typ: union(undefined, "") },
      { json: "Discount", js: "Discount", typ: union(undefined, 0) },
      { json: "DiscountType", js: "DiscountType", typ: union(undefined, "") },
      { json: "HouseWork", js: "HouseWork", typ: union(undefined, true) },
      {
        json: "HouseWorkHoursToReport",
        js: "HouseWorkHoursToReport",
        typ: union(undefined, ""),
      },
      {
        json: "HouseWorkType",
        js: "HouseWorkType",
        typ: union(undefined, ""),
      },
      { json: "Price", js: "Price", typ: union(undefined, 0) },
      {
        json: "PriceExcludingVAT",
        js: "PriceExcludingVAT",
        typ: union(undefined, 0),
      },
      { json: "Project", js: "Project", typ: union(undefined, "") },
      { json: "Total", js: "Total", typ: union(undefined, 0) },
      {
        json: "TotalExcludingVAT",
        js: "TotalExcludingVAT",
        typ: union(undefined, 0),
      },
      { json: "Unit", js: "Unit", typ: union(undefined, "") },
      { json: "VAT", js: "VAT", typ: union(undefined, 0) },
    ],
    false
  ),
  Label: object([{ json: "Id", js: "Id", typ: 0 }], false),
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
      {
        json: "date_modified",
        js: "dateModified",
        typ: union(undefined, Date),
      },
      {
        json: "date_modified_gmt",
        js: "dateModifiedGmt",
        typ: union(undefined, Date),
      },
      {
        json: "discount_total",
        js: "discountTotal",
        typ: union(undefined, ""),
      },
      { json: "discount_tax", js: "discountTax", typ: union(undefined, "") },
      {
        json: "shipping_total",
        js: "shippingTotal",
        typ: union(undefined, ""),
      },
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
      {
        json: "billing",
        js: "billing",
        typ: union(undefined, reference("Address")),
      },
      {
        json: "shipping",
        js: "shipping",
        typ: union(undefined, reference("Address")),
      },
      {
        json: "payment_method",
        js: "paymentMethod",
        typ: union(undefined, ""),
      },
      {
        json: "payment_method_title",
        js: "paymentMethodTitle",
        typ: union(undefined, ""),
      },
      {
        json: "transaction_id",
        js: "transactionID",
        typ: union(undefined, ""),
      },
      { json: "date_paid", js: "datePaid", typ: union(undefined, Date) },
      { json: "date_paid_gmt", js: "datePaidGmt", typ: union(undefined, Date) },
      {
        json: "date_completed",
        js: "dateCompleted",
        typ: union(undefined, Date),
      },
      {
        json: "date_completed_gmt",
        js: "dateCompletedGmt",
        typ: union(undefined, Date),
      },
      { json: "cart_hash", js: "cartHash", typ: union(undefined, "") },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("MetaDatum"))),
      },
      {
        json: "line_items",
        js: "lineItems",
        typ: union(undefined, array(reference("LineItem"))),
      },
      {
        json: "tax_lines",
        js: "taxLines",
        typ: union(undefined, array(reference("TaxLine"))),
      },
      {
        json: "shipping_lines",
        js: "shippingLines",
        typ: union(undefined, array(reference("ShippingLine"))),
      },
      {
        json: "fee_lines",
        js: "feeLines",
        typ: union(undefined, array("any")),
      },
      {
        json: "coupon_lines",
        js: "couponLines",
        typ: union(undefined, array(reference("CouponLine"))),
      },
      {
        json: "refunds",
        js: "refunds",
        typ: union(undefined, array(reference("Refund"))),
      },
      {
        json: "_links",
        js: "links",
        typ: union(undefined, reference("Links")),
      },
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
      {
        json: "taxes",
        js: "taxes",
        typ: union(undefined, array(reference("Tax"))),
      },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array(reference("MetaDatum"))),
      },
      { json: "sku", js: "sku", typ: union(undefined, "") },
      { json: "price", js: "price", typ: union(undefined, 0) },
    ],
    false
  ),
  MetaDatum: object(
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
    ],
    false
  ),
  Collection: object(
    [{ json: "href", js: "href", typ: union(undefined, "") }],
    false
  ),
  ShippingLine: object(
    [
      { json: "id", js: "id", typ: union(undefined, 0) },
      { json: "method_title", js: "methodTitle", typ: union(undefined, "") },
      { json: "method_id", js: "methodID", typ: union(undefined, "") },
      { json: "total", js: "total", typ: union(undefined, "") },
      { json: "total_tax", js: "totalTax", typ: union(undefined, "") },
      { json: "taxes", js: "taxes", typ: union(undefined, array("any")) },
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array("any")),
      },
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
      {
        json: "meta_data",
        js: "metaData",
        typ: union(undefined, array("any")),
      },
    ],
    false
  ),
  Customer: object(
    [
      { json: "@url", js: "Url", typ: union(undefined, "") },
      { json: "Active", js: "Active", typ: union(undefined, "") },
      { json: "Address1", js: "Address1", typ: union(undefined, "") },
      { json: "Address2", js: "Address2", typ: union(undefined, "") },
      { json: "City", js: "City", typ: union(undefined, "") },
      { json: "Comments", js: "Comments", typ: union(undefined, "") },
      { json: "CostCenter", js: "CostCenter", typ: union(undefined, "") },
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
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryAddress2",
        Js: "DeliveryAddress2",
        typ: union(undefined, ""),
      },
      { json: "DeliveryCity", js: "DeliveryCity", typ: union(undefined, "") },
      {
        json: "DeliveryCountry",
        js: "DeliveryCountry",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryCountryCode",
        js: "DeliveryCountryCode",
        typ: union(undefined, ""),
      },
      { json: "DeliveryFax", js: "DeliveryFax", typ: union(undefined, "") },
      { json: "DeliveryName", js: "DeliveryName", typ: union(undefined, "") },
      {
        json: "DeliveryPhone1",
        js: "DeliveryPhone1",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryPhone2",
        js: "DeliveryPhone2",
        typ: union(undefined, ""),
      },
      {
        json: "DeliveryZipCode",
        js: "DeliveryZipCode",
        typ: union(undefined, ""),
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
      { json: "Fax", js: "Fax", typ: union(undefined, "") },
      { json: "GLN", js: "GLN", typ: union(undefined, "") },
      { json: "GLNDelivery", js: "GLNDelivery", typ: union(undefined, "") },
      {
        json: "InvoiceAdministrationFee",
        js: "InvoiceAdministrationFee",
        typ: union(undefined, 0),
      },
      {
        json: "InvoiceDiscount",
        js: "InvoiceDiscount",
        typ: union(undefined, 0),
      },
      {
        json: "InvoiceFreight",
        js: "InvoiceFreight",
        typ: union(undefined, 0),
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
      { json: "Phone2", js: "Phone2", typ: union(undefined, "") },
      { json: "PriceList", js: "PriceList", typ: union(undefined, "") },
      { json: "Project", js: "Project", typ: union(undefined, "") },
      { json: "SalesAccount", js: "SalesAccount", typ: union(undefined, 0) },
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
        typ: union(undefined, ""),
      },
      { json: "VisitingCity", js: "VisitingCity", typ: union(undefined, "") },
      {
        json: "VisitingCountry",
        js: "VisitingCountry",
        typ: union(undefined, ""),
      },
      {
        json: "VisitingCountryCode",
        js: "VisitingCountryCode",
        typ: union(undefined, ""),
      },
      {
        json: "VisitingZipCode",
        js: "VisitingZipCode",
        typ: union(undefined, ""),
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
      { json: "date_expires", js: "dateExpires", typ: union(undefined, Date) },
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
