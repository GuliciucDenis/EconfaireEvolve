const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId},
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['employee', 'admin'], default: 'employee' },
    objectiveList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Objective' }],
});

// The model is connected to the `users` collection in MongoDB
const User = mongoose.model('User', userSchema);

module.exports = User;
