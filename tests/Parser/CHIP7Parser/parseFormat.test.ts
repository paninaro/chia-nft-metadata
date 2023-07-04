import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import Format from '../../../types/Format';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseFormat', () => {
    describe('strictMode: true', () => {
      let parser: CHIP7Parser | undefined;
      beforeEach(() => {
        parser = new CHIP7Parser(true);
      });
      afterEach(() => {
        parser = undefined;
      });

      it('returns the field value if it is valid', () => {
        const result = parser!.parseFormat('CHIP-0007');
        expect(result).toBe(Format.CHIP_0007);
      });
      it('throws an error if the field is required in strict mode and is not specified', () => {
        expect(() => parser!.parseFormat(undefined)).toThrow(ParsingError);
      });
      it('throws an error if the field is required in strict mode and is not valid', () => {
        expect(() => parser!.parseFormat('invalid')).toThrow(ParsingError);
      });
    });
    describe('strictMode: false', () => {
      let parser: CHIP7Parser | undefined;
      beforeEach(() => {
        parser = new CHIP7Parser(false);
      });
      afterEach(() => {
        parser = undefined;
      });

      it('returns the field value if it is valid', () => {
        const result = parser!.parseFormat('CHIP-0007');
        expect(result).toBe(Format.CHIP_0007);
      });
      it('returns the default value if the field is not specified', () => {
        const result = parser!.parseFormat(undefined);
        expect(result).toBe(Format.CHIP_0007);
      });
    });
  });
});
