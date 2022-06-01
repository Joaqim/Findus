export default interface Article {
  ArticleNumber: string;
  Type?: "STOCK" | "SERVICE";
  Description: string;
}

/*
export default interface Article {
  url?: string;
  active?: boolean;
  articleNumber?: string;
  bulky?: boolean;
  constructionAccount?: number;
  depth?: null;
  description?: string;
  disposableQuantity?: number;
  ean?: string;
  euAccount?: number;
  euvatAccount?: number;
  exportAccount?: number;
  height?: null;
  housework?: boolean;
  houseworkType?: null;
  manufacturer?: null;
  manufacturerArticleNumber?: null;
  note?: string;
  purchaseAccount?: number;
  purchasePrice?: number;
  quantityInStock?: number;
  reservedQuantity?: number;
  salesPrice?: number;
  salesAccount?: number;
  stockGoods?: boolean;
  stockPlace?: string;
  stockValue?: number;
  stockWarning?: null;
  supplierName?: null;
  supplierNumber?: null;
  type?: string;
  unit?: null;
  vat?: number;
  webshopArticle?: boolean;
  weight?: null;
  width?: null;
  expired?: boolean;
  costCalculationMethod?: null;
  stockAccount?: null;
  stockChangeAccount?: null;
  directCost?: number;
  freightCost?: number;
  otherCost?: number;
}
*/