const express = require('express');
const userHandler = require('../handler/userHandler');

const router = express.Router();

router.get('/', userHandler.getAllUsers);
router.get('/:id', userHandler.getUserById);
router.post('/', userHandler.createUser);
router.put('/:id', userHandler.updateUser);
router.delete('/:id', userHandler.deleteUser);
router.get('/name/search', userHandler.searchUsers);

module.exports = router;
