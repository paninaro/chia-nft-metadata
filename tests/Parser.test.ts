import Parser from '../src/parser/Parser';
import ParsingError from '../src/errors/ParsingError';
import ErrorTag from '../src/errors/ErrorTag';

describe('Parser', () => {
  describe('parseIntegerField', () => {
    describe('strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() =>
          new Parser(true).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is a string', () => {
        const fieldValue = 'foo';
        expect(() =>
          new Parser(true).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(true).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('returns the field if it is valid', () => {
        const fieldValue = 7;
        expect(
          new Parser(true).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
      it('returns the field if it is 0', () => {
        const fieldValue = 0;
        expect(
          new Parser(true).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
    });
    describe('non-strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('returns the field if it is valid', () => {
        const fieldValue = 7;
        expect(
          new Parser(false).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
      it('throws if the field is a string', () => {
        const fieldValue = 'foo';
        expect(() =>
          new Parser(false).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(false).parseIntegerField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
    });
  });
  describe('parseStringField', () => {
    describe('strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() =>
          new Parser(true).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is a number', () => {
        const fieldValue = 7;
        expect(() =>
          new Parser(true).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(true).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('returns the field if it is valid', () => {
        const fieldValue = 'foo';
        expect(
          new Parser(true).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
      it('returns an empty string if the field is an empty string', () => {
        const fieldValue = '';
        expect(
          new Parser(true).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
    });
    describe('non-strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is a number', () => {
        const fieldValue = 7;
        expect(() =>
          new Parser(false).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(false).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('returns an empty string if the field is an empty string', () => {
        const fieldValue = '';
        expect(
          new Parser(false).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
      it('returns an empty string if the field is missing in non-strict mode', () => {
        const fieldValue = undefined;
        const defaultValue = '';
        expect(
          new Parser(false).parseStringField({
            ...partialArgs,
            fieldValue,
            defaultValue,
          })
        ).toBe(defaultValue);
      });
      it('returns the field if it is valid', () => {
        const fieldValue = 'foo';
        expect(
          new Parser(false).parseStringField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
    });
  });
  describe('parseArrayField', () => {
    describe('strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is missing in strict mode', () => {
        const fieldValue = undefined;
        const fieldType = 'string';
        expect(() =>
          new Parser(true).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is a number', () => {
        const fieldValue = 7;
        const fieldType = 'string';
        expect(() =>
          new Parser(true).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        const fieldType = 'string';
        expect(() =>
          new Parser(true).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('returns the field if it is valid', () => {
        const fieldValue = ['foo', 'bar'];
        const fieldType = 'string';
        expect(
          new Parser(true).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toBe(fieldValue);
      });
    });
    describe('non-strict mode', () => {
      const fieldName = 'something';
      const tag = 'exampleTag' as ErrorTag;
      const partialArgs = {
        fieldName,
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is a number', () => {
        const fieldValue = 7;
        const fieldType = 'string';
        expect(() =>
          new Parser(false).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        const fieldType = 'string';
        expect(() =>
          new Parser(false).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('returns an empty array if the field is missing in non-strict mode', () => {
        const fieldValue = undefined;
        const fieldType = 'string';
        const defaultValue: string[] = [];
        expect(
          new Parser(false).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
            defaultValue,
          })
        ).toBe(defaultValue);
      });
      it('returns the field if it is valid', () => {
        const fieldValue = ['foo', 'bar'];
        const fieldType = 'string';
        expect(
          new Parser(false).parseArrayField({
            ...partialArgs,
            fieldValue,
            fieldType,
          })
        ).toBe(fieldValue);
      });
    });
  });
});
