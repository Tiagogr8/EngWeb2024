const mongoose = require('mongoose');

const suggestionSchema = new mongoose.Schema({
    inquiricaoId: { type: String, required: true },
    suggestedBy: { type: String, required: true },
    suggestedAt: { type: Date, default: Date.now },
    Name: String,
    UnitDateInitial: String,
    UnitDateFinal: String,
    UnitDateInitialCertainty: Boolean,
    UnitDateFinalCertainty: Boolean,
    Repository: String,
    ScopeContent: String,
    Localidade: String,
    PhysLoc: String,
    PreviousLoc: String,
    PhysTech: String,
    RelatedMaterial: String,
    LangMaterial: String,
    Parentesco: [String],
    status: { type: String, default: 'pending' }
}, { versionKey: false });


const commentSchema = new mongoose.Schema({
    postId: String,
    username: String,
    comentario: String,
    createdAt: { type: Date, default: Date.now }
}, { versionKey: false });

var postSchema = new mongoose.Schema({
    idInquiricao: String,
    username: String,
    descricao: String,
    createdAt: { type: Date, default: Date.now },
    comments: [commentSchema]
}, { versionKey: false });

const inquiricaoSchema = new mongoose.Schema({
    _id: String,
    Name: String,
    UnitDateInitial: String,
    UnitDateFinal: String,
    UnitDateInitialCertainty: Boolean,
    UnitDateFinalCertainty: Boolean,
    Repository: String,
    ScopeContent: String,
    Localidade: String,
    Creator: String,
    Created: String,
    RelatedMaterial: String,
    PhysTech : String,
    PhysLoc : String,
    PreviousLoc : String,
    LangMaterial : String,
    Parentesco: [String],
    posts : [postSchema] 
}, { versionKey: false });

const Inquiricao = mongoose.model('inquiricao', inquiricaoSchema, 'inquiricoes');
const Suggestion = mongoose.model('suggestion', suggestionSchema, 'suggestions');

module.exports = { Inquiricao, Suggestion };
