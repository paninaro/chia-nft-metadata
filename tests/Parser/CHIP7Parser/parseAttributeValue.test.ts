import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseAttributeValue', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if value is missing', () => {
        const fieldValue = undefined;
        expect(() => new CHIP7Parser(strictMode).parseAttributeValue(fieldValue)).toThrow(ParsingError);
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new CHIP7Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseAttributeValue(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the value if it is valid (string)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeValue('foo')).toBe('foo');
      });
      it('returns the value if it is valid (integer 1)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeValue(1)).toBe(1);
      });
      it('returns the value if it is valid (integer 0)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeValue(0)).toBe(0);
      });
      it('returns the value if it is valid (integer -1)', () => {
        expect(new CHIP7Parser(strictMode).parseAttributeValue(-1)).toBe(-1);
      });
    });
    it('returns an empty string if the field is an empty string in non-strict mode', () => {
      const fieldValue = '';
      expect(new CHIP7Parser(false).parseAttributeValue(fieldValue)).toBe('');
    });
  });
});
