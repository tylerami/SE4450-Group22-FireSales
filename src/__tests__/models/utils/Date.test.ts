import {
    formatDateString,
    formatDateStringWithTime,
    parseDateString,
    firstDayOfCurrentMonth,
    getCurrentMonthAbbreviation,
    getCurrentMonthWithYear,
    getCurrentYearTwoDigits,
    endOfDay,
} from "models/utils/Date";

describe('Date Utility Functions', () => {

    describe('formatDateString', () => {
      test('formats a valid date object correctly', () => {

        // Pushed 5 hours ahead to account for timezone
        const date = new Date('2024-02-23T05:00:00Z');
        expect(formatDateString(date)).toBe('2024-02-23');
      });
  
      test('returns an empty string for undefined input', () => {
        expect(formatDateString(undefined)).toBe('');
      });
    });
  
    describe('formatDateStringWithTime', () => {
      test('formats a valid date object correctly with AM time', () => {
        
        // Pushed 5 hours ahead to account for timezone
        const date = new Date('2024-02-23T08:24:00Z');
        expect(formatDateStringWithTime(date)).toBe('2024-02-23 03:24 AM');
      });
  
      test('formats a valid date object correctly with PM time', () => {
        const date = new Date('2024-02-23T19:24:00Z');
        // Pushed 5 hours ahead to account for timezone
        const hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
        const formattedDate = `2024-02-23 ${hours < 10 ? `0${hours}` : hours}:24 PM`;
        expect(formatDateStringWithTime(date)).toBe(formattedDate);
      });
  
      test('returns an empty string for undefined input', () => {
        expect(formatDateStringWithTime(undefined)).toBe('');
      });
    });
  
    describe('parseDateString', () => {
      test('parses yyyy-mm-dd format correctly', () => {
        const dateStr = '2024-02-23';
        const result = parseDateString(dateStr, 'yyyy-mm-dd');
        expect(result).toEqual(new Date(2024, 1, 23));
      });
  
      test('parses yyyy-dd-mm format correctly', () => {
        const dateStr = '2024-23-02';
        const result = parseDateString(dateStr, 'yyyy-dd-mm');
        expect(result).toEqual(new Date(2024, 1, 23));
      });
  
      test('returns null for invalid date string', () => {
        const dateStr = 'invalid-date';
        expect(parseDateString(dateStr, 'yyyy-mm-dd')).toBeNull();
      });
    });
  
    describe('firstDayOfCurrentMonth', () => {
      test('returns the first day of the current month', () => {
        const result = firstDayOfCurrentMonth();
        const expected = new Date();
        expected.setDate(1);
        expected.setHours(0, 0, 0, 0);
        expect(result).toEqual(expected);
      });
    });
  
    describe('getCurrentMonthAbbreviation', () => {
      test('returns the correct month abbreviation', () => {
        const expectedAbbreviations = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        ];
        const result = getCurrentMonthAbbreviation();
        const monthIndex = new Date().getMonth();
        expect(result).toBe(expectedAbbreviations[monthIndex]);
      });
    });
  
    describe('getCurrentMonthWithYear', () => {
      test('returns the correct month with year', () => {
        const abbreviation = getCurrentMonthAbbreviation();
        const yearTwoDigits = getCurrentYearTwoDigits();
        expect(getCurrentMonthWithYear()).toBe(`${abbreviation} '${yearTwoDigits}`);
      });
    });
  
    describe('getCurrentYearTwoDigits', () => {
      test('returns the last two digits of the current year', () => {
        const currentYearTwoDigits = new Date().getFullYear().toString().slice(-2);
        expect(getCurrentYearTwoDigits()).toBe(currentYearTwoDigits);
      });
    });
  
    describe('endOfDay', () => {
      test('sets time to end of day', () => {
        const date = new Date('2024-02-23T00:00:00Z');
        const end = endOfDay(date);
        expect(end.getHours()).toBe(23);
        expect(end.getMinutes()).toBe(59);
      });
    });
  
  });
  