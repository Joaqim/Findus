import type { Article, LineItem, WcOrder } from "./types";

abstract class Articles {
  public static sanitizeDescriptionForFortnox(description: string): string {
    const replacement = {
      "–": "-",
      "~": "-",
      "{": "(",
      "}": ")",
      "[": "(",
      "]": ")",
      "^": " ",
    };
    description.replace(/[[\]^{}~–]/g, (c) => {
      return (replacement as any)[c];
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
      articleNumber: item.sku,
      description: Articles.sanitizeDescriptionForFortnox(item.name),
      type: "STOCK",
    } as Article;
  }
}

export default Articles;
