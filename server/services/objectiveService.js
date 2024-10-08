const Objective = require('../models/objectiveModel');
const User = require('../models/userModel');

const getAllObjectives = async () => {
    return await Objective.find();
};

const getObjectiveById = async (id) => {
    return await Objective.findById(id);
};

const createObjective = async (objectiveData) => {
    console.log(objectiveData);
    userId = objectiveData.assignedTo;
    user = await User.findById(userId);
    console.log(user);
    currentObjectives = user.objectiveList;


    if (!currentObjectives) {
        currentObjectives = [];
    }

    const objective = new Objective(objectiveData);
    objectiveId = (await objective.save())._id;
    currentObjectives.push(objectiveId);
    await User.findByIdAndUpdate(userId, { objectiveList: currentObjectives });
    return objective;
};

const updateObjectiveById = async (id, updateData) => {
    // If there are subObjectives in the update data, calculate the mean grades
    if (updateData.subObjectives && Array.isArray(updateData.subObjectives) && updateData.subObjectives.length > 0) {
        let totalGradeEmployee = 0;
        let totalGradeAdmin = 0;
        let subObjectiveCount = updateData.subObjectives.length;
        let gradedSubobjectiveCount = 0;

        // Calculate the total grades for subObjectives
        for (let subObjective of updateData.subObjectives) {
            if (subObjective.gradeEmployee !== undefined) {
                totalGradeEmployee += subObjective.gradeEmployee;
                if (subObjective.gradeEmployee > 1)
                    gradedSubobjectiveCount++;
            }
            if (subObjective.gradeAdmin !== undefined) {
                totalGradeAdmin += subObjective.gradeAdmin;
                if (subObjective.gradeAdmin > 1)
                    gradedSubobjectiveCount++;
            }
        }

        if (gradedSubobjectiveCount = subObjectiveCount * 2)
        {
        // Calculate the mean grades
            updateData.gradeEmployee = subObjectiveCount > 0 ? Math.round(totalGradeEmployee / subObjectiveCount) : 0;
            console.log(updateData.gradeEmployee);
            updateData.gradeAdmin = subObjectiveCount > 0 ? Math.round(totalGradeAdmin / subObjectiveCount) : 0;
            console.log(updateData.gradeAdmin);
        }
    }

    // Update the objective with the calculated mean grades
    return await Objective.findByIdAndUpdate(id, updateData, { new: true });
};


const deleteObjectiveById = async (id) => {
    userId = (await Objective.findById(id)).assignedTo;
    currentObjectives = (await User.findById(userId)).objectiveList;
    currentObjectives = currentObjectives.filter((objective) => objective != id);

    await User.findByIdAndUpdate(userId, { objectiveList: currentObjectives });

    return await Objective.findByIdAndDelete(id);
};

module.exports = {
    getAllObjectives,
    getObjectiveById,
    createObjective,
    updateObjectiveById,
    deleteObjectiveById
};
