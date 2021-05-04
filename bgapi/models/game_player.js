'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class game_player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      game_player.belongsTo(models.game, { foreignKey: "game_id" });
      game_player.belongsTo(models.user, { foreignKey: "user_id" });
    }
  };
  game_player.init({
    game_id: DataTypes.UUID,
    user_id: DataTypes.UUID,
    sortorder: DataTypes.INTEGER,
    player_data: DataTypes.JSONB
  }, {
    sequelize,
    modelName: 'game_player',
  });
  return game_player;
};