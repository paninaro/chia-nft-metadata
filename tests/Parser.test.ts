import Parser from '../src/parser/Parser';
import ParsingError from '../src/errors/ParsingError';
import ErrorTag from '../src/errors/ErrorTag';

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
  });
  describe('fromJSON', () => {
    it('throws if the JSON is invalid', () => {
      const jsonStr = '{ "foo": bar" }';
      expect(() => Parser.fromJSON(jsonStr)).toThrowError(SyntaxError);
    });
    it('returns the parsed metadata', () => {
      const jsonStr = `{
        "format": "CHIP-0007",
        "name": "My Metadata",
        "description": "This is my metadata"
      }`;
      const metadata = Parser.fromJSON(jsonStr);
      const { format, name, description } = metadata;
      expect(format).toBe('CHIP-0007');
      expect(name).toBe('My Metadata');
      expect(description).toBe('This is my metadata');
    });
  });
  describe('parseEnumField', () => {
    describe('strict mode', () => {
      const fieldName = 'format';
      const tag = ErrorTag.INVALID_FORMAT;
      const partialArgs = {
        fieldName,
        enumValues: ['CHIP-0007', 'CHIP-0015'],
        defaultValue: 'CHIP-0007',
        requiredInStrictMode: true,
        tag,
      };
      it('throws if the field is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() =>
          new Parser(true).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is a number', () => {
        const fieldValue = 7;
        expect(() =>
          new Parser(true).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(true).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('throws if the field is not in the enum', () => {
        const fieldValue = 'CHIP-0008';
        expect(() =>
          new Parser(true).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.missingOrInvalidField(fieldName, fieldValue, tag));
      });
      it('returns the field if it is valid', () => {
        const fieldValue = 'CHIP-0007';
        expect(
          new Parser(true).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
    });
    describe('non-strict mode', () => {
      const fieldName = 'format';
      const tag = ErrorTag.INVALID_FORMAT;
      const partialArgs = {
        fieldName,
        enumValues: ['CHIP-0007', 'CHIP-0015'],
        defaultValue: 'CHIP-0007',
        requiredInStrictMode: true,
        tag,
      };
      it('returns the default value if the field is missing in non-strict mode', () => {
        const fieldValue = 'CHIP-0007';
        expect(
          new Parser(false).parseEnumField({
            ...partialArgs,
            fieldValue: undefined,
          })
        ).toBe(fieldValue);
      });
      it('throws an error if the field is a number', () => {
        const fieldValue = 7;
        expect(() =>
          new Parser(false).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('throws an error if the field is an object', () => {
        const fieldValue = { foo: 'bar' };
        expect(() =>
          new Parser(false).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toThrowError(ParsingError.invalidField(fieldName, fieldValue, tag));
      });
      it('returns the field if it is valid', () => {
        const fieldValue = 'CHIP-0007';
        expect(
          new Parser(false).parseEnumField({
            ...partialArgs,
            fieldValue,
          })
        ).toBe(fieldValue);
      });
    });
  });
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
      it('throws if the field is an empty string', () => {
        const fieldValue = '';
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
  describe('parseFormat', () => {
    const fieldName = 'format';
    const tag = ErrorTag.INVALID_FORMAT;

    describe('strict mode', () => {
      it('throws if format is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() => new Parser(true).parseFormat(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('returns the format if it is valid (CHIP-0007)', () => {
        expect(new Parser(true).parseFormat('CHIP-0007')).toBe('CHIP-0007');
      });
      it('returns the format if it is valid (CHIP-0015)', () => {
        expect(new Parser(true).parseFormat('CHIP-0015')).toBe('CHIP-0015');
      });
    });
    describe('non-strict mode', () => {
      it('throws if the format is an invalid string', () => {
        const fieldValue = 'CHIP-0008'; // invalid format
        expect(() => new Parser(false).parseFormat(fieldValue)).toThrowError(
          ParsingError.invalidField(fieldName, fieldValue, tag)
        );
      });
      it('returns CHIP-0007 if format is missing in non-strict mode', () => {
        expect(new Parser(false).parseFormat(undefined)).toBe('CHIP-0007');
      });
      it('returns the format if it is valid (CHIP-0007)', () => {
        expect(new Parser(false).parseFormat('CHIP-0007')).toBe('CHIP-0007');
      });
      it('returns the format if it is valid (CHIP-0015)', () => {
        expect(new Parser(false).parseFormat('CHIP-0015')).toBe('CHIP-0015');
      });
    });
  });
  describe('parseName', () => {
    const fieldName = 'name';
    const tag = ErrorTag.INVALID_NAME;
    describe('strict mode', () => {
      it('throws if name is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() => new Parser(true).parseName(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('throws if the name is an empty string', () => {
        const fieldValue = '';
        expect(() => new Parser(true).parseName(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('returns the name if it is valid', () => {
        expect(new Parser(true).parseName('foo')).toBe('foo');
      });
    });
    describe('non-strict mode', () => {
      it('returns an empty string if name is an empty string', () => {
        expect(new Parser(false).parseName('')).toBe('');
      });
      it('returns an empty string if name is missing in non-strict mode', () => {
        expect(new Parser(false).parseName(undefined)).toBe('');
      });
      it('returns the name if it is valid', () => {
        expect(new Parser(false).parseName('foo')).toBe('foo');
      });
    });
  });
  describe('parseDescription', () => {
    const fieldName = 'description';
    const tag = ErrorTag.INVALID_DESCRIPTION;
    describe('strict mode', () => {
      it('throws if description is missing in strict mode', () => {
        const fieldValue = undefined;
        expect(() => new Parser(true).parseDescription(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('throws if the description is an empty string', () => {
        const fieldValue = '';
        expect(() => new Parser(true).parseDescription(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('returns the description if it is valid', () => {
        expect(new Parser(true).parseDescription('foo')).toBe('foo');
      });
    });
    describe('non-strict mode', () => {
      it('returns an empty string if description is an empty string', () => {
        expect(new Parser(false).parseDescription('')).toBe('');
      });
      it('returns an empty string if description is missing in non-strict mode', () => {
        expect(new Parser(false).parseDescription(undefined)).toBe('');
      });
      it('returns the description if it is valid', () => {
        expect(new Parser(false).parseDescription('foo')).toBe('foo');
      });
    });
  });
  describe('parseMintingTool', () => {
    describe.each([true, false])('strict mode: %s', (strictMode) => {
      it('returns undefined if mintingTool is missing', () => {
        expect(new Parser(strictMode).parseMintingTool(undefined)).toBeUndefined();
      });
      it('returns an empty string if mintingTool is an empty string', () => {
        expect(new Parser(strictMode).parseMintingTool('')).toBe('');
      });
      it('returns the mintingTool if it is valid', () => {
        expect(new Parser(strictMode).parseMintingTool('foo')).toBe('foo');
      });
    });
  });
  describe('parseSensitiveContent', () => {
    const fieldName = 'sensitiveContent';
    const tag = ErrorTag.INVALID_SENSITIVE_CONTENT;
    describe.each([true, false])(`strict mode: %p`, (strictMode) => {
      it('throws if sensitiveContent is invalid (number[])', () => {
        const fieldValue = [1, 2, 3];
        expect(() => new Parser(strictMode).parseSensitiveContent(fieldValue)).toThrowError(
          ParsingError.invalidField(fieldName, fieldValue, tag)
        );
      });
      it('rethrows non-ParsingError exceptions from parseBooleanField', () => {
        const mockParseBooleanField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new Parser(strictMode);
        parser.parseBooleanField = mockParseBooleanField;
        expect(() => parser.parseSensitiveContent(true)).toThrowError(new Error('mock error'));
        expect(mockParseBooleanField).toHaveBeenCalled();
        mockParseBooleanField.mockReset();
      });
      it('returns undefined if sensitiveContent is missing', () => {
        expect(new Parser(strictMode).parseSensitiveContent(undefined)).toBeUndefined();
      });
      it('returns sensitiveContent if it is valid (true)', () => {
        expect(new Parser(strictMode).parseSensitiveContent(true)).toBe(true);
      });
      it('returns sensitiveContent if it is valid (false)', () => {
        expect(new Parser(strictMode).parseSensitiveContent(false)).toBe(false);
      });
      it('returns sensitiveContent if it is valid (string[])', () => {
        expect(new Parser(strictMode).parseSensitiveContent(['clowns', 'mimes'])).toEqual(['clowns', 'mimes']);
      });
    });
    it('returns true if sensitive_content is the string "true"', () => {
      expect(new Parser(false).parseSensitiveContent('true')).toBe(true);
    });
    it('returns false if sensitive_content is the string "false"', () => {
      expect(new Parser(false).parseSensitiveContent('false')).toBe(false);
    });
  });
  describe('parseAttributeTraitType', () => {
    const fieldName = 'trait_type';
    const tag = ErrorTag.INVALID_ATTRIBUTE_TRAIT_TYPE;
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if trait_type is missing', () => {
        const fieldValue = undefined;
        expect(() => new Parser(strictMode).parseAttributeTraitType(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseAttributeTraitType(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the trait_type if it is valid (string)', () => {
        expect(new Parser(strictMode).parseAttributeTraitType('foo')).toBe('foo');
      });
      it('returns the trait_type if it is valid (integer 1)', () => {
        expect(new Parser(strictMode).parseAttributeTraitType(1)).toBe(1);
      });
      it('returns the trait_type if it is valid (integer 0)', () => {
        expect(new Parser(strictMode).parseAttributeTraitType(0)).toBe(0);
      });
      it('returns the trait_type if it is valid (integer -1)', () => {
        expect(new Parser(strictMode).parseAttributeTraitType(-1)).toBe(-1);
      });
    });
    it('returns an empty string if the field is an empty string in non-strict mode', () => {
      const fieldValue = '';
      expect(new Parser(false).parseAttributeTraitType(fieldValue)).toBe('');
    });
  });
  describe('parseAttributeValue', () => {
    const fieldName = 'value';
    const tag = ErrorTag.INVALID_ATTRIBUTE_VALUE;
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if value is missing', () => {
        const fieldValue = undefined;
        expect(() => new Parser(strictMode).parseAttributeValue(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField(fieldName, fieldValue, tag)
        );
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseAttributeValue(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the value if it is valid (string)', () => {
        expect(new Parser(strictMode).parseAttributeValue('foo')).toBe('foo');
      });
      it('returns the value if it is valid (integer 1)', () => {
        expect(new Parser(strictMode).parseAttributeValue(1)).toBe(1);
      });
      it('returns the value if it is valid (integer 0)', () => {
        expect(new Parser(strictMode).parseAttributeValue(0)).toBe(0);
      });
      it('returns the value if it is valid (integer -1)', () => {
        expect(new Parser(strictMode).parseAttributeValue(-1)).toBe(-1);
      });
    });
    it('returns an empty string if the field is an empty string in non-strict mode', () => {
      const fieldValue = '';
      expect(new Parser(false).parseAttributeValue(fieldValue)).toBe('');
    });
  });
  describe('parseAttributes', () => {
    const fieldName = 'attributes';
    const tag = ErrorTag.INVALID_ATTRIBUTES;
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if attributes is not an array (string)', () => {
        const fieldValue = 'foo';
        expect(() => new Parser(strictMode).parseAttributes(fieldValue)).toThrowError(
          ParsingError.invalidField(fieldName, fieldValue, tag)
        );
      });
      it('throws if attributes is not an array (object)', () => {
        const fieldValue = { foo: 'bar' };
        expect(() => new Parser(strictMode).parseAttributes(fieldValue)).toThrowError(
          ParsingError.invalidField(fieldName, fieldValue, tag)
        );
      });
      it('throws if attributes is not an array (integer)', () => {
        const fieldValue = 1;
        expect(() => new Parser(strictMode).parseAttributes(fieldValue)).toThrowError(
          ParsingError.invalidField(fieldName, fieldValue, tag)
        );
      });
      it('throws if any required field is missing', () => {
        const fieldValue = [
          {
            trait_type: 'foo',
          },
        ];
        expect(() => new Parser(strictMode).parseAttributes(fieldValue)).toThrowError(
          ParsingError.missingProperty('value', ErrorTag.INVALID_ATTRIBUTES)
        );
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
        expect(() => new Parser(strictMode).parseAttributes(fieldValue)).toThrowError(
          ParsingError.invalidProperty('unrecognized', ErrorTag.INVALID_ATTRIBUTES)
        );
      });
      it('returns the attributes if it is valid', () => {
        const fieldValue = [
          {
            trait_type: 'foo',
            value: 'bar',
          },
        ];
        expect(new Parser(strictMode).parseAttributes(fieldValue)).toEqual([
          {
            traitType: 'foo',
            value: 'bar',
            minValue: undefined,
            maxValue: undefined,
          },
        ]);
      });
      it('returns an empty array if the field is an empty array in non-strict mode', () => {
        const fieldValue: any[] = [];
        expect(new Parser(false).parseAttributes(fieldValue)).toEqual([]);
      });
    });
  });
  describe('parseCollectionAttributeType', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if type is missing', () => {
        const fieldValue = undefined;
        expect(() => new Parser(strictMode).parseCollectionAttributeType(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField('type', fieldValue, ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE)
        );
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseCollectionAttributeType(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the type if it is valid', () => {
        const fieldValue = 'foo';
        expect(new Parser(strictMode).parseCollectionAttributeType(fieldValue)).toBe('foo');
      });
    });
  });
  describe('parseCollectionAttributeValue', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if value is missing', () => {
        const fieldValue = undefined;
        expect(() => new Parser(strictMode).parseCollectionAttributeValue(fieldValue)).toThrowError(
          ParsingError.missingOrInvalidField('value', fieldValue, ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE)
        );
      });
      it('rethrows non-ParsingError exceptions from parseStringField', () => {
        const mockParseStringField = jest.fn(() => {
          throw new Error('mock error');
        });
        const parser = new Parser(strictMode);
        parser.parseStringField = mockParseStringField;
        expect(() => parser.parseCollectionAttributeValue(true)).toThrowError(new Error('mock error'));
        expect(mockParseStringField).toHaveBeenCalled();
        mockParseStringField.mockReset();
      });
      it('returns the value if it is valid', () => {
        const fieldValue = 'foo';
        expect(new Parser(strictMode).parseCollectionAttributeValue(fieldValue)).toBe('foo');
      });
    });
  });
  describe('parseCollection', () => {
    describe.each([true, false])('strict mode: %p', (strictMode) => {
      it('throws if collection is not an object (string)', () => {
        const fieldValue = 'foo';
        expect(() => new Parser(strictMode).parseCollection(fieldValue)).toThrowError(
          ParsingError.invalidField('collection', fieldValue, ErrorTag.INVALID_COLLECTION)
        );
      });
      it('throws if collection is not an object (array)', () => {
        const fieldValue = ['foo'];
        expect(() => new Parser(strictMode).parseCollection(fieldValue)).toThrowError(
          ParsingError.invalidField('collection', fieldValue, ErrorTag.INVALID_COLLECTION)
        );
      });
      it('returns the collection if it is valid (no attributes)', () => {
        const fieldValue = {
          id: 'foo',
          name: 'bar',
        };
        expect(new Parser(strictMode).parseCollection(fieldValue)).toEqual({
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
        expect(new Parser(strictMode).parseCollection(fieldValue)).toEqual({
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
