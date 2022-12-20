import type { WcOrder } from "../../types";
export default class WooConvert {
    static toWcOrder(json: string): WcOrder;
    static wcOrderToJson(value: WcOrder): string;
}
