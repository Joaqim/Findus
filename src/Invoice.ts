export interface Label {
  id: number;
}

export interface EDIInformation {
  ediGlobalLocationNumber: string;
  ediGlobalLocationNumberDelivery: string;
  ediInvoiceExtra1: string;
  ediInvoiceExtra2: string;
  ediOurElectronicReference: string;
  ediYourElectronicReference: string;
}

export type InvoiceType =
  | "INVOICE"
  | "AGREEMENTINVOICE"
  | "INTRESTINVOICE"
  | "SUMMARYINVOICE"
  | "CASHINVOICE";

export type PaymentWay = "CASH" | "CARD" | "AG";

export interface InvoiceRow {
  accountNumber: number;
  articleNumber: string;
  contributionPercent: number;
  contributionValue: number;
  costCenter: null;
  deliveredQuantity: string;
  description: string;
  discount: number;
  discountType: string;
  houseWork: boolean;
  houseWorkHoursToReport: null;
  houseWorkType: null;
  price: number;
  priceExcludingVAT: number;
  project: string;
  total: number;
  totalExcludingVAT: number;
  unit: string;
  vat: number;
}

export default interface Invoice {
  url: string;
  urlTaxReductionList: string;
  address1: string;
  address2: string;
  administrationFee: number;
  administrationFeeVAT: number;
  balance: number;
  basisTaxReduction: number;
  booked: boolean;
  cancelled: boolean;
  city: string;
  comments: string;
  contractReference: number;
  contributionPercent: number;
  contributionValue: number;
  costCenter: string;
  country: string;
  credit: string;
  creditInvoiceReference: string;
  currency: string;
  currencyRate: number;
  currencyUnit: number;
  customerName: string;
  customerNumber: string;
  deliveryAddress1: string;
  deliveryAddress2: string;
  deliveryCity: string;
  deliveryCountry: string;
  deliveryDate: null;
  deliveryName: string;
  deliveryZipCode: string;
  documentNumber: string;
  dueDate: Date;
  ediInformation: EDIInformation;
  euQuarterlyReport: boolean;
  externalInvoiceReference1: string;
  externalInvoiceReference2: string;
  freight: number;
  freightVAT: number;
  gross: number;
  houseWork: boolean;
  invoiceDate: Date;
  invoicePeriodEnd: string;
  invoicePeriodStart: string;
  invoiceReference: string;
  invoiceRows: InvoiceRow[];
  invoiceType: InvoiceType;
  labels: Label[];
  language: string;
  lastRemindDate: null;
  net: number;
  notCompleted: boolean;
  noxFinans: boolean;
  ocr: string;
  offerReference: string;
  orderReference: string;
  organisationNumber: string;
  ourReference: string;
  paymentWay: PaymentWay;
  phone1: string;
  phone2: string;
  priceList: string;
  printTemplate: string;
  project: string;
  remarks: string;
  reminders: number;
  roundOff: number;
  sent: boolean;
  taxReduction: null;
  taxReductionType: string;
  termsOfDelivery: string;
  termsOfPayment: string;
  total: number;
  totalToPay: number;
  totalVAT: number;
  vatIncluded: boolean;
  voucherNumber: null;
  voucherSeries: null;
  voucherYear: null;
  wayOfDelivery: string;
  yourOrderNumber: string;
  yourReference: string;
  zipCode: string;
}
