const jwt = require('jsonwebtoken');
const config = require('../config/config');
const Objective = require('../models/objectiveModel');

const restrictDeadlineUpdate = async (req, res, next) => {
    const { id } = req.params;
    const { deadline } = req.body;
    objective = await Objective.findById(id);
    if (deadline != objective.deadline) {
        return res.status(403).json({ error: 'You are not allowed to modify the deadline.' });
    }
    next();
}

const verifyUpdateAccessForObjectives = async (req, res, next) => {
    const { role } = req.user;  // Assuming the authenticated user's role is available in req.user
    const updateData = req.body;

    // Define allowed fields for each role
    const allowedFieldsForEmployee = ['gradeEmployee'];
    const allowedFieldsForAdmin = ['deadline', 'gradeAdmin', 'title', 'description', 'status', 'assignedTo'];

    // Check if the user is an admin
    if (role === 'admin') {
        // Admin can modify specific fields in the objective
        const objectiveFieldsToUpdate = Object.keys(updateData);
        
        for (let field of objectiveFieldsToUpdate) {
            if (!allowedFieldsForAdmin.includes(field) && field !== 'subObjectives') {
                return res.status(403).json({ error: `Admin is not authorized to update the field: ${field}` });
            }
        }

        // Admin can modify specific fields in subObjectives
        if (updateData.subObjectives && Array.isArray(updateData.subObjectives)) {
            for (let subObjective of updateData.subObjectives) {
                const subObjectiveFieldsToUpdate = Object.keys(subObjective);
                
                for (let field of subObjectiveFieldsToUpdate) {
                    if (!allowedFieldsForAdmin.includes(field)) {
                        return res.status(403).json({ error: `Admin is not authorized to update the sub-objective field: ${field}` });
                    }
                }
            }
        }
    } else if (role === 'employee') {
        // Employees can only modify the gradeEmployee field in both the objective and subObjectives
        const objectiveFieldsToUpdate = Object.keys(updateData);
        
        for (let field of objectiveFieldsToUpdate) {
            if (!allowedFieldsForEmployee.includes(field) && field !== 'subObjectives') {
                return res.status(403).json({ error: `Employee is not authorized to update the field: ${field}` });
            }
        }

        if (updateData.subObjectives && Array.isArray(updateData.subObjectives)) {
            for (let subObjective of updateData.subObjectives) {
                const subObjectiveFieldsToUpdate = Object.keys(subObjective);

                for (let field of subObjectiveFieldsToUpdate) {
                    if (!allowedFieldsForEmployee.includes(field)) {
                        return res.status(403).json({ error: `Employee is not authorized to update the sub-objective field: ${field}` });
                    }
                }
            }
        }
    } else {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
    }

    // If all checks pass, allow the request to proceed
    next();
};

const verifyAuthenticityOfEmployee = async (req, res, next) => {
    const { role } = req.user;
    const { id } = req.params;

    if (role === 'employee' && req.user.id !== id) {
        return res.status(403).json({ error: 'You are not authorized to perform this action.' });
    }
    next();
};

module.exports = { restrictDeadlineUpdate, verifyUpdateAccessForObjectives, verifyAuthenticityOfEmployee };