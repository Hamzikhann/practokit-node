'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'quizzes', // table name
        'questionsPool', // new field name
        {
          type: Sequelize.TEXT,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('quizzes', 'questionsPool'),
    ]);
  }
};
