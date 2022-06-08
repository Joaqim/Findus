import { object, union, reference, array } from "./TypeMaps/typeMapUtils";

import wooTypeMaps from "./TypeMaps/WooCommerce.config";

export default {
  ...wooTypeMaps,
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
  Default: object(
    [
      { json: "Invoice", js: "Invoice", typ: union(undefined, "") },
      { json: "Offer", js: "Offer", typ: union(undefined, "") },
      { json: "Order", js: "Order", typ: union(undefined, "") },
      { json: "CashInvoice", js: "CashInvoice", typ: union(undefined, "") },
    ],
    false
  ),
};
