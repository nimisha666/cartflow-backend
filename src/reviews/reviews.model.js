const mongoose = require('mongoose');

const ReviewsSchema = new mongoose.Schema({
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Reviews = mongoose.model("Reviews", ReviewsSchema);

module.exports = Reviews;