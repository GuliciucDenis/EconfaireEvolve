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
  const objective = await getObjectiveById(objectiveId);
  
  // Update the specific subobjective's grade based on the role
  objective.subObjectives = objective.subObjectives.map(subobjective => 
    subobjective.title === subobjectiveToGrade 
      ? { ...subobjective, [role === "admin" ? "gradeAdmin" : "gradeEmployee"]: grade } 
      : subobjective
  );
  
  // Check if all subobjectives are graded by both admin and employee
  const allGraded = objective.subObjectives.every(sub => sub.gradeAdmin > 1 && sub.gradeEmployee > 1);
  
  if (allGraded) {
    const adminGrades = objective.subObjectives.map(sub => sub.gradeAdmin);
    const employeeGrades = objective.subObjectives.map(sub => sub.gradeEmployee);
    objective.gradeAdmin = adminGrades.reduce((a, b) => a + b, 0) / adminGrades.length;
    objective.gradeEmployee = employeeGrades.reduce((a, b) => a + b, 0) / employeeGrades.length;
  } else {
    // Keep the objective grades as placeholders to ensure it stays active
    objective.gradeAdmin = objective.gradeAdmin > 1 ? objective.gradeAdmin : 1;
    objective.gradeEmployee = objective.gradeEmployee > 1 ? objective.gradeEmployee : 1;
  }

  // Update the objective to reflect the new grades
  await updateObjective(objective);
  return objective;
};



