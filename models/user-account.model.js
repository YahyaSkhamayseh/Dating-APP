
const { Schema, model } = require('mongoose');

const userAccountSchema = new Schema({
    name: String,
}, {
    timestamps: true 
});

module.exports = model('UserAccount', userAccountSchema);