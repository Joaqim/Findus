import { TaxLine } from "../src";

const taxes: Record<string, TaxLine[]> = {
  FR: [
    {
      id: 6289,
      rate_code: "FR-5.5% VAT-1",
      rate_id: 100,
      label: "5.5% VAT",
      compound: false,
      tax_total: "3.87",
      shipping_tax_total: "0.00",
    },
    {
      id: 6290,
      rate_code: "FR-20% VAT-1",
      rate_id: 73,
      label: "20% VAT",
      compound: false,
      tax_total: "5.22",
      shipping_tax_total: "0.00",
    },
  ],
};

export default taxes;
