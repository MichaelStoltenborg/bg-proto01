const db = require('../database');

beforeAll(async () => {
    await db.sequelize.sync();
});

test('create users', async () => {
    expect.assertions(4);
    const user1 = await db.User.create({
        id: '00000000-0000-0000-0001-000000000001',
        name: 'user1'
    });
    const user2 = await db.User.create({
        id: '00000000-0000-0000-0001-000000000002',
        name: 'user2'
    });
    const user3 = await db.User.create({
        id: '00000000-0000-0000-0001-000000000003',
        name: 'user3'
    });
    const user4 = await db.User.create({
        id: '00000000-0000-0000-0001-000000000004',
        name: 'user4'
    });
    expect(user1.id).toEqual('00000000-0000-0000-0001-000000000001');
    expect(user2.id).toEqual('00000000-0000-0000-0001-000000000002');
    expect(user3.id).toEqual('00000000-0000-0000-0001-000000000003');
    expect(user4.id).toEqual('00000000-0000-0000-0001-000000000004');
});

test('get user', async () => {
    expect.assertions(2);
    const user = await db.User.findByPk('00000000-0000-0000-0001-000000000001');
    expect(user.id).toEqual('00000000-0000-0000-0001-000000000001');
    expect(user.name).toEqual('user1');
});

test('create game', async () => {
    expect.assertions(1);
    const game = await db.Game.create({
        id: '00000000-0000-0000-0002-000000000001',
        key: '000001',
        created_user: '00000000-0000-0000-0001-000000000001'
    });
    expect(game.id).toEqual('00000000-0000-0000-0002-000000000001');
});

test('get game', async () => {
    expect.assertions(2);
    const game = await db.Game.findByPk('00000000-0000-0000-0002-000000000001');
    expect(game.id).toEqual('00000000-0000-0000-0002-000000000001');
    expect(game.key).toEqual('000001');
});

test('create game players', async () => {
    expect.assertions(2);
    const game_player1 = await db.GamePlayer.create({
        game_id: '00000000-0000-0000-0002-000000000001',
        user_id: '00000000-0000-0000-0001-000000000001',
        sortorder: 1
    });
    const game_player2 = await db.GamePlayer.create({
        game_id: '00000000-0000-0000-0002-000000000001',
        user_id: '00000000-0000-0000-0001-000000000002',
        sortorder: 2
    });
    expect(game_player1.sortorder).toEqual(1);
    expect(game_player2.sortorder).toEqual(2);
});

test('delete game players', async () => {
    expect.assertions(2);
    await db.GamePlayer.destroy({
        where: {
            game_id: '00000000-0000-0000-0002-000000000001'
        }
    });
    const game_player1 = await db.GamePlayer.findOne({where:{game_id:'00000000-0000-0000-0002-000000000001',user_id:'00000000-0000-0000-0001-000000000001'}});
    const game_player2 = await db.GamePlayer.findOne({where:{game_id:'00000000-0000-0000-0002-000000000001',user_id:'00000000-0000-0000-0001-000000000002'}});
    expect(game_player1).toBeNull();
    expect(game_player2).toBeNull();
});

test('delete game', async () => {
    expect.assertions(1);
    await db.Game.destroy({
        where: {
            id: '00000000-0000-0000-0002-000000000001'
        }
    });
    const game = await db.Game.findByPk('00000000-0000-0000-0002-000000000001');
    expect(game).toBeNull();
});


test('delete users', async () => {
    expect.assertions(4);
    await db.User.destroy({
        where: {
            id: '00000000-0000-0000-0001-000000000001'
        }
    });
    await db.User.destroy({
        where: {
            id: '00000000-0000-0000-0001-000000000002'
        }
    });
    await db.User.destroy({
        where: {
            id: '00000000-0000-0000-0001-000000000003'
        }
    });
    await db.User.destroy({
        where: {
            id: '00000000-0000-0000-0001-000000000004'
        }
    });
    const user1 = await db.User.findByPk('00000000-0000-0000-0001-000000000001');
    const user2 = await db.User.findByPk('00000000-0000-0000-0001-000000000002');
    const user3 = await db.User.findByPk('00000000-0000-0000-0001-000000000003');
    const user4 = await db.User.findByPk('00000000-0000-0000-0001-000000000004');
    expect(user1).toBeNull();
    expect(user2).toBeNull();
    expect(user3).toBeNull();
    expect(user4).toBeNull();
});

afterAll(async () => {
    await db.sequelize.close();
});