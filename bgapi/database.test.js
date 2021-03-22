const db = require('./database');

beforeAll(async () => {
    await db.sequelize.sync();
});

test('create game', async () => {
    expect.assertions(1);
    const game = await db.Game.create({
        id: 1,
        firstName: 'Bobbie',
        lastName: 'Draper'
    });
    expect(game.id).toEqual(1);
});

test('get game', async () => {
    expect.assertions(2);
    const game = await db.Game.findByPk(1);
    expect(game.firstName).toEqual('Bobbie');
    expect(game.lastName).toEqual('Draper');
});

test('delete game', async () => {
    expect.assertions(1);
    await db.Game.destroy({
        where: {
            id: 1
        }
    });
    const game = await db.Game.findByPk(1);
    expect(game).toBeNull();
});

afterAll(async () => {
    await db.sequelize.close();
});