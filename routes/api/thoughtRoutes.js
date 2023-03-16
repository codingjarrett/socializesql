const router = require('express').Router();
const {
    getAllThoughts,
    getOneThought,
    addThought,
    removeThought,
    updateThought,
    addReaction,
    removeReaction,
} = require('../../controllers/thoughtController');

// /api/thoughts
router.route('/').get(getAllThoughts).post(addThought);

// /api/thoughts/:thoughtId
router.route('/:thoughtId').get(getOneThought).put(updateThought).delete(removeThought);

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;