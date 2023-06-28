enum ErrorTag {
  // parser0001: In strict mode, format is required and must be valid. In non-strict mode, format is optional but must be valid if specified
  INVALID_FORMAT = 'parser0001',

  // parser0002: In strict mode, name is required and must be a non-zero length string. In non-strict mode, name is optional but must be a string if specified
  INVALID_NAME = 'parser0002',

  // parser0003: In strict mode, description is required and must be a non-zero length string. In non-strict mode, description is optional but must be a string if specified
  INVALID_DESCRIPTION = 'parser0003',

  // parser0004: minting_tool is not required, but must be a string if specified
  INVALID_MINTING_TOOL = 'parser0004',

  // parser0005: sensitive_content is optional, but must be a boolean or array of strings if specified
  INVALID_SENSITIVE_CONTENT = 'parser0005',

  // parser0006: series_number is optional, but must be an integer if specified
  INVALID_SERIES_NUMBER = 'parser0006',

  // parser0007: series_total is optional, but must be an integer if specified
  INVALID_SERIES_TOTAL = 'parser0007',

  // parser0008: attributes is optional, but must be an array of Attribute objects if specified
  INVALID_ATTRIBUTES = 'parser0008',

  // parser0009: attribute trait_type is required and must be an integer or string
  INVALID_ATTRIBUTE_TRAIT_TYPE = 'parser0009',

  // parser0010: attribute value is required and must be an integer or string
  INVALID_ATTRIBUTE_VALUE = 'parser0010',

  // parser0011: attribute min_value is optional, but must be an integer if specified
  INVALID_ATTRIBUTE_MIN_VALUE = 'parser0011',

  // parser0012: attribute max_value is optional, but must be an integer if specified
  INVALID_ATTRIBUTE_MAX_VALUE = 'parser0012',

  // parser0013: collection is optional, but must be a Collection object if specified
  INVALID_COLLECTION = 'parser0013',

  // parser0014: In strict mode, id is required and must be a non-zero length string. In non-strict mode, id is optional but must be a string if specified
  INVALID_COLLECTION_ID = 'parser0014',

  // parser0015: In strict mode, name is required and must be a non-zero length string. In non-strict mode, name is optional but must be a string if specified
  INVALID_COLLECTION_NAME = 'parser0015',

  // parser0016: collection attributes are optional, but must be an array of CollectionAttribute objects if specified
  INVALID_COLLECTION_ATTRIBUTES = 'parser0016',

  // parser0017: collection attribute type is required and must be an integer or string
  INVALID_COLLECTION_ATTRIBUTE_TYPE = 'parser0017',

  // parser0018: collection attribute value is required and must be an integer or string
  INVALID_COLLECTION_ATTRIBUTE_VALUE = 'parser0018',
}

export default ErrorTag;
