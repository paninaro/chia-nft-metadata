import Format from '../../types/Format';
import UncheckedMetadata from '../../types/UncheckedMetadata';
import ParsingError from '../errors/ParsingError';
import ErrorTag from '../errors/ErrorTag';

import Parser from './Parser';

// export default function parseMetadata(jsonStr: string, strictMode: boolean): UncheckedMetadata {
//   const throwErrIf = (cond: boolean, msg: string, tag: ErrorTag) => {
//     if (cond) {
//       throw new ParsingError(msg, tag);
//     }
//   };

//   const rawMetadata = JSON.parse(jsonStr); // propagate JSON parsing errors

//   // check for required fields

//   // format
//   // in strict mode, format is required and must be a valid string
//   // in non-strict mode, format is optional but must be a valid string if specified

//   const haveFormat = !!rawMetadata.format;
//   const isValidFormat = haveFormat && Object.values(Format).includes(rawMetadata.format);
//   throwErrIf(strictMode && !isValidFormat, `Missing or invalid format: ${rawMetadata.format}`, ErrorTag.INVALID_FORMAT);
//   throwErrIf(
//     !strictMode && haveFormat && !isValidFormat,
//     `Invalid format: ${rawMetadata.format}`,
//     ErrorTag.INVALID_FORMAT
//   );

//   // assume CHIP-0007 if no format is specified
//   const format: Format = rawMetadata.format || Format.CHIP_0007;

//   // name
//   // in strict mode, name is required and must be a non-zero length string
//   // in non-strict mode, name is optional but must be a string if specified

//   const haveName = !!rawMetadata.name;
//   const isValidName = haveName && typeof rawMetadata.name === 'string' && rawMetadata.name.length > 0;
//   throwErrIf(strictMode && !isValidName, `Missing or invalid name: ${rawMetadata.name}`, ErrorTag.INVALID_NAME);
//   throwErrIf(!strictMode && haveName && !isValidName, `Invalid name: ${rawMetadata.name}`, ErrorTag.INVALID_NAME);

//   // use empty string if no name is specified
//   const name: string = rawMetadata.name || '';

//   return {
//     format,
//     name,
//   };
// }

export default function parseMetadata(jsonStr: string, strictMode: boolean): UncheckedMetadata {
  return Parser.fromJSON(jsonStr, strictMode);
}
