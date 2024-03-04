import {
    formatMoney,
} from 'models/utils/Money'

import {
    Currency
} from 'models/enums/Currency'

describe('formatMoney Function', () => {

    describe('without specifying currency', () => {
      test('correctly formats positive values under 1000', () => {
        expect(formatMoney(123.45)).toBe('$123.45');
      });
  
      test('correctly formats positive values over 1000', () => {
        expect(formatMoney(12345)).toBe('$12,345');
      });
  
      test('correctly formats negative values under 1000', () => {
        expect(formatMoney(-123.45)).toBe('-$123.45');
      });
  
      test('correctly formats negative values over 1000', () => {
        expect(formatMoney(-12345)).toBe('-$12,345');
      });
    });
  
    describe('with USD currency specified', () => {
      test('appends USD symbol to positive values under 1000', () => {
        expect(formatMoney(123.45, Currency.USD)).toBe('$123.45USD');
      });
  
      test('appends USD symbol to positive values over 1000', () => {
        expect(formatMoney(12345, Currency.USD)).toBe('$12,345USD');
      });
  
      test('appends USD symbol to negative values under 1000', () => {
        expect(formatMoney(-123.45, Currency.USD)).toBe('-$123.45USD');
      });
  
      test('appends USD symbol to negative values over 1000', () => {
        expect(formatMoney(-12345, Currency.USD)).toBe('-$12,345USD');
      });
    });
  
    describe('with CAD currency specified', () => {
      test('appends CAD symbol to positive values under 1000', () => {
        expect(formatMoney(123.45, Currency.CAD)).toBe('$123.45CAD');
      });
  
      test('appends CAD symbol to positive values over 1000', () => {
        expect(formatMoney(12345, Currency.CAD)).toBe('$12,345CAD');
      });
  
      test('appends CAD symbol to negative values under 1000', () => {
        expect(formatMoney(-123.45, Currency.CAD)).toBe('-$123.45CAD');
      });
  
      test('appends CAD symbol to negative values over 1000', () => {
        expect(formatMoney(-12345, Currency.CAD)).toBe('-$12,345CAD');
      });
    });
  
  });
  