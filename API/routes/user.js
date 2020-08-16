const router = require('express').Router();
const userController = require('../controllers/user');
const {isAuth} = require('../middleware/is-auth');

router.post('/add_friend',isAuth,userController.addFriend);

router.post('/message',isAuth,userController.sendMessage);

router.get('/conversation',isAuth,userController.getConversation);

router.get('/friends',isAuth,userController.getFriends);

router.get('/users',isAuth,userController.getUsers);

router.get('/me',isAuth,userController.getMe);

router.patch('/accept_friend',isAuth, userController.acceptFriend);

module.exports = router;