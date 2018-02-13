exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('xxxx', table => {
      table.increments();
      table.string('title');
      table.string('content');
      table.timestamps(false, true);
      // START-TEMPLATE-0
      // table
      //   .integer('xxxx_id')
      //   .nullable()
      //   .unsigned()
      //   .references('id')
      //   .inTable('xxxx')
      // //  .onDelete('CASCADE'); // uncomment for when yyyy completely depends on xxxx's existence
      // END-TEMPLATE-0
      // TARGET-TEMPLATE-0
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // START-TEMPLATE-1
    // // knex.schema.dropTable('yyyy'), // uncomment for when yyyy completely depends on xxxx's existence
    // END-TEMPLATE-1
    // TARGET-TEMPLATE-1
    knex.schema.dropTable('xxxx')
  ]);
};
