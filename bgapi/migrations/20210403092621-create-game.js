'use strict';
const db = require('../database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
    await queryInterface.createTable('games', {
      id: {
        allowNull: false,
        //autoIncrement: true,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: db.sequelize.fn('uuid_generate_v4')
      },
      key: {
        allowNull: false,
        type: Sequelize.STRING
      },
      created_user: {
        allowNull: false,
        type: Sequelize.UUID
      },
      started: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      finished: {
        allowNull: false,
        defaultValue: false,
        type: Sequelize.BOOLEAN
      },
      turn_count: {
        allowNull: false,
        defaultValue: 0,
        type: Sequelize.INTEGER
      },
      turn_player: {
        type: Sequelize.UUID
      },
      turn_started: {
        type: Sequelize.DATE
      },
      game_data: {
        type: Sequelize.JSONB
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    }).then(() => queryInterface.addConstraint(
      'games',
      {
        fields: ['created_user'],
        type: 'foreign key',
        name: 'created_user_fk',
        references: {
          table: 'users',
          field: 'id'
        },
        onDelete: 'cascade',
      }));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('games');
  }
};