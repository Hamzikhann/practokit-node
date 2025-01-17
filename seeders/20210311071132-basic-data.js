'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   title: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('classes', [{
      title: 'A Levels',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'O Levels',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('courses', [{
      title: 'Mathematics D1',
      classId: 1,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Mathematics D2',
      classId: 1,
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('questionDifficulties', [{
      title: 'Very Easy',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Easy',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Medium',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      title: 'Hard',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      title: 'Very Hard',
      createdBy: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('questionTypes', [{
      title: 'MCQ',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      title: 'True/False',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      title: 'Fill in the Blank',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('tags', [{
      title: 'D1 Algorithms',
      courseId: 1,
      createdBy: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'D1 Linear Programming',
      courseId: 1,
      createdBy: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'D1 Sorting',
      courseId: 1,
      createdBy: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('classes', null, {});
     await queryInterface.bulkDelete('courses', null, {});
     await queryInterface.bulkDelete('questiondifficulties', null, {});
     await queryInterface.bulkDelete('questiontypes', null, {});
     await queryInterface.bulkDelete('tags', null, {});
  }
};
