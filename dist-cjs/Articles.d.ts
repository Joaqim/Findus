import type { Article, WcOrder } from "./types";
declare abstract class Articles {
    static sanitizeTextForFortnox(description: string): string;
    static createArticles(order: WcOrder): Article[];
    private static createArticle;
}
export default Articles;
