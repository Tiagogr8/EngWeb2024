var mongoose = require("mongoose")

var compositorSchema = new mongoose.Schema({
    _id : String,
    nome : String,
    bio : String,
    dataNasc : String,
    dataObito : String,
    periodo : String
}, { versionKey: false })

module.exports = mongoose.model('compositores', compositorSchema)