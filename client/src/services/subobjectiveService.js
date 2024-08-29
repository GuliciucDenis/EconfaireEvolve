import {getObjectiveById, updateObjective} from './objectiveService';

export const addSubobjectiveByObjectiveId = async (objectiveId, subobjective) => {
  const objective = await getObjectiveById(objectiveId);
  objective.subObjectives.push(subobjective);
  await updateObjective(objective);
};

export const getSubobjectivesByObjectiveId = async (objectiveId) => {
  const objective = await getObjectiveById(objectiveId);
  return objective.subObjectives;
};

export const removeSubobjectiveByObjectiveId= async (objectiveId, subobjective) => {
    const objective = await getObjectiveById(objectiveId);
    // objective.subObjectives.remove(subobjective);
    // await updateObjective(objective);
};

