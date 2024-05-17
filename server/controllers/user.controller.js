const userSchema = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, {
        expiresIn: "3d"
    });
};

const register = async (req, res) => {
    try {
        const { email, name, password } = req.body;

        if (!email || !name || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please provide a valid email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Please provide a strong password" });
        }

        let user = await userSchema.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "User already exists" });
        }

        user = new userSchema({ email, name, password });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const token = createToken(user._id);

        return res.status(200).json({ success: true, _id: user._id, name, email, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await userSchema.findOne({ email });
        if (!user)
            return res.status(404).json({ error: "Invalid Creditials" });
        if (await bcrypt.compare(password, user.password)) {
            const token = createToken(user._id)
            return res.status(200).json({ success: true, _id: user._id, name: user.name, email, token });
        }
        return res.status(404).json({ error: "Invalid Creditials" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }

}

const findUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        let user = await userSchema.findById(userId);
        if (!user)
            return res.status(404).json({ error: "Not found" });
        return res.status(200).json({ success: true, _id: user._id, name: user.name, email });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}
const findAllUser = async (req, res) => {
    const userId = req.params.userId;
    try {
        let users = await userSchema.find();
        return res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
}

module.exports = {
    register, login, findUser, findAllUser
};
