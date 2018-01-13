import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['xxxx', 'yyyy']);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const xxxx = await knex('xxxx')
        .returning('id')
        .insert({
          title: `Xxxx title ${ii + 1}`,
          content: `Xxxx content ${ii + 1}`
        });

      await Promise.all(
        [...Array(2).keys()].map(async jj => {
          return knex('yyyy')
            .returning('id')
            .insert({
              xxxx_id: xxxx[0],
              content: `Yyyy title ${jj + 1} for xxxx ${xxxx[0]}`
            });
        })
      );
    })
  );
}
