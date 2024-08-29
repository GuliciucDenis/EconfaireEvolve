import {getObjectiveById} from './objectiveService';

export const getSubobjectivesByObjectiveId = async (objectiveId) => {
  const objective = await getObjectiveById(objectiveId);
  return objective.subobjectives;
};