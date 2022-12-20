export default interface Article {
    ArticleNumber: string;
    Type?: "STOCK" | "SERVICE";
    Description: string;
}
