const Account = require('../models/account');
const Conversation = require('../models/conversation');
module.exports.addFriend = async (req,res,next)=>{
    const user = await Account.findOne({_id: req.userId});
    const friendId = req.body.id;
    const friend = await Account.findOne({_id: friendId});
    if(!friend)
    {
        const error = new Error();
        error.message="Can't find this account";
        error.statusCode = 500;
        return next(error);
    }
    if (friend._id.toString() === user._id.toString()){
        const error = new Error();
        error.message="You can't add yourself to friends xD";
        error.statusCode = 500;
        return next(error);
    }
    user.friends.push({
        friend: friend._id
    });
    user.save();
    res.status(200).json(
        {
            message: 'Succesfully added friend :)'
        }
    );
};

module.exports.sendMessage = async (req,res,next)=>{
    const userSendingMessage = req.userId;
    const userWhoGetMessage = req.body.id;
    const message = req.body.message;
    let conversation = await Conversation.findOne({person1: userSendingMessage, person2: userWhoGetMessage});
    if (!conversation)
    {
        conversation = await Conversation.findOne({person1: userWhoGetMessage, person2: userSendingMessage});
    }
    if (!conversation)
    {
        conversation = new Conversation({
            person1: userSendingMessage,
            person2: userWhoGetMessage,
            messages: [{
                person: userSendingMessage,
                message: message
            }]
        });
        conversation.save();
        res.status(201).json({
            message: 'Created conversation and send message'
        })
    }
    else {

        conversation.messages.push({
            person: userSendingMessage,
            message: message
        });
        const conversationindb = await conversation.save();
        const person = await Account.findOne({_id: userSendingMessage}).select('name');
        const socket = require('../utils/socket').getIo();
        socket.emit('message',{
            _id: conversationindb.messages[conversationindb.messages.length-1]._id,
            person: person,
            message: message
        });
        res.status(200).json({
            message: 'Send message'
        });
    }
};  

module.exports.getFriends = async (req,res,next)=>{
    const user = await Account.findOne({_id: req.userId}).populate({path: 'friends.friend', select:'name surname email'});
    const friends = [...user.friends];
    if (!friends){
        const error = new Error();
        error.message="You don't have friends :(";
        error.statusCode = 500;
        return next(error);
    }
    res.status(200).json({
        friends: friends
    });
};

module.exports.getConversation = async(req,res,next)=>{
    const person2Id = req.get('person2');
    let conversation = await Conversation.findOne({person1: req.userId, person2: person2Id }).populate({path: 'messages.person', select: 'name'});
    if(!conversation)
    {
        conversation = await Conversation.findOne({person1: person2Id, person2: req.userId }).populate({path: 'messages.person', select: 'name'});
    }
    if (!conversation) {
        const error = new Error();
        error.message="We don't have this conversation";
        error.statusCode = 500;
        return next(error);
    }
    res.status(200).json({
        messages: conversation.messages 
    });
};

module.exports.getUsers = async(req,res,next)=>{
    const input = req.get('input');
    const accounts = await Account.find();
    const filtered_accounts = accounts.filter(account=>{
        var temp =0;
        for(var i=0; i<input.length; i++)
        {
            if (input[i]===account.name[i])
            {
                temp++;
            }
        }
        if (temp===input.length)
        {
            return account;
        }
    });

    if (filtered_accounts[0]){
        res.status(200).json({
            accounts: filtered_accounts
        });
    }
    else {
        res.status(200).json({
            accounts: filtered_accounts
        });
    }

};