import CHIP7Parser from '../../../src/parser/CHIP7Parser';

describe('CHIP7Parser', () => {
  describe('constructor', () => {
    it('sets strictMode to false by default', () => {
      const parser = new CHIP7Parser();
      expect(parser.strictMode).toBe(false);
    });
    it('sets strictMode to true if passed true', () => {
      const parser = new CHIP7Parser(true);
      expect(parser.strictMode).toBe(true);
    });
    it('sets strictMode to false if passed false', () => {
      const parser = new CHIP7Parser(false);
      expect(parser.strictMode).toBe(false);
    });
    it('is subclass of Parser', () => {
      const parser = new CHIP7Parser();
      expect(parser).toBeInstanceOf(CHIP7Parser);
    });
  });
});
