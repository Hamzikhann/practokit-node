'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        'quizsubmissions', // table name
        'totalMarks', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizsubmissions', // table name
        'attempted', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizsubmissions', // table name
        'totalQuestions', // new field name
        {
          type: Sequelize.INTEGER,
        },
      ),
      queryInterface.addColumn(
        'quizsubmissions', // table name
        'timeSpend', // new field name
        {
          type: Sequelize.INTEGER,
        },
      )
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('quizsubmissions', 'totalMarks'),
      queryInterface.removeColumn('quizsubmissions', 'attempted'),
      queryInterface.removeColumn('quizsubmissions', 'totalQuestions'),
      queryInterface.removeColumn('quizsubmissions', 'timeSpend'),
    ]);
  }
};
