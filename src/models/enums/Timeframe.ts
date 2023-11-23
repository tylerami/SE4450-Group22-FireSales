import { assert } from "console";

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

export function getCurrentDayOfWeek(): DayOfTheWeek {
  const currentDayIndex = new Date().getDay();
  return Object.values(DayOfTheWeek)[currentDayIndex];
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

  let start: Date;

  switch (timeframe) {
    case Timeframe.lastWeek:
      start = getIntervalStart(Timeframe.lastWeek);
      for (let i = 0; i < 7; i++) {
        const segmentStart = new Date(start);
        segmentStart.setDate(start.getDate() + i);
        let end = new Date(segmentStart);
        end.setDate(segmentStart.getDate() + 1);
        if (i === 6) end = new Date(today); // End on the current day for the last segment
        segments.push({
          label: segmentStart.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          }),
          start: segmentStart,
          end: end,
        });
      }
      break;

    case Timeframe.lastMonth:
      start = getIntervalStart(Timeframe.lastMonth);
      for (let i = 0; i < 4; i++) {
        const segmentStart = new Date(
          start.getFullYear(),
          start.getMonth(),
          start.getDate() + 7 * i
        );
        let end = new Date(segmentStart);
        end.setDate(segmentStart.getDate() + 6);
        if (i === 3 || end > today) {
          // Adjust the last segment to end today
          end = new Date(today);
        }
        segments.push({
          label: `${segmentStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          start: segmentStart,
          end: end,
        });
      }
      break;

    case Timeframe.last3Months:
      start = getIntervalStart(Timeframe.last3Months);
      const segmentLength = 15; // Length of each segment in days

      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(start);
        segmentStart.setDate(start.getDate() + segmentLength * i);
        let end = new Date(segmentStart);
        end.setDate(segmentStart.getDate() + segmentLength - 1);

        // Adjust the last segment to end on today's date
        if (i === 5 || end > today) {
          end = new Date(today);
        }

        if (segmentStart > today) {
          break; // Break if the segment start date is in the future
        }

        segments.push({
          label: `${segmentStart.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })} - ${end.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`,
          start: segmentStart,
          end: end,
        });
      }
      break;
    case Timeframe.last6Months:
      start = getIntervalStart(Timeframe.last6Months);
      for (let i = 0; i < 6; i++) {
        const segmentStart = new Date(
          start.getFullYear(),
          start.getMonth() + i,
          start.getDate()
        );
        let end = new Date(
          segmentStart.getFullYear(),
          segmentStart.getMonth() + 1,
          0
        );

        // Adjust the end date of the last segment to today's date
        if (i === 5 || end > today) {
          end = new Date(today);
        }

        segments.push({
          label: segmentStart.toLocaleDateString("en-US", { month: "long" }),
          start: segmentStart,
          end: end,
        });
      }
      break;

    case Timeframe.lastYear:
      start = getIntervalStart(Timeframe.lastYear);
      for (let i = 0; i < 4; i++) {
        const segmentStart = new Date(
          start.getFullYear(),
          start.getMonth() + 3 * i,
          start.getDate()
        );
        let end = new Date(
          segmentStart.getFullYear(),
          segmentStart.getMonth() + 3,
          0
        );

        // Adjust the end date of the last segment to today's date
        if (i === 3 || end > today) {
          end = new Date(today);
        }

        segments.push({
          label: `${segmentStart.toLocaleDateString("en-US", {
            month: "short",
          })} - ${end.toLocaleDateString("en-US", { month: "short" })}`,
          start: segmentStart,
          end: end,
        });
      }
      break;

    default:
      // Handle other cases or throw an error
      break;
  }

  function assert(condition: boolean, message: string) {
    if (!condition) {
      throw new Error(message);
    }
  }

  // Add assert statements at the end of the function
  const firstSegmentStart = segments[0].start;
  const lastSegmentEnd = segments[segments.length - 1].end;
  const expectedFirstStart = getIntervalStart(timeframe);

  assert(
    firstSegmentStart.toDateString() === expectedFirstStart.toDateString(),
    "First segment does not start on the expected date, " +
      expectedFirstStart +
      " but instead starts on " +
      firstSegmentStart +
      ", timeframe is " +
      timeframe
  );

  // Assert that the last segment ends on today's date
  assert(
    lastSegmentEnd.toDateString() === today.toDateString(),
    "Last segment does not end on today's date" +
      today +
      " but on " +
      lastSegmentEnd +
      ", timeframe is " +
      timeframe
  );

  return segments;
}

export function getIntervalStart(timeframe: Timeframe): Date {
  const today = new Date();
  switch (timeframe) {
    case Timeframe.lastWeek:
      return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() - 6
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
