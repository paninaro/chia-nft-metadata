import Parser from '../../src/parser/Parser';

describe('Parser', () => {
  describe('constructor', () => {
    it('sets strictMode to false by default', () => {
      const parser = new Parser();
      expect(parser.strictMode).toBe(false);
    });
    it('sets strictMode to true if passed true', () => {
      const parser = new Parser(true);
      expect(parser.strictMode).toBe(true);
    });
    it('sets strictMode to false if passed false', () => {
      const parser = new Parser(false);
      expect(parser.strictMode).toBe(false);
    });
  });
});
