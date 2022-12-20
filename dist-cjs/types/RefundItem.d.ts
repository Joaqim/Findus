import type { InvoiceRowInit } from "./InvoiceInit";
export default interface RefundItem {
    items: InvoiceRowInit[];
    reason: string;
    id: string;
}
