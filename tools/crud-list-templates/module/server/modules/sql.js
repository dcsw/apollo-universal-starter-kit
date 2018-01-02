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

  async getDescriptionsForXxxxIds(xxxxIds) {
    let res = await knex
      .select('id', 'content', 'xxxx_id AS xxxxId')
      .from('description')
      .whereIn('xxxx_id', xxxxIds);

    return orderedFor(res, xxxxIds, 'xxxxId', false);
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

  addDescription({ content, xxxxId }) {
    return knex('description')
      .insert({ content, xxxx_id: xxxxId })
      .returning('id');
  }

  getDescription(id) {
    return knex
      .select('id', 'content')
      .from('description')
      .where('id', '=', id)
      .first();
  }

  deleteDescription(id) {
    return knex('description')
      .where('id', '=', id)
      .del();
  }

  editDescription({ id, content }) {
    return knex('description')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
