import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['xxxx', 'description']);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const post = await knex('xxxx')
        .returning('id')
        .insert({
          title: `Xxxx title ${ii + 1}`,
          content: `Xxxx content ${ii + 1}`
        });

      await Promise.all(
        [...Array(2).keys()].map(async jj => {
          return knex('description')
            .returning('id')
            .insert({
              xxxx_id: xxxx[0],
              content: `Description title ${jj + 1} for xxxx ${xxxx[0]}`
            });
        })
      );
    })
  );
}
