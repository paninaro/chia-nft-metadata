import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseSeriesNumber', () => {
    describe('strict mode', () => {
      it('throws if the series number is an empty string', () => {
        const fieldValue = '';
        expect(() => new CHIP7Parser(true).parseSeriesNumber(fieldValue)).toThrow(ParsingError);
      });
      it('returns the series number if it is valid', () => {
        expect(new CHIP7Parser(true).parseSeriesNumber(123)).toBe(123);
      });
    });
    describe('non-strict mode', () => {
      it('returns undefined if series number is missing in non-strict mode', () => {
        expect(new CHIP7Parser(false).parseSeriesNumber(undefined)).toBe(undefined);
      });
      it('returns the series number if it is valid', () => {
        expect(new CHIP7Parser(false).parseSeriesNumber(123)).toBe(123);
      });
    });
  });
});
