import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseName', () => {
    const fieldName = 'name';
    describe('strict mode', () => {
      it('throws if name is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() => new CHIP7Parser(true).parseName(fieldValue)).toThrow(ParsingError);
      });
      it('returns the name if it is valid', () => {
        expect(new CHIP7Parser(true).parseName('foo')).toBe('foo');
      });
      it('returns an empty string if name is an empty string', () => {
        expect(new CHIP7Parser(true).parseName('')).toBe('');
      });
    });
    describe('non-strict mode', () => {
      it('returns an empty string if name is an empty string', () => {
        expect(new CHIP7Parser(false).parseName('')).toBe('');
      });
      it('returns an empty string if name is missing in non-strict mode', () => {
        expect(new CHIP7Parser(false).parseName(undefined)).toBe('');
      });
      it('returns the name if it is valid', () => {
        expect(new CHIP7Parser(false).parseName('foo')).toBe('foo');
      });
    });
  });
});
