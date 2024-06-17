var User = require("../models/user")

module.exports.list = () => {
    return User
            .find()
            .sort('name')
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getUser = id => {
    return User.findOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.getUserByUserName = username => {
    return User.findOne({username:username})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.addUser = u => {
    return User.create(u)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.checkUserExistence = (username, email) => {
    return User.findOne({ $or: [{ username: username }, { email: email }] })
        .then(resposta => {
            return resposta;
        })
        .catch(erro => {
            return erro;
        });
};

module.exports.updateUserPassword = (id, pwd) => {
    return User.updateOne({_id:id}, pwd)
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}

module.exports.deleteUser = id => {
    return User.deleteOne({_id:id})
            .then(resposta => {
                return resposta
            })
            .catch(erro => {
                return erro
            })
}
 
module.exports.updateUser = (username, userData) => {
    return User.findOneAndUpdate({ username: username }, userData, { new: true }).exec();
}