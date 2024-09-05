const User = require('../domain/model/userModel');
const bcrypt = require('bcrypt');

//Get All
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, { _id: 0, __v: 0 }); //Buang _id and __v
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving users', error: error.message });
    }
};

//Get One
const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findOne({ id });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving user', error: error.message });
    }
};

//Register
const createUser = async (req, res) => {
    const { name, password, email } = req.body;

    if (!name || !password || !email) {
        return res.status(400).json({ message: 'User must have a name, password, and email' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {                            //Hashing
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({ name, password: hashedPassword, email });

        const createdUser = await newUser.save();
        res.status(201).json(createdUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error: error.message });
    }
};

//Update
const updateUser = async (req, res) => {
    const { id } = req.params;
    const userUpdates = req.body;

    try {
        const updatedUser = await User.findOneAndUpdate({ id }, userUpdates, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error: error.message });
    }
};

//Delete
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedUser = await User.findOneAndDelete({ id });
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

//Search
const searchUsers = async (req, res) => {
    const { name } = req.query;
    try {
        const users = await User.find({ name: new RegExp(name, 'i') });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error searching users', error: error.message });
    }
};

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    searchUsers
};
