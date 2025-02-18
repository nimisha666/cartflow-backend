const express = require('express');
const Products = require('./products.model');
const Reviews = require('../reviews/reviews.model');
const verifyAdmin = require('../middleware/verifyAdmin');
const router = express.Router();

// Post a product
router.post("/create-product", async (req, res) => {
    try {
        // Validate the required fields
        const { name, price, category, author, description } = req.body;
        if (!name || !price || !category || !author || !description) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Create a new product with the provided data
        const newProduct = new Products({
            ...req.body
        });

        // Save the new product
        const savedProduct = await newProduct.save();

        // Calculate average rating if reviews exist
        const reviews = await Reviews.find({ productId: savedProduct._id });
        if (reviews.length > 0) {
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            const averageRating = totalRating / reviews.length;
            savedProduct.rating = averageRating;
            await savedProduct.save();
        }

        // Respond with the created product
        res.status(201).send(savedProduct);
    } catch (error) {
        console.error("Error creating new product:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const { category, color, minPrice, maxPrice, page = 1, limit = 10 } = req.query;

        // Build the filter
        let filter = {};
        if (category && category !== "all") {
            filter.category = category;
        }
        if (color && color !== "all") {
            filter.color = color;
        }
        if (minPrice && maxPrice) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            if (!isNaN(min) && !isNaN(max)) {
                filter.price = { $gte: min, $lte: max };
            }
        }

        // Pagination calculation
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalProducts = await Products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / parseInt(limit));

        // Fetch products with the applied filter and pagination
        const products = await Products.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .populate("author", "email username")  // Populate author with additional fields like username
            .sort({ createdAt: -1 });

        // Send response with products and pagination data
        res.status(200).send({ products, totalPages, totalProducts });

    } catch (error) {
        console.error("Error fetching products:", error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const productId = req.params.id;

        // Fetch the product and its author data
        const product = await Products.findById(productId).populate("author", "email username");

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Fetch the reviews related to the product
        const reviews = await Reviews.find({ productId }).populate("userId", "username email");

        // Respond with the product and its reviews
        res.status(200).send({ product, reviews });
    } catch (error) {
        console.error("Error fetching the product:", error.message);
        res.status(500).json({ error: error.message });
    }
});


// Update a product (Admin only)
router.patch("/update-product/:id", verifyAdmin, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Products.findById(productId);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const updatedProduct = await Products.findByIdAndUpdate(
            productId,
            { ...req.body },
            { new: true }
        );

        res.status(200).send({
            message: "Product updated successfully",
            product: updatedProduct
        });
    } catch (error) {
        console.error("Error updating the product:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Delete a product and its related reviews
router.delete('/:id', async (req, res) => {
    try {
        const productId = req.params.id;
        const deletedProduct = await Products.findByIdAndDelete(productId);

        if (!deletedProduct) {
            return res.status(404).send({ message: "Product not found" });
        }

        await Reviews.deleteMany({ productId });
        res.status(200).send({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting the product:", error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get related products based on name and category
router.get("/related/:id", async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).send({ message: "Product ID is required" });
        }

        const product = await Products.findById(id);

        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const titleRegex = new RegExp(
            product.name
                .split(" ")
                .filter((word) => word.length > 1)
                .join("|"),
            "i"
        );

        const relatedProducts = await Products.find({
            _id: { $ne: id },
            $or: [
                { name: { $regex: titleRegex } },
                { category: product.category },
            ],
        });

        res.status(200).send(relatedProducts);

    } catch (error) {
        console.error("Error fetching related products:", error.message);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
