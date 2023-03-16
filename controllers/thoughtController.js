const { Thought, User } = require('../models');

const thoughtController = {
    // Get all thoughts
    getAllThoughts(req, res) {
        Thought.find()
        // connect Reaction model to Thought collection 
        .populate({path: 'reactions', select: '-__v',})
        .then((thoughtsDb) => res.json(thoughtsDb))
        .catch((err) => res.status(500).json(err));
    },
    // Get a thought
    getOneThought(req, res) {
        Thought.findOne({_id: req.params.thoughtId})
            // connect Reaction model to Thought collection 
            .populate({path: 'reactions', select: '-__v',})
            .select('-__v')
            .then((thoughtDb) =>
                !thoughtDb
                    ? res.status(404).json({message: 'No thought with this id found'})
                    : res.json(thoughtDb)
            )
            .catch((err) => res.status(500).json(err));
    },
    // Create a thought
    addThought(req, res) {
        Thought.create(req.body)
            // connect thought with user
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    {_id: req.body.userId},
                    {$push: {thoughts: _id}},
                    {new: true},
                );
            })
            .then((thoughtDb) => res.json(thoughtDb))
            .catch((err) => {
                console.log(err);
                return res.status(500).json(err);
            });
    },
    // Delete a thought
    removeThought(req, res) {
        Thought.findOneAndDelete({_id: req.params.thoughtId})
            .then((thoughtDb) =>
                !thoughtDb
                    ? res.status(404).json({message: 'No thought with this id found'})
                    : User.findOneAndUpdate(
                        {thoughts: req.params.thoughtId},
                        {$pull: {thoughts: req.params.thoughtId}},
                        {new: true},
                    )
            )
            .then((userDb) =>
                !userDb
                    ? res.status(404).json({message: 'Thought deleted, but no user with this id found'})
                    : res.json({message: 'Thought successfully deleted from database'})
            )
            .catch((err) => {
                console.log(err);
                res.status(500).json(err);
            });
    },
    // Update a thought
    updateThought(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$set: req.body},
            {runValidators: true, new: true}
        )
        .then((thoughtDb) => 
            !thoughtDb
                ? res.status(404).json({message: 'No thought with this id found'})
                : res.json(thoughtDb)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Create a reaction
    addReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$addToSet: {reactions: req.body}},
            {runValidators: true, new: true}
        )
        .then((thoughtDb) =>
            !thoughtDb
                ? res.status(404).json({message: 'No thought with this id found'})
                : res.json(thoughtDb)
        )
        .catch((err) => res.status(500).json(err));
    },
    // Delete a reaction
    removeReaction(req, res) {
        Thought.findOneAndUpdate(
            {_id: req.params.thoughtId},
            {$pull: {reactions: {reactionId: req.params.reactionId}}},
            {runValidators: true, new: true}
        )
        .then((thoughtDb) =>
            !thoughtDb
                ? res.status(404).json({message: 'No thought with this id found'})
                : res.json(thoughtDb)
        )
        .catch((err) => res.status(500).json(err));
    },
};

module.exports = thoughtController;
