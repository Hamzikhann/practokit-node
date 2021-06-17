'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'createdBy', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'users', // table name
        'updatedBy', // new field name
        {
          type: Sequelize.STRING,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('users', 'createdBy'),
      queryInterface.removeColumn('users', 'updatedBy')
    ]);
  }
};
