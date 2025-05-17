const express = require('express');
const { register, login, getMe } = require('../controllers/auth');
const { protect } = require('../middleware/auth');
const upload = require('../config/multer');

const router = express.Router();

router.post('/register', upload.single('profilePhoto'), register);
router.post('/login', login);
router.get('/me', protect, getMe);

module.exports = router;
