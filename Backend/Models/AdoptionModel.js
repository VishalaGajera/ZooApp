const mongoose = require("mongoose");
const autopopulate = require("mongoose-autopopulate");

const adoptionSchema = new mongoose.Schema(
    {
        animal_name: {
            type: String,
            required: true,
        },
        period: {
            type: Number,
            required: true
        },
        frequency: {
            type: String,
            required: true,
            enum: ['daily', 'monthly', 'yearly']
        },
        cost: {
            type: Number,
            required: true,
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

adoptionSchema.plugin(autopopulate);

module.exports = mongoose.model("adoptions", adoptionSchema);