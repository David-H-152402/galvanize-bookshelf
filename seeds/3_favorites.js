//
// exports.seed = function(knex, Promise) {
//   // Deletes ALL existing entries
//   return knex('favorites').del()
//     .then(function () {
//       return Promise.all([
//         // Inserts seed entries
//         knex('favorites').insert({id: 1, colName: 'rowValue1'}),
//         knex('favorites').insert({id: 2, colName: 'rowValue2'}),
//         knex('favorites').insert({id: 3, colName: 'rowValue3'})
//       ]);
//     });
// };
'use strict';

exports.seed = function(knex) {
  return knex('favorites').del()
    .then(() => {
      return knex('favorites').insert([{
        id: 1,
        book_id: 1,
        user_id: 1,
        created_at: new Date('2016-06-29 14:26:16 UTC'),
        updated_at: new Date('2016-06-29 14:26:16 UTC')
      }]);
    })
    .then(() => {
      return knex.raw(
        "SELECT setval('favorites_id_seq', (SELECT MAX(id) FROM favorites));"
      );
    });
};
