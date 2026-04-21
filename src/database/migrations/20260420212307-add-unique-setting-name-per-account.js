'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('settings', ['account_id', 'name'], {
      unique: true,
      name: 'settings_account_name_unique',
      deletedAt: null,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex(
      'settings',
      'settings_account_name_unique',
    );
  },
};
