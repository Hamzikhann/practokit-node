'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('quizzes', 'questionTypeId')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    
  }
};
