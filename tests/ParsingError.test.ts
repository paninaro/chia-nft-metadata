import ParsingError from '../src/errors/ParsingError';
import ErrorTag from '../src/errors/ErrorTag';

describe('ParsingError', () => {
  describe('toString', () => {
    it('returns a string', () => {
      const message = 'foo';
      const tag = 'bar' as ErrorTag;
      const error = new ParsingError(message, tag);
      const stringValue = error.toString();
      expect(typeof stringValue).toBe('string');
      expect(stringValue).toBe('ParsingError: foo [bar]');
    });
  });
  describe('tag', () => {
    it('sets the tag property', () => {
      const message = 'foo';
      const tag = 'bar' as ErrorTag;
      const error = new ParsingError(message, tag);
      expect(error.tag).toBe(tag);
    });
  });
});
