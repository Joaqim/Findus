export default interface Article {
  articleNumber: string;
  type?: "STOCK" | "SERVICE";
  description: string;
}
