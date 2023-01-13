/* eslint-disable class-methods-use-this */

import type { Invoice, WcOrder } from "./types";

/**
 * @description
 * Takes an Array<V>, and a grouping function,
 * and returns a Map of the array grouped by the grouping function.
 *
 * @param list An array of type V.
 * @param keyGetter A Function that takes the the Array type V as an input, and returns a value of type K.
 *                  K is generally intended to be a property key of V.
 *
 * @returns Map of the array grouped by the grouping function.
 */ // https://stackoverflow.com/a/38327540
export function groupBy<K, V>(
  list: V[],
  keyGetter: (input: V) => K
): Map<K, V[]> {
  const map = new Map<K, V[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);

    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

interface InvoiceAccrualRow {
  Account?: number;
  Debit?: number;
  Credit?: number;
  TransactionInformation?: string;
}

export default class Verification {
  public static tryCreateVerification(
    invoice: Invoice,
    order?: WcOrder,
    withPaymentFee = false
    // expense?: Expense
  ): InvoiceAccrualRow[] {
    const result: InvoiceAccrualRow[] = [];

    groupBy(invoice.InvoiceRows, (row) => row.AccountNumber).forEach(
      (rows, account) => {
        let credit = 0;
        let description: string | undefined;

        rows.forEach((row) => {
          credit += row.Price * (row.DeliveredQuantity ?? 1);

          if (!description) description = row.Description;
        });

        result.push({
          Account: account,
          Debit: 0,
          Credit: parseFloat(credit.toFixed(8)),
          TransactionInformation: description,
        });
      }
    );

    if (withPaymentFee && !order) {
      throw new Error(
        "Order missing for Verification with optional Payment Fee."
      );
    }

    /*
      let paymentMethod: string | undefined;
      try {
        paymentMethod = WcOrders.tryGetPaymentMethod(order);
        // eslint-disable-next-line no-empty
      } catch {}

      if (paymentMethod && WcOrders.hasPaymentFee(order, paymentMethod)) {
        const paymentFee = WcOrders.tryGetPaymentFee(order, paymentMethod);
        result.push({
          Account: (expense ?? WcOrders.tryCreatePaymentFeeExpense(order))
            .Account,
          Debit: paymentFee,
          TransactionInformation: `Utgående Betalningsavgift: ${paymentMethod}`,
        });
      }
      */

    return result.sort((a, b) => {
      if (!a.Account || !b.Account) return 0;

      if (a.Account < 5000) return b.Account - a.Account;
      return a.Account - b.Account;
    });
  }

  // TODO: Add PaymentFee to Verifikat / Accrual Invoice
  /*
  public static addPaymentFee(
    invoiceRows: InvoiceRowInit[], // AccrualInvoiceRows?
    order: WcOrder,
    rate: Rate,
    paymentMethod: "Stripe" | "PayPal"
  ) {
    let feeData: MetaData | undefined;

    const getMetaData = (
      metaDatas: MetaData[],
      key: string
    ): MetaData | undefined =>
      metaDatas.find((value: MetaData) => value.key === key);

    if (paymentMethod === "Stripe") {
      feeData = getMetaData(order.metaData, "_stripe_fee");
    } else if (paymentMethod === "PayPal") {
      feeData = getMetaData(order.metaData, "_paypal_transaction_fee");
    }

    if (!feeData || parseFloat(feeData.value) < 0) {
      throw new Error(`Unexpected Fee: ${paymentMethod}`);
    }
    const fee = parseFloat(feeData.value);

    if (fee <= 0 || fee >= parseFloat(order.total)) {
      throw new Error(`Unexpected fee amount for '${feeData.key}': ${fee}`);
    }

    let salesAccount = Accounts.getSalesAccount(order.billing.country)

    invoiceRows.push({
                accountNumber:
                credit: fee,
                info: $"{paymentMethod} Avgift - Utgående"
    });

    invoiceRows.push({accountNumber: 6570, debit: fee, info: `${paymentMethod} Avgift`});
  }
  */
}
