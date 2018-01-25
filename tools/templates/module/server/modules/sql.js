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

  // START-LINKED-MODULE-TEMPLATE-0
  // async getYyyysForXxxxIds(xxxxIds) {
  //   let res = await knex
  //     .select('id', 'content', 'xxxx_id AS xxxxId')
  //     .from('yyyy')
  //     .whereIn('xxxx_id', xxxxIds);

  //   return orderedFor(res, xxxxIds, 'xxxxId', false);
  // }
  // END-LINKED-MODULE-TEMPLATE-0
  // TARGET-LINKED-MODULE-TEMPLATE-0

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

  // START-LINKED-MODULE-TEMPLATE-1
  // addYyyy({ content, xxxxId }) {
  //   return knex('yyyy')
  //     .insert({ content, xxxx_id: xxxxId })
  //     .returning('id');
  // }

  // getYyyy(id) {
  //   return knex
  //     .select('id', 'content')
  //     .from('yyyy')
  //     .where('id', '=', id)
  //     .first();
  // }

  // deleteYyyy(id) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .del();
  // }

  // editYyyy({ id, content }) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .update({
  //       content: content
  //     });
  // }
  // END-LINKED-MODULE-TEMPLATE-1
  // TARGET-LINKED-MODULE-TEMPLATE-1
}