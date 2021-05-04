'use strict';
const db = require('../database');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('game_players', {
      game_id: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      user_id: {
        primaryKey: true,
        type: Sequelize.UUID
      },
      sortorder: {
        type: Sequelize.INTEGER
      },
      player_data: {
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
      'game_players',
      {
        fields: ['game_id'],
        type: 'foreign key',
        name: 'game_id_fk',
        references: {
          table: 'games',
          field: 'id'
        },
        onDelete: 'cascade',
      })).then(() => queryInterface.addConstraint(
        'game_players',
        {
          fields: ['user_id'],
          type: 'foreign key',
          name: 'user_id_fk',
          references: {
            table: 'users',
            field: 'id'
          },
          onDelete: 'cascade',
        }));
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('game_players');
  }
};