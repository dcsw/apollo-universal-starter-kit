import { orderedFor } from '../../sql/helpers';
import knex from '../../sql/connector';

export default class Xxxx {
  xxxxsPagination(limit, after) {
    let where = '';
    if (after > 0) {
      where = `id < ${after}`;
    }

    return knex
      .select('id', 'title', 'content')
      .from('xxxx')
      .whereRaw(where)
      .orderBy('id', 'desc')
      .limit(limit);
  }

  getTotal() {
    return knex('xxxx')
      .countDistinct('id as count')
      .first();
  }

  getNextPageFlag(id) {
    return knex('xxxx')
      .countDistinct('id as count')
      .where('id', '<', id)
      .first();
  }

  xxxx(id) {
    return knex
      .select('id', 'title', 'content')
      .from('xxxx')
      .where('id', '=', id)
      .first();
  }

  addXxxx({ title, content }) {
    return knex('xxxx')
      .insert({ title, content })
      .returning('id');
  }

  deleteXxxx(id) {
    return knex('xxxx')
      .where('id', '=', id)
      .del();
  }

  editXxxx({ id, title, content }) {
    return knex('xxxx')
      .where('id', '=', id)
      .update({
        title: title,
        content: content
      });
  }
}
