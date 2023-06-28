import Format from './Format';
import SensitiveContent from './SensitiveContent';
import Attribute from './Attribute';
import Collection from './Collection';

type UncheckedMetadata = {
  format: Format;
  name: string;
  description: string;
  mintingTool?: string;
  sensitiveContent?: SensitiveContent;
  seriesNumber?: number;
  seriesTotal?: number;
  attributes?: Attribute[];
  collection?: Collection;
};

export default UncheckedMetadata;
