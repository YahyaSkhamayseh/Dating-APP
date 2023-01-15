
const { Schema, model } = require('mongoose');

const likeSchema = new Schema({
    userAccountId: String,
    commentId: String,
}, {
    timestamps: true 
});

module.exports = model('Like', likeSchema);