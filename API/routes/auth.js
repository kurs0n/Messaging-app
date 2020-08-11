const router = require('express').Router();
const authController = require('../controllers/auth');

router.post('/signup',authController.signup);

module.exports = router;