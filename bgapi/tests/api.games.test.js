

const supertest = require('supertest');
const app = require('../app');

describe("Testing the games endpoint", () => {

    let creator_id;
    let game_id;
    let game_key;
    let user1, user2, user3;
    it('Create a new game', async (done) => {
        // create user
        let res = await supertest(app)
            .post('/users')
            .send({name: 'game creator'});
            
        creator_id = res.body.user_id;
        
        res = await supertest(app)
            .post('/games/?user_id=' + creator_id);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('game_id');
        expect(res.body).toHaveProperty('game_key');
        game_id = res.body.game_id;
        game_key = res.body.game_key;
        done();
    }),

    it('Add 3 players', async (done) => {
        // create users
        let res = await supertest(app)
            .post('/users')
            .send({name: 'game participant 1'});          
        user1 = res.body.user_id;
        res = await supertest(app)
            .post('/users')
            .send({name: 'game participant 2'});          
        user2 = res.body.user_id;
        res = await supertest(app)
            .post('/users')
            .send({name: 'game participant 3'});          
        user3 = res.body.user_id;

        res = await supertest(app)
            .put('/games/' + game_id + '/players/add/?user_id=' + user1);
        expect(res.statusCode).toEqual(200);
        res = await supertest(app)
            .put('/games/' + game_id + '/players/add/?user_id=' + user2);
        expect(res.statusCode).toEqual(200);
        res = await supertest(app)
            .put('/games/' + game_id + '/players/add/?user_id=' + user3);
        expect(res.statusCode).toEqual(200);
        res = await supertest(app)
            .put('/games/' + game_id + '/players/add/?user_id=' + user1);
        expect(res.statusCode).toEqual(400);

        done();
    }),

    it('Remove 1 player', async (done) => {
        let res = await supertest(app)
            .put('/games/' + game_id + '/players/remove/' + user2 + '/?user_id=' + user2);
        expect(res.statusCode).toEqual(400);

        res = await supertest(app)
          .put('/games/' + game_id + '/players/remove/' + user2 + '/?user_id=' + creator_id);
        expect(res.statusCode).toEqual(200);

        done();
    }),

    it('Delete 1 user who is part of game', async (done) => {
        let res = await supertest(app)
            .delete('/users/' + user3);
        expect(res.statusCode).toEqual(200);

        done();
    }),

    it('Get game by key', async (done) => {

		const res = await supertest(app).get('/games/?key=' + game_key);

		expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('started');
        expect(res.body).toHaveProperty('players');
        expect(res.body.players.length).toBe(2);
        expect(res.body.id).toBe(game_id);
        done();
    }),

    it('Start game', async (done) => {
        let res = await supertest(app)
            .put('/games/' + game_id + '/start/?user_id=' + user1);
        expect(res.statusCode).toEqual(400);

        res = await supertest(app)
          .put('/games/' + game_id + '/start/?user_id=' + creator_id);
        expect(res.statusCode).toEqual(200);

        done();
    }),

    it('End turn in game', async (done) => {
        let res = await supertest(app)
            .put('/games/' + game_id + '/endturn/?user_id=' + user1);
        expect(res.statusCode).toEqual(400);

        res = await supertest(app)
          .put('/games/' + game_id + '/endturn/?user_id=' + creator_id);
        expect(res.statusCode).toEqual(200);

        res = await supertest(app)
            .get('/games/' + game_id);
            
        expect(res.statusCode).toEqual(200);
        expect(res.body.turn_player).toBe(user1);

        done();
    }),

    it('Cleanup game', async (done) => {
        let res = await supertest(app)
            .delete('/games/' + game_id);   
        expect(res.statusCode).toEqual(200);

        res = await supertest(app)
            .delete('/users/' + creator_id);
        expect(res.statusCode).toEqual(200);

        res = await supertest(app)
            .delete('/users/' + user1);
        expect(res.statusCode).toEqual(200);

        res = await supertest(app)
            .delete('/users/' + user2);
        expect(res.statusCode).toEqual(200);

        done();


    })

});

afterAll(async (done) => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    done();
});