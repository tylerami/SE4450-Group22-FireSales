import { Currency } from "models/enums/Currency";

export const formatMoney = (value: number, currency?: Currency) => {
  let formattedValue: string;

  // Determine the currency symbol
  let currencySymbol = "";
  switch (currency) {
    case Currency.USD:
      currencySymbol = "US$";
      break;
    case Currency.CAD:
      currencySymbol = "CA$";
      break;
    default:
      currencySymbol = "$";
      break;
  }

  // Format the value based on the specified criteria
  if (value < 1000) {
    // For values under $1000, show 2 decimal places
    formattedValue = value.toFixed(2);
  } else {
    // For values over $1000, use commas and no decimal places
    formattedValue = value.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  return `${currencySymbol}${formattedValue}`;
};
