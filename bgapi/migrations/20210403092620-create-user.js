'use strict';
const db = require('../database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        //autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: db.sequelize.fn('uuid_generate_v4')
      },
      name: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })/*.then(() => queryInterface.addConstraint(
      'users',
      {
        fields: ['id'],
        type: 'foreign key',
        name: 'created_user_fk',
        references: {
          table: 'games',
          field: 'created_user'
        },
        onDelete: 'cascade',
      }))*/;
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};