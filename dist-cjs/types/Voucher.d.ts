export declare type VoucherReferenceTypes = "INVOICE" | "SUPPLIERINVOICE" | "INVOICEPAYMENT" | "SUPPLIERPAYMENT" | "MANUAL" | "CASHINVOICE" | "ACCRUAL";
export interface VoucherRow {
    Account: number;
    Credit: number;
    Description?: Readonly<string>;
    Debit: number;
    Project?: string;
    Removed?: Readonly<boolean>;
    TransactionInformation?: string;
}
export declare type VoucherApprovalState = 0 | 1 | 2 | 3;
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
    Year?: Readonly<number>;
    ApprovalState?: Readonly<VoucherApprovalState>;
}
export default Voucher;
