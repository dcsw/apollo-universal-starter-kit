import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, [
    'xxxx',
    // START-TEMPLATE-0
    // // 'yyyy',
    // END-TEMPLATE-0
    // TARGET-TEMPLATE-0
  ]);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const xxxx = await knex('xxxx')
        .returning('id')
        .insert({
          title: `Xxxx title ${ii + 1}`,
          content: `Xxxx content ${ii + 1}`
        });

      // START-SOURCE-ENTITY-TEMPLATE-1
      // await Promise.all(
      //   [...Array(2).keys()].map(async jj => {
      //     return knex('yyyy')
      //       .returning('id')
      //       .insert({
      //         xxxx_id: xxxx[0],
      //         title: `Yyyy title ${jj + 1} for xxxx ${xxxx[0]}`,
      //         content: `Yyyy content ${jj + 1} for xxxx ${xxxx[0]}`
      //       });
      //   })
      // );
      // END-SOURCE-ENTITY-TEMPLATE-1
      // TARGET-SOURCE-ENTITY-TEMPLATE-1
    })
  );
}
