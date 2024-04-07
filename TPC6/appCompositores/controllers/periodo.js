var Periodo = require("../models/periodo")

module.exports.list = () => {
    return Periodo
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Periodo
        .findOne({_id : id})
        .exec()
}

module.exports.remove = id => {
    return Periodo
        .findByIdAndDelete(id)
        .exec()
}


module.exports.insert = periodo => {
    if((Periodo.find({_id : periodo._id}).exec()).length != 1){
        var newPeriodo = new Periodo(periodo)
        return newPeriodo.save()
    }
}


module.exports.update = (id, periodo) => {
    return Periodo
        .findByIdAndUpdate(id, periodo, {new : true})
        .exec()
}