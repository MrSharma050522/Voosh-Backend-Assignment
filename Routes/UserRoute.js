const express = require("express");
const router = express.Router();
const User = require("../Modal/UserModal.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authUser = require("../Middleware/auth.js");

// Endpoint to register new user
router.post("/register-new-user", async (req, res) => {
    try {
        const { name, email, password, phone, bio } = req.body;

        if (!name || !email || !password || !phone)
            return res.status(400).json("Please Provide Necessary Details");

        if (phone.trim().length != 10)
            return res.status(400).json("Phone Number should be of 10 digits!");

        const hashPassword = await bcrypt.hash(password, 10);

        const emailExists = await User.findOne({ email: email });
        if (emailExists) {
            return res.status(400).json("Email already Exists");
        }

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            phone,
            bio,
        });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "3d",
        });

        user.password = "";

        res.status(201).json({
            user,
            token,
        });
    } catch (error) {
        console.log("Error -> ", error);
        res.status(400).json(error);
    }
});

// Endpoint to get all users
router.get("/get-all-user", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        const isUserAdmin = await User.findById(userId);

        let users;
        if (!isUserAdmin.isAdmin) {
            users = await User.find({ isPublic: true }).select(
                "name email createdAt updatedAt phone"
            );
            return res.status(200).json(users);
        }

        users = await User.find().select(
            "name email createdAt updatedAt phone"
        );

        res.status(200).json(users);
    } catch (error) {
        console.log("Error -> ", error);
        res.status(400).json(error);
    }
});

// Endpoint to login existing user
router.post("/login-existing-user", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Email and Password should not be empty",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Email is not registered!",
            });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({
                message: "Password is Incorrect!",
            });
        }

        user.password = "";

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "24h",
        });
        res.status(200).json({
            status: "success",
            user,
            token,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

// Endpoint to get profile of the user logged in
router.get("/get-profile-detail", authUser, async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Invalid User Id",
            });
        }

        user.password = "";

        res.status(200).json({
            status: "success",
            user,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

// Endpoint to edit the profile details of the user logged in
router.patch("/edit-profile-detail", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { photo, name, bio, phone, email } = req.query;
        let updateObj = {};
        if (phone) updateObj.phone = phone;
        if (name) updateObj.name = name;
        if (bio) updateObj.bio = bio;
        if (email) updateObj.email = email;
        if (photo) updateObj.photo = photo;

        const user = await User.findByIdAndUpdate(userId, updateObj, {
            new: true,
        });
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }

        user.password = "";

        res.status(200).json({
            status: "success",
            user,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

// Endpoint to change the password of the user logged in
router.patch("/change-password", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { oldPassword, newPassword } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }
        const verify = await bcrypt.compare(oldPassword, user.password);
        if (!verify) {
            return res.status(400).json({
                message: "Old Password is Incorrect!",
            });
        }

        const newHashPassword = await bcrypt.hash(newPassword, 10);

        const userDetail = await User.findByIdAndUpdate(
            userId,
            { password: newHashPassword },
            { new: true }
        );

        user.password = "";

        res.status(200).json({
            status: "success",
            userDetail,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

// Endpoint to change public profile to private and private to public of the user logged in
router.patch("/change-visibility", authUser, async (req, res) => {
    try {
        const userId = req.userId;
        const { password, isPublic } = req.query;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User Not Found",
            });
        }
        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({
                message: "Password is Incorrect!",
            });
        }
        // return res.status(200).json(user);

        const userDetail = await User.findByIdAndUpdate(
            userId,
            { isPublic: isPublic },
            { new: true }
        );

        user.password = "";

        res.status(200).json({
            status: "success",
            userDetail,
        });
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});

module.exports = router;
