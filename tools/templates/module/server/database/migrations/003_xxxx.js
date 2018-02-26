exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('xxxx', table => {
      table.increments();
      table.string('title');
      table.string('content');
      table.timestamps(false, true);
      // START-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0
      // table
      //   .integer('xxxx_id')
      //   .nullable()
      //   .unsigned()
      //   .references('id')
      //   .inTable('xxxx')
      // //  .onDelete('CASCADE'); // uncomment for when yyyy completely depends on xxxx's existence
      // END-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0
      // TARGET-TEMPLATE-1-TO-MANY-LINKED-ENTITY-0
    }),
    // START-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
    // knex.schema.createTable('xxxx_yyyy', table => {
    //   table.increments();
    //   table
    //     .integer('xxxx_id')
    //     // .nullable()
    //     .unsigned()
    //     .references('id')
    //     .inTable('xxxx');
    //   //  .onDelete('CASCADE') // uncomment for when yyyy completely depends on xxxx's existence
    //   table
    //     .integer('yyyy_id')
    //     // .nullable()
    //     .unsigned()
    //     .references('id')
    //     .inTable('yyyy');
    //   //  .onDelete('CASCADE') // uncomment for when yyyy completely depends on xxxx's existence
    // })
    // END-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
    // TARGET-SEED-MANY-TO-MANY-LINKED-ENTITY-TEMPLATE-1
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    // START-TEMPLATE-LINKED-ENTITY-1
    // // knex.schema.dropTable('yyyy'), // uncomment for when yyyy completely depends on xxxx's existence
    // END-TEMPLATE-LINKED-ENTITY-1
    // TARGET-TEMPLATE-LINKED-ENTITY-1
    knex.schema.dropTable('xxxx')
  ]);
};
