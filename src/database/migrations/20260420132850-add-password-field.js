'use strict';

const crypto = require('crypto');
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('accounts', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: crypto.randomBytes(16).toString('base64'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('accounts', 'password');
  },
};
