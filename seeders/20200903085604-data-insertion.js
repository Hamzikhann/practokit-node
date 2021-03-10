'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
    */
    await queryInterface.bulkInsert('roles', [
      {
        title: 'Admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'Content Editor',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        title: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    await queryInterface.bulkInsert('users', [{
      firstName: 'Admin',
      lastName: '',
      email: 'admin@quiz.pk',
      password: 'dell',
      roleId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      firstName: 'Content',
      lastName: 'Editor',
      email: 'editor@quiz.pk',
      password: 'dell',
      roleId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     */
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
