import Attribute from '../../types/Attribute';
import AttributeTraitType from '../../types/AttributeTraitType';
import AttributeValue from '../../types/AttributeValue';
import CHIP7CollectionParser from './CHIP7CollectionParser';
import Collection from '../../types/Collection';
import CollectionAttribute from '../../types/CollectionAttribute';
import CollectionAttributeType from '../../types/CollectionAttributeType';
import CollectionAttributeValue from '../../types/CollectionAttributeValue';
import ErrorTag from '../errors/ErrorTag';
import Format from '../../types/Format';
import Parser from './Parser';
import ParsingError, {
  throwInvalidFieldIf,
  throwInvalidPropertyIf,
  throwMissingOrInvalidFieldIf,
  throwMissingPropertyIf,
} from '../errors/ParsingError';
import UncheckedMetadata from '../../types/UncheckedMetadata';

import SensitiveContent from '../../types/SensitiveContent';

enum CHIP7Field {
  FORMAT = 'format',
  NAME = 'name',
  DESCRIPTION = 'description',
  MINTING_TOOL = 'mintingTool',
  SENSITIVE_CONTENT = 'sensitiveContent',
  SERIES_NUMBER = 'seriesNumber',
  SERIES_TOTAL = 'seriesTotal',
  ATTRIBUTES = 'attributes',
  COLLECTION = 'collection',
  DATA = 'data',
}

class CHIP7Parser extends Parser {
  constructor(strictMode: boolean = false) {
    super(strictMode);
  }

  static fromJSON(jsonStr: string, strictMode = false): UncheckedMetadata {
    const rawMetadata = JSON.parse(jsonStr); // propagate JSON parsing errors

    return new CHIP7Parser(strictMode).parseMetadata(rawMetadata);
  }

  parseMetadata(rawMetadata: NonNullable<any>): UncheckedMetadata {
    const format = this.parseFormat(rawMetadata.format);
    const name = this.parseName(rawMetadata.name);
    const description = this.parseDescription(rawMetadata.description);
    const minting_tool = this.parseMintingTool(rawMetadata.minting_tool);
    const sensitive_content = this.parseSensitiveContent(rawMetadata.sensitive_content);
    const series_number = this.parseSeriesNumber(rawMetadata.series_number);
    const series_total = this.parseSeriesTotal(rawMetadata.series_total);
    const attributes = this.parseAttributes(rawMetadata.attributes);
    const collection = this.parseCollection(rawMetadata.collection);
    const data = this.parseData(rawMetadata.data);

    return {
      format,
      name,
      description,
      minting_tool,
      sensitive_content,
      series_number,
      series_total,
      attributes,
      collection,
      data,
    };
  }

  parseFormat(format: NonNullable<any>): Format {
    return this.parseEnumField<Format>({
      fieldValue: format,
      fieldName: CHIP7Field.FORMAT,
      allowedValues: Object.values(Format),
      defaultValue: Format.CHIP_0007,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_FORMAT,
    }) as Format;
  }

  parseName(name: NonNullable<any>): string {
    const nameValue = this.parseStringField({
      fieldValue: name,
      fieldName: CHIP7Field.NAME,
      defaultValue: '',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_NAME,
    });

    return nameValue || '';
  }

  parseDescription(description: NonNullable<any>): string {
    const descriptionValue = this.parseStringField({
      fieldValue: description,
      fieldName: CHIP7Field.DESCRIPTION,
      defaultValue: '',
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_DESCRIPTION,
    });

    return descriptionValue || '';
  }

  parseMintingTool(mintingTool: NonNullable<any>): string | undefined {
    return this.parseStringField({
      fieldValue: mintingTool,
      fieldName: CHIP7Field.MINTING_TOOL,
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_MINTING_TOOL,
    });
  }

  parseSensitiveContent(sensitiveContent: NonNullable<any>): SensitiveContent | undefined {
    const args = {
      fieldValue: sensitiveContent,
      fieldName: CHIP7Field.SENSITIVE_CONTENT,
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
      fieldName: CHIP7Field.SERIES_NUMBER,
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_SERIES_NUMBER,
    });
  }

  parseSeriesTotal(seriesTotal: NonNullable<any>): number | undefined {
    return this.parseIntegerField({
      fieldValue: seriesTotal,
      fieldName: CHIP7Field.SERIES_TOTAL,
      defaultValue: undefined,
      requiredInStrictMode: false,
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

    const trait_type = this.parseAttributeTraitType(attribute.trait_type);
    const value = this.parseAttributeValue(attribute.value);
    const min_value = this.parseIntegerField({
      fieldValue: attribute.min_value,
      fieldName: 'min_value',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTE_MIN_VALUE,
    });
    const max_value = this.parseIntegerField({
      fieldValue: attribute.max_value,
      fieldName: 'max_value',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTE_MAX_VALUE,
    });

    return {
      trait_type,
      value,
      min_value,
      max_value,
    };
  }

  parseAttributes(attributes: NonNullable<any>): Attribute[] | undefined {
    const array = this.parseArrayField<Attribute>({
      fieldValue: attributes,
      fieldName: CHIP7Field.ATTRIBUTES,
      fieldType: 'object',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_ATTRIBUTES,
    });

    // if attributes is present, it must be an array
    throwInvalidFieldIf(
      !!attributes && !Array.isArray(attributes),
      CHIP7Field.ATTRIBUTES,
      attributes,
      ErrorTag.INVALID_ATTRIBUTES
    );

    if (array === undefined) {
      return undefined;
    }

    return array.map((attribute) => this.parseAttribute(attribute));
  }

  parseCollection(collection: NonNullable<any>): Collection | undefined {
    const collectionObj = this.parseField<Collection>({
      fieldValue: collection,
      fieldName: CHIP7Field.COLLECTION,
      fieldType: 'object',
      defaultValue: undefined,
      requiredInStrictMode: false,
      tag: ErrorTag.INVALID_COLLECTION,
    });

    // if collection is present, it must be an object
    throwInvalidFieldIf(!!collection && !collectionObj, CHIP7Field.COLLECTION, collection, ErrorTag.INVALID_COLLECTION);
    // collection must be an object with key/value pairs
    throwInvalidFieldIf(
      !!collectionObj &&
        (collectionObj === null || Array.isArray(collectionObj) || Object.keys(collectionObj as any).length === 0),
      CHIP7Field.COLLECTION,
      collection,
      ErrorTag.INVALID_COLLECTION
    );

    if (!collectionObj) {
      return undefined;
    }

    return new CHIP7CollectionParser(this.strictMode).parse(collectionObj);
  }

  parseData(data: NonNullable<any>): any {
    return data;
  }
}

export default CHIP7Parser;
