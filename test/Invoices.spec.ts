import { WooConvert } from "../src";

import wooOrders from "./orders.mock.json";

describe("Invoices", () => {
  it("Order can be partially refunded", () => {
    const completedOrder = WooConvert.toWcOrder(
      JSON.stringify(wooOrders.data[0])
    );
  });
});
