'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'quizSubmissions', // table name
        'totalMarks', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizSubmissions', // table name
        'attempted', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizSubmissions', // table name
        'totalQuestions', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizSubmissions', // table name
        'timeSpend', // new field name
        {
          type: Sequelize.INTEGER,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('quizSubmissions', 'totalMarks'),
      queryInterface.removeColumn('quizSubmissions', 'attempted'),
      queryInterface.removeColumn('quizSubmissions', 'totalQuestions'),
      queryInterface.removeColumn('quizSubmissions', 'timeSpend'),
    ]);
  }
};
