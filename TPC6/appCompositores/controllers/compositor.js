var Compositor = require("../models/compositor")

module.exports.list = () => {
    return Compositor
        .find()
        .sort({nome : 1})
        .exec()
}

module.exports.findById = id => {
    return Compositor
        .findOne({_id : id})
        .exec()
}

module.exports.remove = id => {
    return Compositor
        .findByIdAndDelete(id)
        .exec()
}


module.exports.insert = compositor => {
    if((Compositor.find({_id : compositor._id}).exec()).length != 1){
        var newCompositor = new Compositor(compositor)
        return newCompositor.save()
    }
}


module.exports.update = (id, compositor) => {
    return Compositor
        .findByIdAndUpdate(id, compositor, {new : true})
        .exec()
}