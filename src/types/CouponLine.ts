import type { MetaData } from "./WcOrder";

export interface DateCreated {
  date?: Date;
  timezoneType?: number;
  timezone?: string;
}
export type DateModified = DateCreated;

export interface DisplayValueClass {
  id?: number;
  code?: string;
  amount?: string;
  status?: string;
  dateCreated?: DateCreated;
  dateModified?: DateModified;
  dateExpires?: null;
  discountType?: string;
  description?: string;
  usageCount?: number;
  individualUse?: boolean;
  productIDS?: unknown[];
  excludedProductIDS?: unknown[];
  usageLimit?: number;
  usageLimitPerUser?: number;
  limitUsageToXItems?: number;
  freeShipping?: boolean;
  productCategories?: unknown[];
  excludedProductCategories?: unknown[];
  excludeSaleItems?: boolean;
  minimumAmount?: string;
  maximumAmount?: string;
  emailRestrictions?: unknown[];
  virtual?: boolean;
  metaData?: MetaData[];
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
