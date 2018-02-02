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

  async getYyyysForXxxxIds(xxxxIds) {
    let res = await knex
      .select('id', 'content', 'xxxx_id AS xxxxId')
      .from('yyyy')
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

  addYyyyToXxxx({ content, xxxxId }) {
    return knex('yyyy')
      .insert({ content, xxxx_id: xxxxId })
      .returning('id');
  }

  getYyyy(id) {
    return knex
      .select('id', 'content')
      .from('yyyy')
      .where('id', '=', id)
      .first();
  }

  deleteYyyyFromXxxx(id) {
    return knex('yyyy')
      .where('id', '=', id)
      .del();
  }

  editYyyyInXxxx({ id, content }) {
    return knex('yyyy')
      .where('id', '=', id)
      .update({
        content: content
      });
  }
}
