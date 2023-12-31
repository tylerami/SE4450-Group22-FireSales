export enum ConversionType {
  freeBet = "freeBet",
  betMatch = "betMatch",
  retentionIncentive = "retentionIncentive",
}

export function getConversionTypeLabel(type: ConversionType) {
  switch (type) {
    case ConversionType.freeBet:
      return "New User";
    case ConversionType.betMatch:
      return "Bet Match";
    case ConversionType.retentionIncentive:
      return "Retention Bonus";
    default:
      return "";
  }
}
