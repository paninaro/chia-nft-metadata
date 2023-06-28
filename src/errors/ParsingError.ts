// Error type for communicating parsing errors

import ErrorTag from './ErrorTag';

export default class ParsingError extends Error {
  tag: ErrorTag;

  static missingOrInvalidField(fieldName: string, fieldValue: any, tag: ErrorTag): ParsingError {
    return new ParsingError(`Missing or invalid ${fieldName}: ${fieldValue}`, tag);
  }

  static invalidField(fieldName: string, fieldValue: any, tag: ErrorTag): ParsingError {
    return new ParsingError(`Invalid ${fieldName}: ${fieldValue}`, tag);
  }

  static missingProperty(propertyName: string, tag: ErrorTag): ParsingError {
    return new ParsingError(`Missing property ${propertyName}`, tag);
  }

  static invalidProperty(propertyName: string, tag: ErrorTag): ParsingError {
    return new ParsingError(`Invalid property ${propertyName}`, tag);
  }

  constructor(message: string, tag: ErrorTag) {
    super(`${message} [${tag}]`);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, ParsingError.prototype);

    this.name = 'ParsingError';
    this.tag = tag;
  }

  toString(): string {
    return `${this.name}: ${this.message} [${this.tag}]`;
  }
}
