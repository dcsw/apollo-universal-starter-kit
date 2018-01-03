exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('xxxx', table => {
        table.increments();
        table.string('title');
        table.string('content');
        table.timestamps(false, true);
      })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([knex.schema.dropTable('xxxx')]);
};
