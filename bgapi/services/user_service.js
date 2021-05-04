const db = require('../database');
const data_tools = require('../common/data_tools');

class UserService {

    async getUser(user_id) {
        try {
            if(user_id) {
                let user = await db.User.findByPk(user_id);
                return user;
            } 
        }
        catch (err) {
            throw err;
        }  
    }

    async getUserList() {  
        try {
            let users = await db.User.findAll();
            return users;
        } 
        catch (err) {
            throw err;
        }   
    }

    async createUser(name) {
        try {
            let user = await db.User.create({name: name})
            return user;
        }
        catch (err) {
            throw err;  
        }
    }

    async deleteUser(id) {
        try {
            await db.User.destroy({where: {id: id}});
        }
        catch (err) {
            throw err;  
        }
    }
}

module.exports = UserService;