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

  // START-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0
  // async getYyyysForXxxxIds(xxxxIds) {
  //   let res = await knex
  //     .select('id', 'title', 'content', 'xxxx_id AS xxxxId')
  //     .from('yyyy')
  //     .whereIn('xxxx_id', xxxxIds);

  //   return orderedFor(res, xxxxIds, 'xxxxId', false);
  // }
  // END-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0
  // TARGET-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0

  // START-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-0
  // async getYyyysForXxxxIds(xxxxIds) {
  //   let res = await knex
  //     .select('yyyy.id', 'yyyy.title', 'yyyy.content', 'xxxx_yyyy.xxxx_id AS xxxxId')
  //     .from('xxxx_yyyy')
  //     .whereIn('xxxx_yyyy.xxxx_id', xxxxIds)
  //     .innerJoin('yyyy', 'xxxx_yyyy.yyyy_id', 'yyyy.id')
  //   return orderedFor(res, xxxxIds, 'xxxxId', false);
  // }
  // END-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-0
  // TARGET-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-0

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

  // START-TEMPLATE-1-TO-MANY-LINKED-ENTITY-1
  // addYyyyToXxxx({ title, content, xxxxId }) {
  //   return knex('yyyy')
  //     .insert({ content, xxxx_id: xxxxId })
  //     .returning('id');
  // }

  // getYyyy(id) {
  //   return knex
  //     .select('id', 'title', 'content')
  //     .from('yyyy')
  //     .where('id', '=', id)
  //     .first();
  // }

  // deleteYyyyFromXxxx(id) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .del();
  // }

  // editYyyyInXxxx({ id, title, content }) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .update({
  //       content: content
  //     });
  // }
  // END-TEMPLATE-1-TO-MANY-LINKED-ENTITY-1
  // TARGET-TEMPLATE-1-TO-MANY-LINKED-ENTITY-1

  // START-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-1
  // addYyyyToXxxx({ title, content, xxxxId }) {
  //   return knex('yyyy')
  //     .insert({ content })
  //     .returning('id')
  //     .map(yyyyIds => {
  //       return knex('xxxx_yyyy')
  //           .returning('id')
  //           .insert({
  //             xxxx_id: xxxxId,
  //             yyyy_id: yyyyIds[0]
  //           })
  //     });
  // }

  // getYyyy(id) {
  //   return knex
  //     .select('id', 'title', 'content')
  //     .from('yyyy')
  //     .where('id', '=', id)
  //     .first();
  // }

  // deleteYyyyFromXxxx(id) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .del()
  //     .map(yyyyIds => {
  //       knex('xxxx_yyyy')
  //       .where('yyyy_id', '=', id)
  //       .del()
  //     })
  // }

  // editYyyyInXxxx({ id, title, content }) {
  //   return knex('yyyy')
  //     .where('id', '=', id)
  //     .update({
  //       content: content
  //     });
  // }
  // END-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-1
  // TARGET-TEMPLATE-MANY-TO-MANY-LINKED-ENTITY-1
}
