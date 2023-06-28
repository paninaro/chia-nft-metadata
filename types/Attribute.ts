import AttributeTraitType from './AttributeTraitType';
import AttributeValue from './AttributeValue';

type Attribute = {
  traitType: AttributeTraitType;
  value: AttributeValue;
  minValue?: number;
  maxValue?: number;
};

export default Attribute;
