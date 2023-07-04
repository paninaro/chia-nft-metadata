import parseNFTMetadata from './src/parseAndValidate';

// run parseNFTMetadata using ARGV[2] as the input JSON
console.log(parseNFTMetadata(process.argv[2]));
