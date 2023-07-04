import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseDescription', () => {
    describe('strict mode', () => {
      it('throws if description is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() => new CHIP7Parser(true).parseDescription(fieldValue)).toThrow(ParsingError);
      });
      it('returns the description if it is valid', () => {
        expect(new CHIP7Parser(true).parseDescription('foo')).toBe('foo');
      });
      it('returns an empty string if description is an empty string', () => {
        expect(new CHIP7Parser(true).parseDescription('')).toBe('');
      });
    });
    describe('non-strict mode', () => {
      it('returns an empty string if description is an empty string', () => {
        expect(new CHIP7Parser(false).parseDescription('')).toBe('');
      });
      it('returns an empty string if description is missing in non-strict mode', () => {
        expect(new CHIP7Parser(false).parseDescription(undefined)).toBe('');
      });
      it('returns the description if it is valid', () => {
        expect(new CHIP7Parser(false).parseDescription('foo')).toBe('foo');
      });
    });
  });
});
