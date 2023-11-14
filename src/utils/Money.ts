export function formatMoney(amount: number, decimalCount: number = 2) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toFixed(decimalCount)}`;
}
