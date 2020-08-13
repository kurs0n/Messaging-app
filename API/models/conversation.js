const mongoose = require('mongoose');
const conversationSchema = new mongoose.Schema({
    person1: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'Account'
    },
    person2: {
        type: mongoose.SchemaTypes.ObjectId, ref: 'Account'
    },
    messages: [{
        person: {
            type: mongoose.SchemaTypes.ObjectId, ref: 'Account'
        },
        message:{
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model('Conversation', conversationSchema);