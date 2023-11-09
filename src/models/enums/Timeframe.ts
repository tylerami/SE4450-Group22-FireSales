export enum Timeframe {
  lastDay,
  lastWeek,
  lastMonth,
  last3Months,
  last6Months,
  lastYear,
}

export function getIntervalStart(timeframe: Timeframe): Date {
  const today = new Date();
  switch (timeframe) {
    case Timeframe.lastDay:
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 1
      );
    case Timeframe.lastWeek:
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 7
      );
    case Timeframe.lastMonth:
      return new Date(
        today.getFullYear(),
        today.getMonth() - 1,
        today.getDate()
      );
    case Timeframe.last3Months:
      return new Date(
        today.getFullYear(),
        today.getMonth() - 3,
        today.getDate()
      );
    case Timeframe.last6Months:
      return new Date(
        today.getFullYear(),
        today.getMonth() - 6,
        today.getDate()
      );
    case Timeframe.lastYear:
      return new Date(
        today.getFullYear() - 1,
        today.getMonth(),
        today.getDate()
      );
  }
}
