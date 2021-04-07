'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     return Promise.all([
      queryInterface.addColumn(
        'questionsOptions', // table name
        'fileName', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'questionsAttributes', // table name
        'statementFileName', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'questionsAttributes', // table name
        'hintFileName', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'questionsAttributes', // table name
        'solutionFileName', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
     return Promise.all([
      queryInterface.removeColumn('questionsOptions', 'fileName'),
      queryInterface.removeColumn('questionsAttributes', 'statementFileName'),
      queryInterface.removeColumn('questionsAttributes', 'hintFileName'),
      queryInterface.removeColumn('questionsAttributes', 'solutionFileName'),
    ]);
  }
};
