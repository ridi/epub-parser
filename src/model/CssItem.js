import { isExists, mergeObjects } from '../util';
import Item from './Item';

class CssItem extends Item {
  get defaultEncoding() { return 'utf8'; }

  constructor(rawObj) {
    super(rawObj);
    if (isExists(rawObj.namespace)) {
      this.namespace = rawObj.namespace;
    }
    if (this.constructor === CssItem) {
      Object.freeze(this);
    }
  }

  toRaw() {
    return mergeObjects(super.toRaw(), {
      namespace: this.namespace,
      itemType: CssItem.name,
    });
  }
}

export default CssItem;
