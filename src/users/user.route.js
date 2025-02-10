const express = require('express');
const bcrypt = require('bcrypt');
const User = require('./user.model');
const generateToken = require('../middleware/generateToken');


const router = express.Router();

// ✅ Register Route
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "pasword not match" });
        }
        const token = await generateToken(user._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });


        res.json({
            message: "Login successful", token, user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession
            }
        });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// logout endpoints
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).send({ message: 'Logged out successfully' })
})

// delete user
router.delete('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send({ message: 'User deleted successfuly' })
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user" });
    }
})

// get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, 'id email role').sort({ createdAt: -1 });
        res.status(200).send(users)
    } catch ({ error }) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Error fetching user" });
    }
})

// update user role
router.put('/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const user = await User.findByIdAndUpdate(id, { role }, { new: true });
        if (!user) {
            return res.status(404).send({ message: 'User not found' })
        }
        res.status(200).send({ message: 'User role updated successfully' })
    } catch (error) {
        console.error("Error updating user user:", error);
        res.status(500).json({ message: "Error updating user user" });
    }
})


// update user profile
router.patch('/edit-profile', async (req, res) => {
    try {
        const { userId, username, profileImage, bio, profession } = req.body;
        if (!userId) {
            return res.status(400).send({ message: 'User id is required' })
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).send({ message: 'User npt found' })
        }
        // update profile
        if (username !== undefined) user.username = username;
        if (profileImage !== undefined) user.profileImage = profileImage;
        if (bio !== undefined) user.bio = bio;
        if (profession !== undefined) user.profession = profession;

        await user.save();
        res.status(200).send({
            message: 'Profile update successfuly',
            user: {
                _id: user._id,
                email: user.email,
                username: user.username,
                role: user.role,
                profileImage: user.profileImage,
                bio: user.bio,
                profession: user.profession
            }
        })
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ message: "Error updating user profile" });
    }
})

module.exports = router;
