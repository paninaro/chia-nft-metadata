import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseAttribute', () => {
    describe.each([true, false])(`strict mode: %p`, (strictMode) => {
      it('throws if a required property is missing', () => {
        const fieldValue = {
          trait_type: 'foo',
          // missing `value`
          min_value: 1,
          max_value: 2,
        };
        expect(() => new CHIP7Parser(strictMode).parseAttribute(fieldValue)).toThrow(ParsingError);
      });
      it('throws if an unrecognized property is present (strict mode)', () => {
        // skip this test if not in strict mode
        if (!strictMode) {
          return;
        }
        const fieldValue = {
          trait_type: 'foo',
          value: 'bar',
          unrecognized: 'field',
        };
        expect(() => new CHIP7Parser(strictMode).parseAttribute(fieldValue)).toThrow(ParsingError);
      });
      it('returns the attribute if it is valid', () => {
        const fieldValue = {
          trait_type: 'foo',
          value: 'bar',
          min_value: 1,
          max_value: 2,
        };
        expect(new CHIP7Parser(strictMode).parseAttribute(fieldValue)).toEqual({
          trait_type: 'foo',
          value: 'bar',
          min_value: 1,
          max_value: 2,
        });
      });
    });
  });
});
