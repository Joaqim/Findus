import type { MetaData } from "./WcOrder";

export interface DateCreated {
  date?: Date;
  timezone_type?: number;
  timezone?: string;
}
export type DateModified = DateCreated;

export interface DisplayValueClass {
  id?: number;
  code?: string;
  amount?: string;
  status?: string;
  date_created?: DateCreated;
  date_modified?: DateModified;
  date_expires?: null;
  discount_type?: string;
  description?: string;
  usage_count?: number;
  individual_use?: boolean;
  product_ids?: unknown[];
  excluded_product_ids?: unknown[];
  usage_limit?: number;
  usage_limit_per_user?: number;
  limit_usage_to_x_items?: number;
  free_shipping?: boolean;
  product_categories?: unknown[];
  excluded_product_categories?: unknown[];
  exclude_sale_items?: boolean;
  minimum_amount?: string;
  maximum_amount?: string;
  email_restrictions?: unknown[];
  virtual?: boolean;
  meta_data?: MetaData[];
}

export interface CouponLineMetaData {
  id?: number;
  key?: string;
  value?: DisplayValueClass;
  displayKey?: string;
  displayValue?: DisplayValueClass;
}

export default interface CouponLine {
  id?: number;
  code?: string;
  discount?: string;
  discountTax?: string;
  metaData?: CouponLineMetaData[];
}
