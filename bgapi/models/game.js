'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      game.belongsTo(models.user, { foreignKey: "created_user" });
    
    }
  };
  game.init({
    id: DataTypes.UUID,
    key: DataTypes.STRING,
    created_user: DataTypes.UUID,
    started: DataTypes.BOOLEAN,
    finished: DataTypes.BOOLEAN,
    turn_count: DataTypes.INTEGER,
    turn_player: DataTypes.UUID,
    turn_started: DataTypes.DATE,
    game_data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'game',
  });
  return game;
};