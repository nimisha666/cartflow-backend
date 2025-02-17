const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [3, 'Product name must be at least 3 characters']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        enum: ['Electronics', 'Fashion', 'Home', 'Books', 'Toys', 'Sports', 'Beauty'],  // Example categories
        default: 'Electronics'
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        minlength: [10, 'Description must be at least 10 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price must be greater than or equal to 0']
    },
    oldPrice: {
        type: Number,
        min: [0, 'Old Price must be greater than or equal to 0'],
        default: 0
    },
    image: {
        type: String,
        required: [true, 'Product image URL is required']
    },
    color: {
        type: String,
        enum: ['Red', 'Blue', 'Green', 'Black', 'White'],  // Example color options
        default: 'Black'
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating must be between 0 and 5'],
        max: [5, 'Rating must be between 0 and 5']
    },
    author: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: [true, 'Product must have an author']
    }
}, {
    timestamps: true  // Automatically adds createdAt and updatedAt fields
});

const Products = mongoose.model("Product", ProductSchema);

module.exports = Products;
