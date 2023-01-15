
const { Schema, model } = require('mongoose');

const profileSchema = new Schema({
    name: String,
    description: String,
    mbti: String,
    enneagram: String,
    variant: String,
    tritype: Number,
    socionics: String,
    sloan: String,
    psyche: String,
    image: String
}, {
    timestamps: true 
});

module.exports = model('Profile', profileSchema);