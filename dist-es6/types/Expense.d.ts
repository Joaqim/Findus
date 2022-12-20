export default interface Expense {
    Code: string;
    Text: string;
    Account: number;
    Debit: number;
    Currency?: "SEK" | "EUR" | "USD";
    CurrencyRate?: number;
}
