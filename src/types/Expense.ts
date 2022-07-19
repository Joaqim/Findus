export default interface Expense {
  Code: string; // 6 char limit
  Text: string; // 40 char limit
  Account: number;
  Debit: number;
  Currency?: "SEK" | "EUR" | "USD";
  CurrencyRate?: number;
}
