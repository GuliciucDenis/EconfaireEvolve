import {getObjectiveById, updateObjective} from './objectiveService';

export const addSubobjectiveByObjectiveId = async (objectiveId, subobjective) => {
  const objective = await getObjectiveById(objectiveId);
  objective.subObjectives.push(subobjective);
  await updateObjective({id:objective.id, subObjectives: objective.subObjectives});
};

export const getSubobjectivesByObjectiveId = async (objectiveId) => {
  const objective = await getObjectiveById(objectiveId);
  return objective.subObjectives;
};

export const removeSubobjectiveByObjectiveId= async (objectiveId, subobjectiveToRemove) => {
    const objective = await getObjectiveById(objectiveId);
    console.log(subobjectiveToRemove);
    objective.subObjectives = objective.subObjectives.filter(subobjective => subobjective.title !== subobjectiveToRemove);

    await updateObjective(objective);
};

export const gradeSubobjectiveByObjectiveId = async (objectiveId, subobjectiveToGrade, grade, role) => {
    if (role === "admin") {
        const objective = await getObjectiveById(objectiveId);
        objective.subObjectives = objective.subObjectives.map(subobjective => subobjective.title === subobjectiveToGrade ? { ...subobjective, gradeAdmin: grade } : subobjective);
        await updateObjective(objective);
    }
    else if (role === "employee") {
        const objective = await getObjectiveById(objectiveId);
        objective.subObjectives = objective.subObjectives.map(subobjective => subobjective.title === subobjectiveToGrade ? { ...subobjective, gradeEmployee: grade } : subobjective);
        await updateObjective(objective);
    }
};


