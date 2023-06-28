// Parser class

import ErrorTag from '../errors/ErrorTag';
import ParsingError from '../errors/ParsingError';
import UncheckedMetadata from '../../types/UncheckedMetadata';
import Format from '../../types/Format';
import SensitiveContent from '../../types/SensitiveContent';
import Attribute from '../../types/Attribute';
import AttributeTraitType from '../../types/AttributeTraitType';
import AttributeValue from '../../types/AttributeValue';
import Collection from '../../types/Collection';
import CollectionAttribute from '../../types/CollectionAttribute';
import CollectionAttributeType from '../../types/CollectionAttributeType';
import CollectionAttributeValue from '../../types/CollectionAttributeValue';

function throwMissingOrInvalidFieldIf(cond: boolean, fieldName: string, fieldValue: any, tag: ErrorTag) {
  if (cond) {
    throw ParsingError.missingOrInvalidField(fieldName, fieldValue, tag);
  }
}

function throwInvalidFieldIf(cond: boolean, fieldName: string, fieldValue: any, tag: ErrorTag) {
  if (cond) {
    throw ParsingError.invalidField(fieldName, fieldValue, tag);
  }
}

function throwMissingPropertyIf(cond: boolean, propertyName: string, tag: ErrorTag) {
  if (cond) {
    throw ParsingError.missingProperty(propertyName, tag);
  }
}

function throwInvalidPropertyIf(cond: boolean, propertyName: string, tag: ErrorTag) {
  if (cond) {
    throw ParsingError.invalidProperty(propertyName, tag);
  }
}

export class Parser {
  strictMode: boolean;

  constructor(strictMode = false) {
    this.strictMode = strictMode;
  }

  static fromJSON(jsonStr: string, strictMode = false): UncheckedMetadata {
    const rawMetadata = JSON.parse(jsonStr); // propagate JSON parsing errors

    return new Parser(strictMode).parseMetadata(rawMetadata);
  }

  parseEnumField(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    enumValues: string[];
    defaultValue?: string;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): string {
    const { fieldValue, fieldName, enumValues, defaultValue, requiredInStrictMode, tag } = args;
    const haveField = !!fieldValue;
    const isValidField = haveField && enumValues.includes(fieldValue);

    throwMissingOrInvalidFieldIf(this.strictMode && requiredInStrictMode && !isValidField, fieldName, fieldValue, tag);
    throwInvalidFieldIf(!this.strictMode && haveField && !isValidField, fieldName, fieldValue, tag);

    // use default value if no field is specified
    return fieldValue || defaultValue;
  }

  parseField<T>(args: {
    fieldValue: NonNullable<T>;
    fieldName: string;
    fieldType: any;
    defaultValue?: T;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): T | undefined {
    const { fieldValue, fieldName, fieldType, defaultValue, requiredInStrictMode, tag } = args;
    // const haveField = !!fieldValue;
    const haveField = fieldValue !== undefined;
    const isValidField = haveField && typeof fieldValue === fieldType;

    throwMissingOrInvalidFieldIf(this.strictMode && requiredInStrictMode && !isValidField, fieldName, fieldValue, tag);
    throwInvalidFieldIf(!this.strictMode && haveField && !isValidField, fieldName, fieldValue, tag);

    // use default value if fieldValue is undefined
    return typeof fieldValue === fieldType ? fieldValue : defaultValue;
  }

  parseBooleanField(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    defaultValue?: boolean;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): boolean | undefined {
    return this.parseField<boolean>({
      ...args,
      fieldType: 'boolean',
    });
  }

  parseIntegerField(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    defaultValue?: number;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): number | undefined {
    const { fieldValue, fieldName, tag } = args;
    const numericValue = this.parseField<number>({
      ...args,
      fieldType: 'number',
    });

    throwInvalidFieldIf(!!numericValue && !Number.isInteger(numericValue), fieldName, fieldValue, tag);

    return numericValue;
  }

  parseStringField(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    defaultValue?: string;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): string | undefined {
    const stringValue = this.parseField<string>({ ...args, fieldType: 'string' });

    throwMissingOrInvalidFieldIf(
      this.strictMode && args.requiredInStrictMode && !stringValue,
      args.fieldName,
      args.fieldValue,
      args.tag
    );

    return typeof stringValue === 'string' ? stringValue : args.defaultValue;
  }

  parseArrayField<T>(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    fieldType: any;
    defaultValue?: T[];
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): T[] | undefined {
    const { fieldValue, fieldName, fieldType, defaultValue, requiredInStrictMode, tag } = args;
    const objValue = this.parseField<T[]>({ ...args, fieldType: 'object' });
    // validate that all elements in the array are of type T
    const isValidArray = !!objValue && Array.isArray(objValue) && objValue.every((elem) => typeof elem === fieldType);

    throwMissingOrInvalidFieldIf(this.strictMode && requiredInStrictMode && !isValidArray, fieldName, fieldValue, tag);
    throwInvalidFieldIf(!!objValue && !isValidArray, fieldName, fieldValue, tag);

    return objValue || defaultValue;
  }

  parseFormat(format: NonNullable<any>): Format {
    return this.parseEnumField({
      fieldValue: format,
      fieldName: 'format',
      enumValues: Object.values(Format),
      defaultValue: Format.CHIP_0007,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_FORMAT,
    }) as Format;
  }

  parseName(name: NonNullable<any>): string {
    const nameValue = this.parseStringField({
      fieldValue: name,
      fieldName: 'name',
      defaultValue: '',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_NAME,
    });

    return nameValue || '';
  }

  parseDescription(description: NonNullable<any>): string {
    const descriptionValue = this.parseStringField({
      fieldValue: description,
      fieldName: 'description',
      defaultValue: '',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_DESCRIPTION,
    });

    return descriptionValue || '';
  }

  parseMintingTool(mintingTool: NonNullable<any>): string | undefined {
    return this.parseStringField({
      fieldValue: mintingTool,
      fieldName: 'mintingTool',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_MINTING_TOOL,
    });
  }

  parseSensitiveContent(sensitiveContent: NonNullable<any>): SensitiveContent | undefined {
    const args = {
      fieldValue: sensitiveContent,
      fieldName: 'sensitiveContent',
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_SENSITIVE_CONTENT,
    };
    try {
      const boolValue = this.parseBooleanField(args);

      if (boolValue !== undefined) {
        return boolValue;
      }
    } catch (e) {
      // if not a boolean, we'll try parsing as an array of strings
      if (e instanceof ParsingError) {
        // ignore
      } else {
        throw e;
      }
    }

    // if not in strict mode, we can check if sensitive_content is a string like 'true' or 'false'
    if (!this.strictMode) {
      try {
        const stringValue = this.parseStringField(args);

        if (stringValue !== undefined) {
          return stringValue.toLowerCase() === 'true';
        }
      } catch (e) {
        // if not a string, we'll try parsing as an array of strings
        if (e instanceof ParsingError) {
          // ignore
        }
      }
    }

    const stringArrayValue = this.parseArrayField<string>({
      ...args,
      fieldType: 'string',
    });

    return stringArrayValue === undefined ? undefined : stringArrayValue;
  }

  parseSeriesNumber(seriesNumber: NonNullable<any>): number | undefined {
    return this.parseIntegerField({
      fieldValue: seriesNumber,
      fieldName: 'seriesNumber',
      defaultValue: 0,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_SERIES_NUMBER,
    });
  }

  parseSeriesTotal(seriesTotal: NonNullable<any>): number | undefined {
    return this.parseIntegerField({
      fieldValue: seriesTotal,
      fieldName: 'seriesTotal',
      defaultValue: 0,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_SERIES_TOTAL,
    });
  }

  parseAttributeTraitType(traitType: NonNullable<any>): AttributeTraitType {
    try {
      const stringValue = this.parseStringField({
        fieldValue: traitType,
        fieldName: 'trait_type',
        requiredInStrictMode: true,
        tag: ErrorTag.INVALID_ATTRIBUTE_TRAIT_TYPE,
      });

      if (stringValue !== undefined) {
        return stringValue;
      }
    } catch (e) {
      // if not a string, we'll try parsing as an integer
      if (e instanceof ParsingError) {
        // ignore
      } else {
        throw e;
      }
    }

    const integerValue = this.parseIntegerField({
      fieldValue: traitType,
      fieldName: 'trait_type',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_ATTRIBUTE_TRAIT_TYPE,
    });

    throwMissingOrInvalidFieldIf(
      integerValue === undefined,
      'trait_type',
      traitType,
      ErrorTag.INVALID_ATTRIBUTE_TRAIT_TYPE
    );

    return integerValue!;
  }

  parseAttributeValue(value: NonNullable<any>): AttributeValue {
    try {
      const stringValue = this.parseStringField({
        fieldValue: value,
        fieldName: 'value',
        requiredInStrictMode: true,
        tag: ErrorTag.INVALID_ATTRIBUTE_VALUE,
      });

      if (stringValue !== undefined) {
        return stringValue;
      }
    } catch (e) {
      // if not a string, we'll try parsing as an integer
      if (e instanceof ParsingError) {
        // ignore
      } else {
        throw e;
      }
    }

    const integerValue = this.parseIntegerField({
      fieldValue: value,
      fieldName: 'value',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_ATTRIBUTE_VALUE,
    });

    throwMissingOrInvalidFieldIf(integerValue === undefined, 'value', value, ErrorTag.INVALID_ATTRIBUTE_VALUE);

    return integerValue!;
  }

  parseAttribute(attribute: NonNullable<any>): Attribute {
    const requiredProperties = ['trait_type', 'value'];
    const optionalProperties = ['min_value', 'max_value'];
    const allowedProperties = [...requiredProperties, ...optionalProperties];
    const objProperties = Object.keys(attribute);

    // throw if any required properties are missing
    requiredProperties.forEach((prop) => {
      throwMissingPropertyIf(!objProperties.includes(prop), prop, ErrorTag.INVALID_ATTRIBUTES);
    });

    if (this.strictMode) {
      // throw if any properties are unrecognized
      objProperties.forEach((prop) => {
        throwInvalidPropertyIf(!allowedProperties.includes(prop), prop, ErrorTag.INVALID_ATTRIBUTES);
      });
    }

    const traitType = this.parseAttributeTraitType(attribute.trait_type);
    const value = this.parseAttributeValue(attribute.value);
    const minValue = this.parseIntegerField({
      fieldValue: attribute.min_value,
      fieldName: 'min_value',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTE_MIN_VALUE,
    });
    const maxValue = this.parseIntegerField({
      fieldValue: attribute.max_value,
      fieldName: 'max_value',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTE_MAX_VALUE,
    });

    return {
      traitType,
      value,
      minValue,
      maxValue,
    };
  }

  parseAttributes(attributes: NonNullable<any>): Attribute[] | undefined {
    const array = this.parseArrayField<Attribute>({
      fieldValue: attributes,
      fieldName: 'attributes',
      fieldType: 'object',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTES,
    });

    // if attributes is present, it must be an array
    throwInvalidFieldIf(
      !!attributes && !Array.isArray(attributes),
      'attributes',
      attributes,
      ErrorTag.INVALID_ATTRIBUTES
    );

    if (array === undefined) {
      return undefined;
    }

    return array.map((attribute) => this.parseAttribute(attribute));
  }

  parseCollectionAttributeType(type: NonNullable<any>): CollectionAttributeType {
    try {
      const stringValue = this.parseStringField({
        fieldValue: type,
        fieldName: 'type',
        requiredInStrictMode: true,
        tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE,
      });

      if (stringValue !== undefined) {
        return stringValue;
      }
    } catch (e) {
      // if not a string, we'll try parsing as an integer
      if (e instanceof ParsingError) {
        // ignore
      } else {
        throw e;
      }
    }

    const integerValue = this.parseIntegerField({
      fieldValue: type,
      fieldName: 'type',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE,
    });

    throwMissingOrInvalidFieldIf(integerValue === undefined, 'type', type, ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE);

    return integerValue!;
  }

  parseCollectionAttributeValue(value: NonNullable<any>): CollectionAttributeValue {
    try {
      const stringValue = this.parseStringField({
        fieldValue: value,
        fieldName: 'value',
        requiredInStrictMode: true,
        tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE,
      });

      if (stringValue !== undefined) {
        return stringValue;
      }
    } catch (e) {
      // if not a string, we'll try parsing as an integer
      if (e instanceof ParsingError) {
        // ignore
      } else {
        throw e;
      }
    }

    const integerValue = this.parseIntegerField({
      fieldValue: value,
      fieldName: 'value',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE,
    });

    throwMissingOrInvalidFieldIf(
      integerValue === undefined,
      'value',
      value,
      ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE
    );

    return integerValue!;
  }

  parseCollectionAttribute(attribute: NonNullable<any>): CollectionAttribute {
    const requiredProperties = ['type', 'value'];
    const allowedProperties = [...requiredProperties];
    const objProperties = Object.keys(attribute);

    // throw if any required properties are missing
    requiredProperties.forEach((prop) => {
      throwMissingPropertyIf(!objProperties.includes(prop), prop, ErrorTag.INVALID_COLLECTION_ATTRIBUTES);
    });

    if (this.strictMode) {
      // throw if any properties are unrecognized
      objProperties.forEach((prop) => {
        throwInvalidPropertyIf(!allowedProperties.includes(prop), prop, ErrorTag.INVALID_COLLECTION_ATTRIBUTES);
      });
    }

    const type = this.parseCollectionAttributeType(attribute.type);
    const value = this.parseCollectionAttributeValue(attribute.value);

    return {
      type,
      value,
    };
  }

  parseCollectionAttributes(attributes: NonNullable<any>): CollectionAttribute[] | undefined {
    const array = this.parseArrayField<Attribute>({
      fieldValue: attributes,
      fieldName: 'attributes',
      fieldType: 'object',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTES,
    });

    // if attributes is present, it must be an array
    throwInvalidFieldIf(
      !!attributes && !Array.isArray(attributes),
      'attributes',
      attributes,
      ErrorTag.INVALID_COLLECTION_ATTRIBUTES
    );

    if (array === undefined) {
      return undefined;
    }

    return array.map((attribute) => this.parseCollectionAttribute(attribute));
  }

  parseCollection(collection: NonNullable<any>): Collection | undefined {
    const collectionObj = this.parseField<Collection>({
      fieldValue: collection,
      fieldName: 'collection',
      fieldType: 'object',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_COLLECTION,
    });

    // if collection is present, it must be an object
    throwInvalidFieldIf(!!collection && !collectionObj, 'collection', collection, ErrorTag.INVALID_COLLECTION);
    // collection must be an object with key/value pairs
    throwInvalidFieldIf(
      !!collectionObj &&
        (collectionObj === null || Array.isArray(collectionObj) || Object.keys(collectionObj as any).length === 0),
      'collection',
      collection,
      ErrorTag.INVALID_COLLECTION
    );

    if (!collectionObj) {
      return undefined;
    }

    const requiredProperties = ['id', 'name'];
    const optionalProperties = ['attributes'];
    const allowedProperties = [...requiredProperties, ...optionalProperties];
    const objProperties = Object.keys(collectionObj);

    // throw if any required properties are missing
    requiredProperties.forEach((prop) => {
      throwMissingPropertyIf(!objProperties.includes(prop), prop, ErrorTag.INVALID_ATTRIBUTES);
    });

    if (this.strictMode) {
      // throw if any properties are unrecognized
      objProperties.forEach((prop) => {
        throwInvalidPropertyIf(!allowedProperties.includes(prop), prop, ErrorTag.INVALID_ATTRIBUTES);
      });
    }

    const id = this.parseStringField({
      fieldValue: collection.id,
      fieldName: 'id',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ID,
    });

    const name = this.parseStringField({
      fieldValue: collection.name,
      fieldName: 'name',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_NAME,
    });

    const attributes = this.parseCollectionAttributes(collection.attributes);

    return { id: id || '', name: name || '', attributes };
  }

  parseMetadata(rawMetadata: NonNullable<any>): UncheckedMetadata {
    const format = this.parseFormat(rawMetadata.format);
    const name = this.parseName(rawMetadata.name);
    const description = this.parseDescription(rawMetadata.description);
    const mintingTool = this.parseMintingTool(rawMetadata.minting_tool);
    const sensitiveContent = this.parseSensitiveContent(rawMetadata.sensitive_content);
    const seriesNumber = this.parseSeriesNumber(rawMetadata.series_number);
    const seriesTotal = this.parseSeriesTotal(rawMetadata.series_total);
    const attributes = this.parseAttributes(rawMetadata.attributes);
    const collection = this.parseCollection(rawMetadata.collection);

    return {
      format,
      name,
      description,
      mintingTool,
      sensitiveContent,
      seriesNumber,
      seriesTotal,
      attributes,
      collection,
    };
  }
}

export default Parser;
