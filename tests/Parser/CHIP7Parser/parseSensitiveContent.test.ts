import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseSensitiveContent', () => {
    describe.each([true, false])(`strict mode: %p`, (strictMode) => {
      it('throws if sensitiveContent is invalid (number[])', () => {
        const fieldValue = [1, 2, 3];
        expect(() => new CHIP7Parser(strictMode).parseSensitiveContent(fieldValue)).toThrow(ParsingError);
      });
      it('rethrows non-ParsingError exceptions from parseBooleanField', () => {
        const mockParseBooleanField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new CHIP7Parser(strictMode);
        parser.parseBooleanField = mockParseBooleanField;
        expect(() => parser.parseSensitiveContent(true)).toThrowError(new Error('mock error'));
        expect(mockParseBooleanField).toHaveBeenCalled();
        mockParseBooleanField.mockReset();
      });
      it('returns undefined if sensitiveContent is missing', () => {
        expect(new CHIP7Parser(strictMode).parseSensitiveContent(undefined)).toBeUndefined();
      });
      it('returns sensitiveContent if it is valid (true)', () => {
        expect(new CHIP7Parser(strictMode).parseSensitiveContent(true)).toBe(true);
      });
      it('returns sensitiveContent if it is valid (false)', () => {
        expect(new CHIP7Parser(strictMode).parseSensitiveContent(false)).toBe(false);
      });
      it('returns sensitiveContent if it is valid (string[])', () => {
        expect(new CHIP7Parser(strictMode).parseSensitiveContent(['clowns', 'mimes'])).toEqual(['clowns', 'mimes']);
      });
    });
    it('returns true if sensitive_content is the string "true"', () => {
      expect(new CHIP7Parser(false).parseSensitiveContent('true')).toBe(true);
    });
    it('returns false if sensitive_content is the string "false"', () => {
      expect(new CHIP7Parser(false).parseSensitiveContent('false')).toBe(false);
    });
  });
});
