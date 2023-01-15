
const { Schema, model } = require('mongoose');

const commentSchema = new Schema({
    personalityType: {
        MBTI: String,
        Enneagram: String,
        Zodiac: String
    },
    title: String,
    description: String,
    totalLikes:  { type: Number, default: 0}
}, {
    timestamps: true 
});

module.exports = model('Comment', commentSchema);