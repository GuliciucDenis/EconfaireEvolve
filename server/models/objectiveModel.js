const mongoose = require('mongoose');

// Define the SubObjective schema
const subObjectiveSchema = new mongoose.Schema({
    title: { type: String, required: true , maxlength: 50},
    gradeAdmin: { type: Number, required: true, min: 0, max: 10, default: 0 },  // Grade given by admin
    gradeEmployee: { type: Number, required: true, min: 0, max: 10, default: 0 } // Grade given by employee
});

// Define the Objective schema
const objectiveSchema = new mongoose.Schema({
    id: { type: mongoose.Schema.Types.ObjectId},
    title: { type: String, required: true , maxlength: 50},
    description: { type: String, required: true , maxlength: 200},
    deadline: { type: Date, required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    gradeAdmin: { type: Number, min: 0, max: 10, default: 0  },  // Overall grade given by admin
    gradeEmployee: { type: Number, min: 0, max: 10, default: 0 }, // Overall grade given by employee
    status: { 
        type: String, 
        required: true, 
        enum: ['new', 'in-progress', 'finished'], 
        default: 'new' 
    },
    subObjectives: [subObjectiveSchema],  // List of sub-objectives
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// The model is connected to the `objectives` collection in MongoDB
const Objective = mongoose.model('Objective', objectiveSchema);

module.exports = Objective;
