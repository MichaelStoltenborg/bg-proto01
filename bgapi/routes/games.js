const express = require('express');
const router = express.Router();
const GameService = require('../services/game_service');

const gs = new GameService();

// Get list of all games
router.get("/all", async function(req, res, next) {
    try {
        let result = await gs.getGameList();
        res.status(200).send(result);
    }
    catch(err) {
        return next(err);
    }
});

// Get details of a specific game
router.get("/:id", async function(req, res, next) {
    try {
        let game = await gs.getGame(req.params.id);
        res.status(200).send(game);
    }
    catch(err) {
        return next(err);
    }
});

// Get details of specific game by key 
router.get("/", async function(req, res, next) {
    try {
        let game = await gs.getGameByKey(req.query.key);
        res.status(200).send(game);
    }    
    catch(err) {
        return next( err);
    }
});
    
// Add player to game
router.put("/:id/players/add", async function(req, res, next) {
    const user_id = req.query.user_id;
    const game_id = req.params.id;

    try {
        if(!user_id) {
            let err = new Error('User id is missing');
            err.status = 400;
            throw err;
        }

        let result = await gs.addPlayerToGame(user_id, game_id);
        res.status(200).send(result);

    }    
    catch(err) {
        return next(err);
    }
});

// Update game: Start game
router.put("/:id/start", async function(req, res, next) {
    const user_id = req.query.user_id;
    const game_id = req.params.id;

    try {
        if(!user_id) {
            let err = new Error('User_id is missing');
            err.status = 400;
            throw err;
        }

        await gs.startGame(user_id, game_id);
        res.status(200).send();

    }    
    catch(err) {
        return next(err);
    }
});

// Update game: Start game
router.put("/:id/endturn", async function(req, res, next) {
    const user_id = req.query.user_id;
    const game_id = req.params.id;

    try {
        if(!user_id) {
            let err = new Error('User_id is missing');
            err.status = 400;
            throw err;
        }

        let ret = await gs.endGameTurn(user_id, game_id);
        res.status(200).send(ret);

    }    
    catch(err) {
        return next(err);
    }
});

// Update game players: Move up or down or remove
router.put("/:id/players/:command/:player", async function(req, res, next) {
    const user_id = req.query.user_id;
    const game_id = req.params.id;
    const player_id = req.params.player;
    const command = req.params.command;

    try {
        if(!user_id) {
            let err = new Error('User id is missing');
            err.status = 400;
            throw err;
        }

        let result = null;
        if(command == 'moveup')
            result = await gs.movePlayerUp(user_id, game_id, player_id);
        else if (command == 'movedown')
            result = await gs.movePlayerDown(user_id, game_id, player_id);
        else if (command == 'remove')
            result = await gs.removePlayer(user_id, game_id, player_id);

        res.status(200).send(result);
    }    
    catch(err) {
        return next(err);
    }
});




// Create new game
router.post("/", async function(req, res, next) {
    const user_id = req.query.user_id;

    try {
        if(!user_id) {
            let err = new Error('User_id is missing');
            err.status = 400;
            throw err;
        }
        
        let game = await gs.createGame(user_id);
        res.status(200).send(game);

    }    
    catch(err) {
        return next(err);
    }    
});

// Delete game
router.delete("/:id", async function(req, res, next) {
    try {
        await gs.deleteGame(req.params.id, undefined);
        res.status(200).send();
    }
    catch(err) {
        return next(err);
    }
});

router.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
      status: error.status,
      message: error.message,
      stack: error.stack
    })
  });

module.exports = router;