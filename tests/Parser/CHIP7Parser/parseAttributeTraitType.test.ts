import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseAttributeTraitType', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if trait_type is missing', () => {
        const fieldValue = undefined;
        expect(() => new CHIP7Parser(strictMode).parseAttributeTraitType(fieldValue)).toThrow(ParsingError);
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new CHIP7Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseAttributeTraitType(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the trait_type if it is valid (string)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeTraitType('foo')).toBe('foo');
      });
      it('returns the trait_type if it is valid (integer 1)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeTraitType(1)).toBe(1);
      });
      it('returns the trait_type if it is valid (integer 0)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeTraitType(0)).toBe(0);
      });
      it('returns the trait_type if it is valid (integer -1)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeTraitType(-1)).toBe(-1);
      });
    });
    it('returns an empty string if the field is an empty string in non-strict mode', () => {
      const fieldValue = '';
      expect(new CHIP7Parser(false).parseAttributeTraitType(fieldValue)).toBe('');
    });
  });
});
