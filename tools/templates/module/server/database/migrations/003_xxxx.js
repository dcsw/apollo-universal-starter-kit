exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('xxxx', table => {
      table.increments();
      table.string('title');
      table.string('content');
      table.timestamps(false, true);
    })
    // START-LINKED-MODULE-TEMPLATE-0
    // .createTableIfNotExists('yyyy', table => {
    //   table.increments();
    //   table
    //     .integer('xxxx_id')
    //     .unsigned()
    //     .references('id')
    //     .inTable('xxxx')
    //     .onDelete('CASCADE');
    //   table.string('content');
    //   table.timestamps(false, true);
    // })
    // END-LINKED-MODULE-TEMPLATE-0
    // TARGET-LINKED-MODULE-TEMPLATE-0
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // START-LINKED-MODULE-TEMPLATE-1
    // knex.schema.dropTable('yyyy'),
    // END-LINKED-MODULE-TEMPLATE-1
    // TARGET-LINKED-MODULE-TEMPLATE-1
    knex.schema.dropTable('xxxx')
  ]);
};
