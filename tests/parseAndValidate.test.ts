import Format from '../types/Format';
import parseNFTMetadata from '../src/parseAndValidate';
import fs from 'fs';

function pruneUndefinedProperties(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}

describe('parseNFTMetadata', () => {
  describe('CHIP-0007', () => {
    // For each JSON file in tests/fixtures/chip0007/inputs, run the following tests:
    fs.readdirSync('./tests/fixtures/chip0007/inputs').forEach((file) => {
      // given a file name like "name-strictMode.json", split it into ["name", "strictMode"] leaving off the ".json"
      const [name, strictMode] = file.split('.json')[0].split('-');
      const inputJSON = fs.readFileSync(`./tests/fixtures/chip0007/inputs/${file}`, 'utf8');
      const output = JSON.parse(fs.readFileSync(`./tests/fixtures/chip0007/outputs/${file}`, 'utf8'));

      it(`Parses ${file} correctly`, () => {
        const result = parseNFTMetadata(inputJSON, strictMode === 'strict', Format.CHIP_0007);
        expect(pruneUndefinedProperties(result)).toEqual(output);
      });
    });
  });
});
