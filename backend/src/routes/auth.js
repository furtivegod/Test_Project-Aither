const express = require('express');
const router = express.Router();
const { signup, login, getGoogleAuthUrl, handleGoogleCallback } = require('../controllers/authController');


router.post('/signup', signup);
router.post('/login', login);
router.get('/google-login', getGoogleAuthUrl);
router.get('/google/callback', handleGoogleCallback);

module.exports = router;
