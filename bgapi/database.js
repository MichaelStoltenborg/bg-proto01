// database.js
const Sequelize = require('sequelize');
const { configure } = require('sequelize-pg-utilities')
const config = require('./config/config.json')


const { name, user, password, options } = configure(config);
const sequelize = new Sequelize(name, user, password, options)
/*const sequelize = new Sequelize(process.env.DB_SCHEMA || 'games',
                                process.env.DB_USER || 'postgres',
                                process.env.DB_PASSWORD || 'dbtest',
                                {
                                    host: process.env.DB_HOST || 'localhost',
                                    port: process.env.DB_PORT || 5433,
                                    dialect: 'postgres',
                                    dialectOptions: {
                                        ssl: process.env.DB_SSL == "true"
                                    }
                                });*/
const Game = sequelize.define('game', {
    key: {
        type: Sequelize.STRING,
        allowNull: false
    },
    created_user: {
        type: Sequelize.UUID,
        allowNull: true
    },
    started: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    finished: {
        type: Sequelize.BOOLEAN,
        allowNull: true
    },
    turn_count: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
    turn_player: {
        type: Sequelize.UUID,
        allowNull: true
    },
    turn_started: {
        type: Sequelize.DATE,
        allowNull: true
    },
});

const User = sequelize.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
});

const GamePlayer = sequelize.define('game_player', {
    game_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true
    },
    sortorder: {
        type: Sequelize.INTEGER,
        allowNull: true
    },
});

module.exports = {
    sequelize: sequelize,
    Game: Game,
    User: User,
    GamePlayer: GamePlayer
};