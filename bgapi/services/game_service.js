const db = require('../database');
const data_tools = require('../common/data_tools');

class GameService {

    async addPlayerToGame(user_id, game_id) {
        try {
            let game = new Game()
            await game.loadGame(game_id);
            return await game.addPlayer(user_id)
        }
        catch (err) {
            throw err;
        }  
    }

    async movePlayerUp(user_id, game_id, player_id) {
        try {
            let game = new Game()
            await game.loadGame(game_id);
            await game.checkCreatedUser(user_id);
            await game.checkPlayerInGame(player_id);
            return await game.movePlayerUp(player_id);
        }
        catch (err) {
            throw err;
        }  
    }

    async movePlayerDown(user_id, game_id, player_id) {
        try {
            let game = new Game()
            await game.loadGame(game_id);
            await game.checkCreatedUser(user_id);
            await game.checkPlayerInGame(player_id);
            return await game.movePlayerDown(player_id);
        }
        catch (err) {
            throw err;
        }  
    }

    async removePlayer(user_id, game_id, player_id) {
        try {
            let game = new Game()
            await game.loadGame(game_id);
            await game.checkCreatedUser(user_id);
            await game.checkPlayerInGame(player_id);
            return await game.removePlayer(player_id);
        }
        catch (err) {
            throw err;
        }  
    }

    async createGame(user_id) {
        try {

            let newkey = data_tools.makeId(6);

            // check if key already exist
            let attempts = 3;
            for (let i=0; i<attempts; i++) {
                let game = await db.Game.findOne({where:{key: newkey}});
                if(!game || game === null)
                    break;
                else
                    if(i === attempts-1) 
                        throw new Error('Could not create unique game key');
            }

            let game = await db.Game.create({
                key: newkey,
                created_user: user_id
                });
 
            await db.GamePlayer.create({
                game_id: game.id,
                user_id: user_id,
                sortorder: 1
                });

            return {game_id:game.id,game_key:game.key};

        }
        catch (err) {
            throw err;  
        }
    }

    async deleteGame(game_id) {
        try {
            await db.Game.destroy({where: {id: game_id}});
        }
        catch (err) {
            throw err;  
        }
    }

    async getGame(game_id) {
        try {
            let game = new Game()
            await game.init(game_id);
            return game.getGameDetails();
        }
        catch (err) {
            throw err;
        }  
    }

    async getGameByKey(game_key) {
        try {
            let game = new Game()
            await game.loadGameByKey(game_key);
            await game.loadGamePlayers();
            return game.getGameDetails();
        }
        catch (err) {
            throw err;
        }  
    }

    async getGameList() {  
        try {
            let games = await db.Game.findAll();
            return games;
        } 
        catch (err) {
            throw err;
        }   
    }

    async startGame(user_id, game_id) {  
        try {
            let game = new Game()
            await game.loadGame(game_id);
            await game.checkCreatedUser(user_id);
            await game.startGame();
        } 
        catch (err) {
            throw err;
        }   
    }

    async endGameTurn(user_id, game_id) {
        try {
            let game = new Game()
            await game.loadGame(game_id);
            await game.checkUserIsTurn(user_id);
            return await game.endTurn();
        } 
        catch (err) {
            throw err;
        }   
    }

}

class Game {
    
    async init(game_id) {
        try {
            if(game_id) {
                await this.loadGame(game_id);
                await this.loadGamePlayers();
            }
        }
        catch (err) {
            throw err;
        }  
    }
    
    async checkUserIsTurn(user_id) {
        try {   
            if(user_id != this.game.turn_player) {
                let err = new Error('It is not your turn');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async checkPlayerInGame(user_id) {
        try {   
            let check_player = await db.GamePlayer.findOne({where:{game_id: this.game.id, user_id: user_id}});
            if(!check_player || check_player === null) {
                let err = new Error('Player is not in game');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async movePlayerUp(user_id) {
        try {   
            await this.checkGameNotStarted();
            await this.checkGameNotFinished();
            await this.loadGamePlayers();

            let max = Math.max.apply(Math, this.game_players.map(function(o) { return o.sortorder; }));

            let this_player = null;
            let this_order = 0;
            let new_order = 0;
            // find current sort order
            for(let i=0; i<this.game_players.length; i++) {
                if(this.game_players[i].user_id === user_id) {
                    this_order = this.game_players[i].sortorder;
                    this_player = this.game_players[i];
                }
            }
            if(this_order === max)
                new_order = 0;
            else
                new_order = this_order + 1;

            let switch_player = null;
            // find player to switch with
            for(let i=0; i<this.game_players.length; i++) {
                if(this.game_players[i].sortorder === new_order) {
                    switch_player = this.game_players[i];
                }
            }
            if(switch_player != null)
                await switch_player.update({sortorder: this_order});

            await this_player.update({sortorder: new_order});
            
            return this.getGameDetails();

        }
        catch (err) {
            throw err;
        }  
    }

    async movePlayerDown(user_id) {
        try {   
            await this.checkGameNotStarted();
            await this.checkGameNotFinished();
            await this.loadGamePlayers();

            let max = Math.max.apply(Math, this.game_players.map(function(o) { return o.sortorder; }));

            let this_player = null;
            let this_order = 0;
            let new_order = 0;
            // find current sort order
            for(let i=0; i<this.game_players.length; i++) {
                if(this.game_players[i].user_id === user_id) {
                    this_order = this.game_players[i].sortorder;
                    this_player = this.game_players[i];
                }
            }
            if(this_order === 0)
                new_order = max;
            else
                new_order = this_order - 1;

            let switch_player = null;
            // find player to switch with
            for(let i=0; i<this.game_players.length; i++) {
                if(this.game_players[i].sortorder === new_order) {
                    switch_player = this.game_players[i];
                }
            }
            if(switch_player != null)
                await switch_player.update({sortorder: this_order});

            await this_player.update({sortorder: new_order});
            
            return this.getGameDetails();

        }
        catch (err) {
            throw err;
        }  
    }

    async removePlayer(user_id) {
        try {   
            await this.checkGameNotStarted();
            await this.checkGameNotFinished();
            await db.GamePlayer.destroy({where:{game_id: this.game.id, user_id: user_id}});
            await this.loadGamePlayers();
            return this.getGameDetails();
        }
        catch (err) {
            throw err;
        }  
    }

    async checkCreatedUser(user_id) {
        try {   
            if(this.game.created_user != user_id) {
                let err = new Error('Operation can only be executed by the creator');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async checkGameNotStarted() {
        try {   
            if(this.game.started) {
                let err = new Error('Game is already started');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async checkGameStarted() {
        try {   
            if(!this.game.started) {
                let err = new Error('Game is not started');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async checkGameNotFinished() {
        try {   
            if(this.game.finished) {
                let err = new Error('Game is finished');
                err.status = 400;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async startGame() {
        try {
            await this.checkGameNotStarted();
            await this.checkGameNotFinished();

            // find player to start first turn
            await this.loadGamePlayers();
            let first = null;
            let min_order = 0;
            for(let i=0; i<this.game_players.length; i++) {
                if(this.game_players[i].sortorder < min_order || min_order == 0) {
                    min_order = this.game_players[i].sortorder;
                    first = this.game_players[i];
                }
            }
            if(min_order == 0) {
                let err = new Error('Could not find player to start game');
                err.status = 400;
                throw err;
            }
    
            // update game, set started
            await this.game.update({started: true, turn_player: first.user_id, turn_count: 1, turn_started: db.sequelize.fn('NOW')});
            
        }
        catch (err) {
            throw err;
        }  
    }

    async endTurn() {
        try {
            await this.checkGameStarted();
            await this.checkGameNotFinished();

            await this.loadGamePlayers();

            let max = Math.max.apply(Math, this.game_players.map(function(o) { return o.sortorder; }));

            let sorted_list = this.game_players.sort((a, b) => (a.sortorder) - (b.sortorder));
            // find order for this player
            let this_player = -1;
            for(let i=0; i<sorted_list.length; i++) {
                if(sorted_list[i].user_id == this.game.turn_player) {
                    this_player = i;
                    break;
                }
            }
            if(!this_player < 0) {
                let err = new Error('Could not find current turn player');
                err.status = 400;
                throw err;
            }

            let next_player;
            if(this_player < sorted_list.length - 1)
                next_player = sorted_list[this_player+1];
            else
                next_player = sorted_list[0];
    
            // update game, set next turn
            await this.game.update({turn_player: next_player.user_id, turn_count: this.game.turn_count+1, turn_started: db.sequelize.fn('NOW')});
            return {turn_count: this.game.turn_count+1, turn_player: next_player.user_id};
        }
        catch (err) {
            throw err;
        }  
    }

    async addPlayer(user_id) {
        try {
            if(this.game.started) {
                let err = new Error('Cannot add player to started game');
                err.status = 400;
                throw err;
            }

            let check_player = await db.GamePlayer.findAll({where:{game_id: this.game.id, user_id: user_id}});
            if(check_player.length > 0) {
                let err = new Error('Player already exist in game');
                err.status = 400;
                throw err;
            }
                
            await this.loadGamePlayers();
            let max = 1;
            if(this.game_players && this.game_players.length > 0)
                max = Math.max.apply(Math, this.game_players.map(function(o) { return o.sortorder; })) + 1;
                        
            let game_player = await db.GamePlayer.create({
                game_id: this.game.id,
                user_id: user_id,
                sortorder: max
                });
            return {sortorder: game_player.sortorder};
        }
        catch (err) {
            throw err;
        }  
    }

    async getGameDetails() {
        try {
            let ret = {
                id: this.game.id,
                game_key: this.game.key,
                created_user: this.game.created_user,
                started: this.game.started,
                finished: this.game.finished,
                turn_count: this.game.turn_count,
                turn_player: this.game.turn_player,
                turn_started: this.game.turn_started,
                players: []
            };

            for(let i=0; i<this.game_players.length; i++) {
                ret.players.push({user_id: this.game_players[i].user_id, sortorder: this.game_players[i].sortorder})
            }
            return ret;
        }
        catch (err) {
            throw err;
        }  

    }

    async loadGame(game_id) {
        try {
            this.game = await db.Game.findByPk(game_id);
            if(!this.game || this.game === null) {
                let err = new Error('Game not found.');
                err.status = 404;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }
    
    async loadGameByKey(game_key) {
        try {
            this.game = await db.Game.findOne({where:{key: game_key}});
            if(!this.game || this.game === null) {
                let err = new Error('Game not found.');
                err.status = 404;
                throw err;
            }
        }
        catch (err) {
            throw err;
        }  
    }

    async loadGamePlayers() {
        try {
            this.game_players = await db.GamePlayer.findAll({where:{game_id: this.game.id}});
        }
        catch (err) {
            throw err;
        }  
    }

}

module.exports = GameService;