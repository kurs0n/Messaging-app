const mongoose = require('mongoose');
const accountSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    login: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    friends: [
        {friendId: {
            type:mongoose.SchemaTypes.ObjectId,ref: 'Account'
        }}
    ]
});

module.exports = mongoose.model('Account',accountSchema);