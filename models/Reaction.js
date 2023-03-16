const { Schema, Types } = require('mongoose');
const moment = require('moment');

// Schema to create reaction field's subdocument schema in the Thought model
const reactionSchema = new Schema(
    {
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () => new Types.ObjectId(),
        },
        reactionBody: {
            type: String,
            required: true,
            maxlength: 280,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timeStamp) => moment(timeStamp).format('MMM DD, YYYY hh:mm a'),
        },
    },
    {
        toJSON: {
            getters: true,
        },
    },
);

module.exports = reactionSchema;