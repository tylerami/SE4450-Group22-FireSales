export enum PaymentMethod {
  etransfer = "etransfer",
  paypal = "paypal",
}

export function getPaymentMethodLabel(paymentMethod: PaymentMethod): string {
  switch (paymentMethod) {
    case PaymentMethod.etransfer:
      return "E-Transfer";
    case PaymentMethod.paypal:
      return "PayPal";
  }
}
