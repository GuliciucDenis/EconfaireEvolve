const Objective = require('../models/objectiveModel');
const User = require('../models/userModel');

const getAllObjectives = async () => {
    return await Objective.find();
};

const getObjectiveById = async (id) => {
    return await Objective.findById(id);
};

const createObjective = async (objectiveData) => {
    userId = objectiveData.assignedTo;
    currentObjectives = await User.findById(userId).objectiveList;
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
    return await Objective.findByIdAndUpdate(id, updateData);
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
