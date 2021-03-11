'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('classes', [{
      name: 'A Levels',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'O Levels',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('courses', [{
      name: 'Mathematics D1',
      classId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Mathematics D2',
      classId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('questionDifficulties', [{
      name: 'Very Easy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Easy',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Medium',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Hard',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Very Hard',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('questionTypes', [{
      name: 'MCQ',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
    await queryInterface.bulkInsert('tags', [{
      tag: 'D1 Algorithms',
      courseId: 1,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      tag: 'D1 Linear Programming',
      courseId: 1,
      userId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      tag: 'D1 Sorting',
      courseId: 1,
      userId: 2,
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
