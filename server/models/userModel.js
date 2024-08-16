const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['employee', 'admin'], default: 'employee' },
});

// The model is connected to the `users` collection in MongoDB
const User = mongoose.model('User', userSchema);

module.exports = User;
