import Collection from '../../types/Collection';
import CollectionAttribute from '../../types/CollectionAttribute';
import CollectionAttributeType from '../../types/CollectionAttributeType';
import CollectionAttributeValue from '../../types/CollectionAttributeValue';
import ErrorTag from '../errors/ErrorTag';
import Parser from './Parser';
import ParsingError, {
  throwInvalidFieldIf,
  throwInvalidPropertyIf,
  throwMissingOrInvalidFieldIf,
  throwMissingPropertyIf,
} from '../errors/ParsingError';

enum CHIP7CollectionField {
  ID = 'id',
  NAME = 'name',
  ATTRIBUTES = 'attributes',
}

enum CHIP7CollectionAttributeField {
  TYPE = 'type',
  VALUE = 'value',
}

class CHIP7CollectionParser extends Parser {
  constructor(strictMode: boolean = false) {
    super(strictMode);
  }

  parse(collection: NonNullable<any>): Collection | undefined {
    const requiredProperties = [CHIP7CollectionField.ID, CHIP7CollectionField.NAME];
    const optionalProperties = [CHIP7CollectionField.ATTRIBUTES];
    const allowedProperties = [...requiredProperties, ...optionalProperties];
    const objProperties = Object.keys(collection);

    // throw if any required properties are missing
    requiredProperties.forEach((prop) => {
      throwMissingPropertyIf(!objProperties.includes(prop), prop, ErrorTag.INVALID_ATTRIBUTES);
    });

    if (this.strictMode) {
      // throw if any properties are unrecognized
      objProperties.forEach((prop) => {
        throwInvalidPropertyIf(
          !allowedProperties.includes(prop as CHIP7CollectionField),
          prop,
          ErrorTag.INVALID_ATTRIBUTES
        );
      });
    }

    const id = this.parseStringField({
      fieldValue: collection.id,
      fieldName: CHIP7CollectionField.ID,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ID,
    });

    const name = this.parseStringField({
      fieldValue: collection.name,
      fieldName: CHIP7CollectionField.NAME,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_NAME,
    });

    const attributes = this.parseCollectionAttributes(collection.attributes);

    return { id: id || '', name: name || '', attributes };
  }

  parseCollectionAttributeType(type: NonNullable<any>): CollectionAttributeType {
    try {
      const stringValue = this.parseStringField({
        fieldValue: type,
        fieldName: CHIP7CollectionAttributeField.TYPE,
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
      fieldName: CHIP7CollectionAttributeField.TYPE,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE,
    });

    throwMissingOrInvalidFieldIf(
      integerValue === undefined,
      CHIP7CollectionAttributeField.TYPE,
      type,
      ErrorTag.INVALID_COLLECTION_ATTRIBUTE_TYPE
    );

    return integerValue!;
  }

  parseCollectionAttributeValue(value: NonNullable<any>): CollectionAttributeValue {
    try {
      const stringValue = this.parseStringField({
        fieldValue: value,
        fieldName: CHIP7CollectionAttributeField.VALUE,
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
      fieldName: CHIP7CollectionAttributeField.VALUE,
      requiredInStrictMode: true,
      tag: ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE,
    });

    throwMissingOrInvalidFieldIf(
      integerValue === undefined,
      CHIP7CollectionAttributeField.VALUE,
      value,
      ErrorTag.INVALID_COLLECTION_ATTRIBUTE_VALUE
    );

    return integerValue!;
  }

  parseCollectionAttribute(attribute: NonNullable<any>): CollectionAttribute {
    const requiredProperties = [CHIP7CollectionAttributeField.TYPE, CHIP7CollectionAttributeField.VALUE];
    const allowedProperties = [...requiredProperties];
    const objProperties = Object.keys(attribute);

    // throw if any required properties are missing
    requiredProperties.forEach((prop) => {
      throwMissingPropertyIf(!objProperties.includes(prop), prop, ErrorTag.INVALID_COLLECTION_ATTRIBUTES);
    });

    if (this.strictMode) {
      // throw if any properties are unrecognized
      objProperties.forEach((prop) => {
        throwInvalidPropertyIf(
          !allowedProperties.includes(prop as CHIP7CollectionAttributeField),
          prop,
          ErrorTag.INVALID_COLLECTION_ATTRIBUTES
        );
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
    const array = this.parseArrayField<CollectionAttribute>({
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
}

export default CHIP7CollectionParser;
