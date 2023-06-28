import CollectionAttribute from './CollectionAttribute';

type Collection = {
  id: string;
  name: string;
  attributes?: CollectionAttribute[];
};

export default Collection;
