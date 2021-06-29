'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'quizzes', // table name
        'title', // new field name
        {
          type: Sequelize.STRING,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('quizzes', 'title')
    ]);
  }
};
