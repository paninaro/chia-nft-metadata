import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseAttributes', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if attributes is not an array (string)', () => {
        const fieldValue = 'foo';
        expect(() => new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toThrow(ParsingError);
      });
      it('throws if attributes is not an array (object)', () => {
        const fieldValue = { foo: 'bar' };
        expect(() => new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toThrow(ParsingError);
      });
      it('throws if attributes is not an array (integer)', () => {
        const fieldValue = 1;
        expect(() => new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toThrow(ParsingError);
      });
      it('throws if any required field is missing', () => {
        const fieldValue = [
          {
            trait_type: 'foo',
          },
        ];
        expect(() => new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toThrow(ParsingError);
      });
      it('throws if any unrecognized fields are present (strict mode)', () => {
        // skip this test if not in strict mode
        if (!strictMode) {
          return;
        }
        const fieldValue = [
          {
            trait_type: 'foo',
            value: 'bar',
            unrecognized: 'field',
          },
        ];
        expect(() => new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toThrow(ParsingError);
      });
      it('returns the attributes if it is valid', () => {
        const fieldValue = [
          {
            trait_type: 'foo',
            value: 'bar',
          },
        ];
        expect(new CHIP7Parser(strictMode).parseAttributes(fieldValue)).toEqual([
          {
            trait_type: 'foo',
            value: 'bar',
            min_value: undefined,
            max_value: undefined,
          },
        ]);
      });
      it('returns an empty array if the field is an empty array in non-strict mode', () => {
        const fieldValue: any[] = [];
        expect(new CHIP7Parser(false).parseAttributes(fieldValue)).toEqual([]);
      });
    });
  });
});
