import CHIP7Parser from '../../../src/parser/CHIP7Parser';
import ParsingError from '../../../src/errors/ParsingError';

describe('CHIP7Parser', () => {
  describe('parseCollection', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if collection is not an object (string)', () => {
        const fieldValue = 'foo';
        expect(() => new CHIP7Parser(strictMode).parseCollection(fieldValue)).toThrow(ParsingError);
      });
      it('throws if collection is not an object (array)', () => {
        const fieldValue = ['foo'];
        expect(() => new CHIP7Parser(strictMode).parseCollection(fieldValue)).toThrow(ParsingError);
      });
      it('returns the collection if it is valid (no attributes)', () => {
        const fieldValue = {
          id: 'foo',
          name: 'bar',
        };
        expect(new CHIP7Parser(strictMode).parseCollection(fieldValue)).toEqual({
          id: 'foo',
          name: 'bar',
        });
      });
      it('returns the collection if it is valid (attributes)', () => {
        const fieldValue = {
          id: 'foo',
          name: 'bar',
          attributes: [
            {
              type: 'abc',
              value: 'def',
            },
            {
              type: 123,
              value: 456,
            },
          ],
        };
        expect(new CHIP7Parser(strictMode).parseCollection(fieldValue)).toEqual({
          id: 'foo',
          name: 'bar',
          attributes: [
            {
              type: 'abc',
              value: 'def',
            },
            {
              type: 123,
              value: 456,
            },
          ],
        });
      });
    });
  });
});
