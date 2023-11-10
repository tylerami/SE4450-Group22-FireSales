export function formatMoney(amount: number, decimalCount: number = 2) {
  return `$${amount.toFixed(decimalCount)}`;
}
