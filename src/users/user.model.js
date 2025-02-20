const { Schema, model } = require('mongoose');
const bcrypt = require("bcryptjs");

const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    profileImage: String,
    bio: { type: String, maxlength: 200 },
    profession: String,
    mobile: { type: String, required: false },  // ✅ Added mobile field
    gender: { type: String, enum: ["male", "female", "other"], required: false }, // ✅ Added gender field
    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (!user.isModified('password')) return next();
    try {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        user.password = hashedPassword;
        next();
    } catch (error) {
        console.error("Error hashing password:", error);
        next(error);
    }
});

const User = model('User', userSchema);
module.exports = User;