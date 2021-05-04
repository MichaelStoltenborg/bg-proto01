

const supertest = require('supertest');
const app = require('../app');

describe("Testing the users endpoint", () => {

    let user_id;
    it('Create a new user', async (done) => {
        const res = await supertest(app)
            .post('/users')
            .send({name: 'autotest'});
            
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('user_id');
        user_id = res.body.user_id;
        done();
    }),

    it('Get specific user', async (done) => {

		const res = await supertest(app).get('/users/' + user_id);

		expect(res.status).toBe(200);
        expect(res.body.name).toBe('autotest');
        done();
    }),

	it('Get list of one user', async (done) => {

		const res = await supertest(app).get('/users/all');

		expect(res.status).toBe(200);
        expect(res.body.length).toBe(1);
        done();
    }),

    it('Delete user', async (done) => {
        const res = await supertest(app)
            .delete('/users/' + user_id);
            
        expect(res.statusCode).toEqual(200);
        done();
    }),

    it('Get empty list of users', async (done) => {

		const res = await supertest(app).get('/users/all');

		expect(res.status).toBe(200);
        expect(res.body.length).toBe(0);
        done();
    })

});

afterAll(async (done) => {
    await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
    done();
});