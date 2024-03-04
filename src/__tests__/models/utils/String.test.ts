import {
    percentageDifference,
    findClosestMatch,
    capitalizeEachWordFirstLetter,
} from 'models/utils/String'

describe('String Utility Functions', () => {
  
    describe('percentageDifference', () => {
      test('calculates the correct percentage difference between two strings', () => {
        expect(percentageDifference('kitten', 'sitting')).toBeCloseTo(0.4286, 4);
        expect(percentageDifference('gumbo', 'gambol')).toBeCloseTo(0.3333, 4);
      });
  
      test('returns 0 if both strings are identical', () => {
        expect(percentageDifference('test', 'test')).toBe(0);
      });
    });
  
    describe('findClosestMatch', () => {
      const options = ['apple', 'banana', 'orange', 'grape'];
      const getOptionString = (option) => option;
  
      test('returns the closest match based on the difference threshold', () => {
        expect(findClosestMatch('appl', options, getOptionString)).toBe('apple');
        expect(findClosestMatch('banan', options, getOptionString)).toBe('banana');
      });
  
      test('returns null if no match is found within the threshold', () => {
        expect(findClosestMatch('watermelon', options, getOptionString, 0.1)).toBeNull();
      });
  
      test('ignores spaces and case during comparisons', () => {
        expect(findClosestMatch('Ap Pl', options, getOptionString)).toBe('apple');
      });
    });
  
    describe('capitalizeEachWordFirstLetter', () => {
      test('capitalizes the first letter of each word in a string', () => {
        expect(capitalizeEachWordFirstLetter('hello world')).toBe('Hello World');
        expect(capitalizeEachWordFirstLetter('javaScript language')).toBe('JavaScript Language');
      });
  
      test('handles strings with multiple spaces correctly', () => {
        expect(capitalizeEachWordFirstLetter('hello   world')).toBe('Hello   World');
      });
  
      test('returns an empty string if input is empty', () => {
        expect(capitalizeEachWordFirstLetter('')).toBe('');
      });
    });
  
  });
  