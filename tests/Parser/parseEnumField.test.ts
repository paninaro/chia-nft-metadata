import Parser from '../../src/parser/Parser';
import ParsingError from '../../src/errors/ParsingError';
import ErrorTag from '../../src/errors/ErrorTag';

describe.skip('Parser', () => {
  describe.each([true, false])('strictMode: %s', (strictMode) => {
    describe('parseEnumField', () => {
      const args = {
        fieldValue: 'value1',
        fieldName: 'field1',
        allowedValues: ['value1', 'value2', 'value3'],
        defaultValue: 'value2',
        requiredInStrictMode: true,
        tag: 'tag' as ErrorTag,
      };

      it('returns the field value if it is valid', () => {
        const result = new Parser(strictMode).parseEnumField(args);
        expect(result).toBe(args.fieldValue);
      });

      it('returns the default value if no field is specified', () => {
        if (strictMode) {
          expect(() => new Parser(strictMode).parseEnumField({ ...args, fieldValue: undefined })).toThrow(ParsingError);
        } else {
          const result = new Parser(strictMode).parseEnumField({ ...args, fieldValue: undefined });
          expect(result).toBe(args.defaultValue);
        }
      });

      it('throws an error if the field is required in strict mode and is not valid', () => {
        expect(() =>
          new Parser(strictMode).parseEnumField({ ...args, fieldValue: 'invalid', requiredInStrictMode: true })
        ).toThrow(ParsingError);
      });

      it('should not throw an error if the field is not required in strict mode and is not valid', () => {
        expect(() =>
          new Parser(strictMode).parseEnumField({ ...args, fieldValue: 'invalid', requiredInStrictMode: false })
        ).not.toThrow(ParsingError);
      });
    });
  });
});
