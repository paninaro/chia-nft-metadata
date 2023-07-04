import Format from '../types/Format';
import CHIP7Parser from './parser/CHIP7Parser';
import UncheckedMetadata from '../types/UncheckedMetadata';

function parseNFTMetadata(
  jsonMetadata: string,
  strictMode: boolean = false,
  format: Format = Format.CHIP_0007
): UncheckedMetadata {
  if (format === Format.CHIP_0007) {
    return new CHIP7Parser(strictMode).parseMetadata(JSON.parse(jsonMetadata));
  }

  throw new Error(`Unsupported format: ${format}`);
}

function parseAndValidateNFTMetadata(
  jsonMetadata: string,
  strictMode: boolean = false,
  format: Format = Format.CHIP_0007
): UncheckedMetadata {
  throw new Error('Not implemented');
}

export default parseNFTMetadata;
