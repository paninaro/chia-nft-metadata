import CHIP7Parser from '../../../src/parser/CHIP7Parser';

describe('CHIP7Parser', () => {
  describe('parseMintingTool', () => {
    describe.each([true, false])('strict mode: %s', (strictMode) => {
      it('returns undefined if mintingTool is missing', () => {
        expect(new CHIP7Parser(strictMode).parseMintingTool(undefined)).toBeUndefined();
      });
      it('returns an empty string if mintingTool is an empty string', () => {
        expect(new CHIP7Parser(strictMode).parseMintingTool('')).toBe('');
      });
      it('returns the mintingTool if it is valid', () => {
        expect(new CHIP7Parser(strictMode).parseMintingTool('foo')).toBe('foo');
      });
    });
  });
});
