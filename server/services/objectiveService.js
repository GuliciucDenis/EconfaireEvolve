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
    console.log("Test");
    console.log("Obiectivul este: ",updateData);
    console.log("Obiectivul are id-ul: ",id);
    // If there are subObjectives in the update data, calculate the mean grades
    if (updateData.subObjectives && Array.isArray(updateData.subObjectives) && updateData.subObjectives.length > 0) {
        let totalGradeEmployee = 0;
        let totalGradeAdmin = 0;
        let subObjectiveCount = updateData.subObjectives.length;

        console.log(subObjectiveCount);

        console.log("Obiectivul are subobiectivele: ",updateData.subObjectives);

        // Assuming updateData.subobjectives is an array of strings or values that need conversion
        const parsedSubObjectives = updateData.subObjectives.map(item => ({ 
            ...item, 
            gradeAdmin: parseInt(item.gradeAdmin, 10), 
            gradeEmployee: parseInt(item.gradeEmployee, 10) 
        }));

        console.log(parsedSubObjectives);
        
        let gradedSubobjectiveCountEmployee = 0;
        let gradedSubobjectiveCountAdmin = 0;
        // Calculate the total grades for subObjectives
        for (let subObjective of parsedSubObjectives) {

            console.log("Nota angajat: ",subObjective.gradeEmployee);

            if (subObjective.gradeEmployee !== undefined && subObjective.gradeEmployee > 1) {
                totalGradeEmployee += subObjective.gradeEmployee;

                console.log(totalGradeEmployee);

                gradedSubobjectiveCountEmployee++;

                console.log(gradedSubobjectiveCountEmployee);
            }

            console.log("Nota admin: ",subObjective.gradeAdmin);

            if (subObjective.gradeAdmin !== undefined && subObjective.gradeAdmin > 1) {
                totalGradeAdmin += subObjective.gradeAdmin;

                console.log(totalGradeAdmin);

                gradedSubobjectiveCountAdmin++;

                console.log(gradedSubobjectiveCountAdmin);
            }
        }

        if (gradedSubobjectiveCountEmployee === subObjectiveCount && gradedSubobjectiveCountAdmin === subObjectiveCount)
        {
            console.log("Testareeee:")
            // Calculate the mean grades
            updateData.gradeEmployee = subObjectiveCount > 0 ? parseFloat((totalGradeEmployee / subObjectiveCount).toFixed(2)) : 0;


            console.log(updateData.gradeEmployee);

            updateData.gradeAdmin = subObjectiveCount > 0 ? parseFloat((totalGradeAdmin / subObjectiveCount).toFixed(2)) : 0;

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
