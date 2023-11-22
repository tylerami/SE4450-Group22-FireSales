export enum Timeframe {
  lastWeek,
  lastMonth,
  last3Months,
  last6Months,
  lastYear,
}

export enum DayOfTheWeek {
  Sunday = "Sunday",
  Monday = "Monday",
  Tuesday = "Tuesday",
  Wednesday = "Wednesday",
  Thursday = "Thursday",
  Friday = "Friday",
  Saturday = "Saturday",
}

export type TimeframeSegment = {
  label: string;
  start: Date;
  end: Date;
};

export function divideTimeframeIntoSegments(
  timeframe: Timeframe
): Array<TimeframeSegment> {
  const today = new Date();
  const segments: Array<TimeframeSegment> = [];

  switch (timeframe) {
    case Timeframe.lastWeek:
      for (let i = 6; i >= 0; i--) {
        const start = new Date(today);
        start.setDate(today.getDate() - i);
        const end = new Date(start);
        segments.push({
          label: start.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          start: start,
          end: end,
        });
      }
      break;

    case Timeframe.lastMonth:
      const daysInLastMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        0
      ).getDate();
      for (let i = 0; i < 4; i++) {
        const start = new Date(today);
        start.setDate(today.getDate() - 7 * (3 - i));
        let end = new Date(start);
        end.setDate(start.getDate() + 6);
        if (end.getMonth() !== start.getMonth()) {
          end = new Date(today);
        }
        segments.push({
          label: `${start.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          start: start,
          end: end,
        });
      }
      break;

    case Timeframe.last3Months:
      for (let i = 0; i < 6; i++) {
        const start = new Date(today);
        start.setMonth(today.getMonth() - 2 + Math.floor(i / 2));
        start.setDate(i % 2 === 0 ? 1 : 16);
        const end = new Date(
          start.getFullYear(),
          start.getMonth(),
          i % 2 === 0
            ? 15
            : new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate()
        );
        if (end > today) {
          end.setDate(today.getDate());
        }
        segments.push({
          label: `${start.toLocaleString("en-US", {
            month: "short",
          })} ${start.getDate()}-${end.getDate()}`,
          start: start,
          end: end,
        });
      }
      break;

    case Timeframe.last6Months:
      for (let i = 5; i >= 0; i--) {
        const start = new Date(today.getFullYear(), today.getMonth() - i, 1);
        let end = new Date(start.getFullYear(), start.getMonth() + 1, 0);
        if (end > today) {
          end = new Date(today);
        }
        segments.push({
          label: start.toLocaleDateString("en-US", { month: "long" }),
          start: start,
          end: end,
        });
      }
      break;

    case Timeframe.lastYear:
      for (let i = 0; i < 4; i++) {
        const start = new Date(today.getFullYear() - 1, i * 3, 1);
        let end = new Date(start.getFullYear(), start.getMonth() + 3, 0);
        if (end > today) {
          end = new Date(today);
        }
        segments.push({
          label: `${start.toLocaleDateString("en-US", {
            month: "short",
          })} - ${end.toLocaleDateString("en-US", { month: "short" })}`,
          start: start,
          end: end,
        });
      }
      break;

    default:
      // Handle other cases or throw an error
      break;
  }

  return segments;
}

export function getTimeframeLabel(timeframe: Timeframe): string {
  switch (timeframe) {
    case Timeframe.lastWeek:
      return "Last Week";
    case Timeframe.lastMonth:
      return "Last Month";
    case Timeframe.last3Months:
      return "Last 3 Months";
    case Timeframe.last6Months:
      return "Last 6 Months";
    case Timeframe.lastYear:
      return "Last Year";
  }
}

export function getIntervalStart(timeframe: Timeframe): Date {
  const today = new Date();
  switch (timeframe) {
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
