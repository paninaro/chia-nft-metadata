import CHIP7CollectionParser from '../../../src/parser/CHIP7CollectionParser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7CollectionParser', () => {
  describe('parseCollectionAttributeType', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if type is missing', () => {
        const fieldValue = undefined;
        expect(() => new CHIP7CollectionParser(strictMode).parseCollectionAttributeType(fieldValue)).toThrow(
          ParsingError
        );
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new CHIP7CollectionParser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseCollectionAttributeType(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the type if it is valid', () => {
        const fieldValue = 'foo';
        expect(new CHIP7CollectionParser(strictMode).parseCollectionAttributeType(fieldValue)).toBe('foo');
      });
    });
  });
});
