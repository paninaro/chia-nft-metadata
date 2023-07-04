import ErrorTag from '../errors/ErrorTag';
import { throwMissingOrInvalidFieldIf, throwInvalidFieldIf } from '../errors/ParsingError';
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

export class Parser {
  strictMode: boolean;

  constructor(strictMode = false) {
    this.strictMode = strictMode;
  }

  parseField<T>(args: {
    fieldValue: NonNullable<T>;
    fieldName: string;
    fieldType: any;
    allowedValues?: T[];
    defaultValue?: T;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): T | undefined {
    const { fieldValue, fieldName, fieldType, allowedValues, defaultValue, requiredInStrictMode, tag } = args;
    const haveField = fieldValue !== undefined;
    const isValidField =
      haveField && typeof fieldValue === fieldType && (!allowedValues || allowedValues.includes(fieldValue));

    throwMissingOrInvalidFieldIf(this.strictMode && requiredInStrictMode && !isValidField, fieldName, fieldValue, tag);
    throwInvalidFieldIf(haveField && !isValidField, fieldName, fieldValue, tag);

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

  parseEnumField<T>(args: {
    fieldValue: NonNullable<any>;
    fieldName: string;
    allowedValues: T[];
    defaultValue?: T;
    requiredInStrictMode: boolean;
    tag: ErrorTag;
  }): T | undefined {
    return this.parseField<T>({
      ...args,
      fieldType: 'string', // limited to string enums for now
    }) as T;
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
      this.strictMode && args.requiredInStrictMode && !stringValue && stringValue !== '',
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
}

export default Parser;
