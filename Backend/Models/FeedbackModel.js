const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const feedbackSchema = new mongoose.Schema(
    {
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: {
            type: String,
            required: true,
        },
        approved: {
            type: Number,
            required: true,
            default: 0,
            enum: [0, 1]
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            autopopulate: true,
            required: true,
        },
        isDeleted: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

feedbackSchema.plugin(autopopulate);

module.exports = mongoose.model("feedbacks", feedbackSchema);