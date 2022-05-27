import type { Article, LineItem, WcOrder } from "./types";

abstract class Articles {
  public static sanitizeDescriptionForFortnox(description: string): string {
    const replacement: Record<string, string> = {
      "–": "-",
      "~": "-",
      "{": "(",
      "}": ")",
      "[": "(",
      "]": ")",
      "^": " ",
    };
    description.replace(/[[\]^{}~–]/g, (c) => {
      return replacement[c];
    });
    return description;
  }

  public static createArticles(order: WcOrder): Article[] {
    const articles = [];

    for (const item of order.lineItems) {
      articles.push(Articles.createArticle(item));
    }
    return articles;
  }

  public static createArticle(item: LineItem): Article {
    return {
      ArticleNumber: item.sku,
      Description: Articles.sanitizeDescriptionForFortnox(item.name),
      Type: "STOCK",
    } as Article;
  }
}

export default Articles;
