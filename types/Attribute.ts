import AttributeTraitType from './AttributeTraitType';
import AttributeValue from './AttributeValue';

type Attribute = {
  trait_type: AttributeTraitType;
  value: AttributeValue;
  min_value?: number;
  max_value?: number;
};

export default Attribute;
