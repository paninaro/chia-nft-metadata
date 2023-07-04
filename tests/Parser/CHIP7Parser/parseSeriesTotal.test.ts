import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseSeriesTotal', () => {
    describe('strict mode', () => {
      it('throws if the series total is an empty string', () => {
        const fieldValue = '';
        expect(() => new CHIP7Parser(true).parseSeriesTotal(fieldValue)).toThrow(ParsingError);
      });
      it('returns the series total if it is valid', () => {
        expect(new CHIP7Parser(true).parseSeriesTotal(999)).toBe(999);
      });
    });
    describe('non-strict mode', () => {
      it('returns undefined if series total is missing in non-strict mode', () => {
        expect(new CHIP7Parser(false).parseSeriesTotal(undefined)).toBe(undefined);
      });
      it('returns the series total if it is valid', () => {
        expect(new CHIP7Parser(false).parseSeriesTotal(999)).toBe(999);
      });
    });
  });
});
