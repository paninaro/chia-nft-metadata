import CHIP7Parser from '../../../src/parser/CHIP7Parser';

describe('CHIP7Parser', () => {
  describe('fromJSON', () => {
    it('throws if the JSON is invalid', () => {
      const jsonStr = '{ "foo": bar" }';
      expect(() => CHIP7Parser.fromJSON(jsonStr)).toThrowError(SyntaxError);
    });
    it('returns the parsed metadata', () => {
      const jsonStr = `{
        "format": "CHIP-0007",
        "name": "My Metadata",
        "description": "This is my metadata"
      }`;
      const metadata = CHIP7Parser.fromJSON(jsonStr);
      const { format, name, description } = metadata;
      expect(format).toBe('CHIP-0007');
      expect(name).toBe('My Metadata');
      expect(description).toBe('This is my metadata');
    });
  });
});
