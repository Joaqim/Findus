export type VoucherReferenceTypes =
  | "INVOICE"
  | "SUPPLIERINVOICE"
  | "INVOICEPAYMENT"
  | "SUPPLIERPAYMENT"
  | "MANUAL"
  | "CASHINVOICE"
  | "ACCRUAL";

export interface VoucherRow {
  Account: number;
  Credit: number;
  Description?: Readonly<string>; // Description of the account
  Debit: number;
  Project?: string;
  Removed?: Readonly<boolean>;
  TransactionInformation?: string;
}

export type VoucherApprovalState = 0 | 1 | 2 | 3;
/* The approval state f the voucher.
/ Not for approval: 0
/ Not ready for approval: 1
/ Not approved: 2
/ Approved: 3
*/

interface Voucher {
  Url?: Readonly<string>;
  Comments?: string;
  Description: string;
  Project?: string;
  ReferenceType?: Readonly<VoucherReferenceTypes>;
  TransactionDate: string;
  VoucherNumber?: Readonly<number>;
  VoucherRows?: VoucherRow[];
  VoucherSeries?: string;
  Year?: Readonly<number>; // Id of the year of the voucher
  ApprovalState?: Readonly<VoucherApprovalState>;
}

export default Voucher;
