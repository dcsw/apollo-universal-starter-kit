import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  // await truncateTables(knex, Promise, [
  //   'xxxx'
  //   // START-TEMPLATE-LINKED-ENTITY-0
  //   // // 'yyyy',
  //   // END-TEMPLATE-LINKED-ENTITY-0
  //   // TARGET-TEMPLATE-LINKED-ENTITY-0
  // ]);

  // START-SEED-TEMPLATE-1
  // await Promise.all(
  //   [...Array(SEED_COUNT).keys()].map(async ii => {
  //     const xxxx = await knex('xxxx')
  //       .returning('id')
  //       .insert({
  //         title: `Xxxx title ${ii + 1}`,
  //         content: `Xxxx content ${ii + 1}`
  //       });

  //     // START-SEED-1-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //     // await Promise.all(
  //     //   [...Array(LINKED_SEED_COUNT).keys()].map(async jj => {
  //     //     return knex('yyyy')
  //     //       .returning('id')
  //     //       .insert({
  //     //         xxxx_id: xxxx[0],
  //     //         title: `Yyyy title ${jj + 1} for xxxx ${xxxx[0]}`,
  //     //         content: `Yyyy content ${jj + 1} for xxxx ${xxxx[0]}`
  //     //       });
  //     //   })
  //     // );
  //     // END-SEED-1-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //     // TARGET-SEED-1-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //     // START-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //     // await Promise.all(
  //     //   [...Array(LINKED_SEED_COUNT).keys()].map(async jj => {
  //     //     return await knex('yyyy')
  //     //       .returning('id')
  //     //       .insert({
  //     //         title: `Yyyy title ${jj + 1} for xxxx ${xxxx[0]}`,
  //     //         content: `Yyyy content ${jj + 1} for xxxx ${xxxx[0]}`
  //     //       })
  //     //       .then(yyyyIds => {
  //     //         return knex('xxxx_yyyy')
  //     //         .returning('xxxx_yyyy.yyyy_id')
  //     //         .insert({
  //     //           xxxx_id: xxxx[0],
  //     //           yyyy_id: yyyyIds[0]
  //     //         })
  //     //       })
  //     //   })
  //     // );
  //     // END-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //     // TARGET-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  //   })
  // );
  // END-SEED-TEMPLATE-1
  // TARGET-SEED-TEMPLATE-1
}
