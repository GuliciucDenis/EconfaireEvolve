import { getObjectiveById, updateObjective } from './objectiveService';

export const addSubobjectiveByObjectiveId = async (objectiveId, subobjective) => {
  const objective = await getObjectiveById(objectiveId);
  objective.subObjectives.push(subobjective);
  await updateObjective({ id: objective.id, subObjectives: objective.subObjectives });
};

export const getSubobjectivesByObjectiveId = async (objectiveId) => {
  const objective = await getObjectiveById(objectiveId);
  return objective.subObjectives;
};

export const removeSubobjectiveByObjectiveId = async (objectiveId, subobjectiveToRemove) => {
  const objective = await getObjectiveById(objectiveId);
  console.log(subobjectiveToRemove);
  objective.subObjectives = objective.subObjectives.filter(subobjective => subobjective.title !== subobjectiveToRemove);

  await updateObjective(objective);
};

export const gradeSubobjectiveByObjectiveId = async (objectiveId, subobjectiveToGrade, grade, role, currentUserId) => {
  const objective = await getObjectiveById(objectiveId);

  // Update the specific subobjective's grade based on the role
  objective.subObjectives = objective.subObjectives.map(subobjective => {
    if (subobjective.title === subobjectiveToGrade) {
      // If admin grades, check if they are grading themselves
      if (role === "admin" && objective.assignedTo === currentUserId) {
        // Set gradeEmployee equal to gradeAdmin only if admin is evaluating themselves
        return { ...subobjective, gradeAdmin: grade, gradeEmployee: grade };
      }
      // If admin grades but not their own subobjective, only update gradeAdmin
      if (role === "admin") {
        return { ...subobjective, gradeAdmin: grade };
      }
      // If employee grades, update only gradeEmployee
      return { ...subobjective, gradeEmployee: grade };
    }
    return subobjective;
  });

  // Check if all subobjectives are graded by both admin and employee
  const allGraded = objective.subObjectives.every(sub =>
    (role === "admin" && sub.gradeAdmin > 1) ||
    (role === "employee" && sub.gradeAdmin > 1 && sub.gradeEmployee > 1)
  );

  if (allGraded) {
    const adminGrades = objective.subObjectives.map(sub => sub.gradeAdmin);
    const employeeGrades = objective.subObjectives.map(sub => sub.gradeEmployee);
    objective.gradeAdmin = adminGrades.reduce((a, b) => a + b, 0) / adminGrades.length;

    // Update gradeEmployee based on role and grading context
    if (role === "employee") {
      objective.gradeEmployee = employeeGrades.reduce((a, b) => a + b, 0) / employeeGrades.length;
    } else if (role === "admin" && objective.assignedTo === currentUserId) {
      // If the admin is evaluating themselves, keep the average equal
      objective.gradeEmployee = objective.gradeAdmin;
    } else {
      // Keep gradeEmployee as it is if not specifically set
      objective.gradeEmployee = objective.gradeEmployee > 1 ? objective.gradeEmployee : 1;
    }
  } else {
    // Keep placeholder grades to ensure the objective stays active
    objective.gradeAdmin = objective.gradeAdmin > 1 ? objective.gradeAdmin : 1;
    objective.gradeEmployee = objective.gradeEmployee > 1 ? objective.gradeEmployee : 1;
  }

  // Update the objective to reflect the new grades
  await updateObjective(objective);
  return objective;
};
