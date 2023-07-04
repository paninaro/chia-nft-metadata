import Format from './Format';
import SensitiveContent from './SensitiveContent';
import Attribute from './Attribute';
import Collection from './Collection';

type UncheckedMetadata = {
  format: Format;
  name: string;
  description: string;
  minting_tool?: string;
  sensitive_content?: SensitiveContent;
  series_number?: number;
  series_total?: number;
  attributes?: Attribute[];
  collection?: Collection;
  data?: any;
};

export default UncheckedMetadata;
