var { Inquiricao, Suggestion } = require("../models/inquiricao");

module.exports.list = () => { 
    return Inquiricao    
        .find()
        .sort({Name : 1})
        .exec()
}

module.exports.findById = id => {
    return Inquiricao
        .findOne({_id : id})
        .exec()
}

module.exports.findByName = name => {
    return Inquiricao
        .find({ Name: { $regex: new RegExp(name, 'i') } }) 
        .exec();
};


module.exports.insert = async inquiricao => {
    const lastInquiricao = await Inquiricao.findOne().sort({ _id: -1 }).exec();
    const lastId = lastInquiricao ? parseInt(lastInquiricao._id) : 0;
    inquiricao._id = (lastId + 1).toString();
    
    return Inquiricao.create(inquiricao);
};

module.exports.update = (id, inquiricao) => {
    return Inquiricao.updateOne({_id: id}, inquiricao);
}

module.exports.delete = id => {
    return Inquiricao.findByIdAndDelete({_id : id});
}
module.exports.find = (query, sortOption) => {
    return Inquiricao.find(query).sort(sortOption).exec();
}

module.exports.insertSuggestion = suggestion => {
    return Suggestion.create(suggestion);
};

module.exports.listSuggestions = inquiricaoId => {
    return Suggestion.find({ inquiricaoId }).exec()
        .then(suggestions => {
            return suggestions;
        });
};

module.exports.getSuggestion = id => {
    return Suggestion.findById(id).exec();
};

module.exports.updateSuggestionStatus = (id, status) => {
    return Suggestion.findByIdAndUpdate(id, { status: status }, { new: true }).exec();
};

module.exports.updateInquiricaoWithSuggestion = (inquiricaoId, suggestion) => {
    const updateData = {
        Name: suggestion.Name,
        UnitDateInitial: suggestion.UnitDateInitial,
        UnitDateFinal: suggestion.UnitDateFinal,
        UnitDateInitialCertainty: suggestion.UnitDateInitialCertainty,
        UnitDateFinalCertainty: suggestion.UnitDateFinalCertainty,
        Repository: suggestion.Repository,
        ScopeContent: suggestion.ScopeContent,
        PhysLoc: suggestion.PhysLoc,
        PreviousLoc: suggestion.PreviousLoc,
        PhysTech: suggestion.PhysTech,
        RelatedMaterial: suggestion.RelatedMaterial,
        LangMaterial: suggestion.LangMaterial
    };
    return Inquiricao.findByIdAndUpdate(inquiricaoId, updateData, { new: true }).exec();
};

module.exports.addPost = (inquiricaoId, post) => {
    post.createdAt = new Date(); 
    return Inquiricao.findByIdAndUpdate(
        inquiricaoId,
        { $push: { posts: post } },
        { new: true }
    ).exec();
};

module.exports.addComment = (postId, comment) => {
    comment.createdAt = new Date(); 
    return Inquiricao.findOneAndUpdate(
        { "posts._id": postId },
        { $push: { "posts.$.comments": comment } },
        { new: true }
    ).exec();
};

module.exports.listComments = postId => {
    return Inquiricao.findOne({ "posts._id": postId }, { "posts.$": 1 })
        .exec()
        .then(inquiricao => ({
            post: inquiricao.posts[0],
            comments: inquiricao.posts[0].comments
        }));
};
