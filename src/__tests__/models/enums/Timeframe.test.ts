import {
    getCurrentDayOfWeek,
    divideTimeframeIntoSegments,
    getIntervalStart,
    getTimeframeLabel,
    Timeframe
} from 'models/enums/Timeframe'

describe('Time-related Utility Functions', () => {

    describe('getCurrentDayOfWeek', () => {
      test('returns the correct day of the week', () => {
        const expectedDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        expect(getCurrentDayOfWeek()).toBe(expectedDay);
      });
    });
  
    describe('getTimeframeLabel', () => {
      test('returns the correct label for each timeframe', () => {
        expect(getTimeframeLabel(Timeframe.lastWeek)).toBe('Last Week');
        expect(getTimeframeLabel(Timeframe.lastMonth)).toBe('Last Month');
        expect(getTimeframeLabel(Timeframe.last3Months)).toBe('Last 3 Months');
        expect(getTimeframeLabel(Timeframe.last6Months)).toBe('Last 6 Months');
        expect(getTimeframeLabel(Timeframe.lastYear)).toBe('Last Year');
      });
    });
  
  });
  