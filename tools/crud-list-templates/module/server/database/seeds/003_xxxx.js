import { truncateTables } from '../../sql/helpers';

export async function seed(knex, Promise) {
  await truncateTables(knex, Promise, ['xxxx']);

  await Promise.all(
    [...Array(20).keys()].map(async ii => {
      const post = await knex('xxxx')
        .returning('id')
        .insert({
          title: `Xxxx title ${ii + 1}`,
          content: `Xxxx content ${ii + 1}`
        });
    })
  );
}
