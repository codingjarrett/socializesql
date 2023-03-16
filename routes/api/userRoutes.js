const router = require('express').Router();
const {
    getAllUsers,
    getOneUser,
    addUser,
    removeUser,
    updateUser,
    addFriend,
    removeFriend,
} = require('../../controllers/userController');

// /api/users
router.route('/').get(getAllUsers).post(addUser);

// /api/users/:userId
router.route('/:userId').get(getOneUser).delete(removeUser).put(updateUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

module.exports = router;