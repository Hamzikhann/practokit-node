'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'classes', // table name
        'updatedBy', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'courses', // table name
        'updatedBy', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'questions', // table name
        'updatedBy', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'tags', // table name
        'updatedBy', // new field name
        {
          type: Sequelize.STRING,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('classes', 'updatedBy'),
      queryInterface.removeColumn('courses', 'updatedBy'),
      queryInterface.removeColumn('questions', 'updatedBy'),
      queryInterface.removeColumn('tags', 'updatedBy'),
    ]);
  }
};
