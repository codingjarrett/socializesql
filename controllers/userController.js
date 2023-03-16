const { User, Thought } = require('../models');

const userController = {
    // Get all users
    getAllUsers(req, res) {
        User.find()
        // connect Thought collection to User collection 
        .populate({path: 'thoughts', select: '-__v',})
        // connect User collection (self-reference)
        .populate({path: 'friends', select: "-__v",})
        .select("-__v")
        .then((usersDb) => res.json(usersDb))
        .catch((err) => res.status(500).json(err));
    },
    // Get a user
    getOneUser(req, res) {
        User.findOne({_id: req.params.userId})
        // connect Thought collection to User collection
        .populate({path: 'thoughts', select: '-__v',})
        // connect User collection (self-reference)    
        .populate({path: 'friends', select: '-__v'})
        .select('-__v')
        .then((userDb) =>
            !userDb
                ? res.status(404).json({message: 'No user with this id was found'})
                : res.json(userDb)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Create a user
    addUser(req, res) {
        User.create(req.body)
            .then((userDb) => res.json(userDb))
            .catch((err) => res.status(500).json(err));
    },
    // Update a user
    updateUser(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((user) => 
            !user
                ? res.status(404).json({message: 'No user with this id was found'})
                : res.json(user)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete a user
    removeUser(req, res) {
        User.findOneAndDelete({_id: req.params.userId})
            .then((userDb) =>
                !userDb
                    ? res.status(404).json({message: 'No user with this id was found'})
                    : Thought.deleteMany({_id: {$in: userDb.thoughts}})
            )
            .then((thoughtDb) => 
                !thoughtDb
                ? res.status(404).json({message: 'User deleted, but no associated thoughts with this user found'})
                : res.json({message: 'User successfully deleted from database'})
            )
            .catch((err) => res.status(500).json(err));
    },
    // Add a friend
    addFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$addToSet: {friends: req.params.friendId}},
            {runValidatiors: true, new: true},
        )
        .then((userDb) =>
            !userDb
                ? res.status(404).json({message: 'No user with this id was found'})
                : res.json(userDb)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete a friend
    removeFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId},
            {$pull: {friends: req.params.friendId}},
            {runValidatiors: true, new: true},
        )
        .then((userDb) => 
            !userDb
                ? res.status(404).json({message: 'No user with this id was found'})
                : res.json(userDb)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = userController;
