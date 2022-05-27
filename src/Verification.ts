/* eslint-disable class-methods-use-this */

export default class Verification {
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
