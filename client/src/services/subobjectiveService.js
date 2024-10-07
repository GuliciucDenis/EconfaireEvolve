import { getObjectiveById, updateObjective } from './objectiveService';

export const addSubobjectiveByObjectiveId = async (objectiveId, subobjective) => {
  const objective = await getObjectiveById(objectiveId);
  // Adaugă subobiectivul cu descriere
  const newSubobjective = {
    title: subobjective.title,
    description: subobjective.description || '', // Asigură-te că descrierea este inclusă
    gradeAdmin: 1,
    gradeEmployee: 1
  };

  objective.subObjectives.push(newSubobjective);
  await updateObjective({ id: objective.id, subObjectives: objective.subObjectives });
};

export const getSubobjectivesByObjectiveId = async (objectiveId) => {
  const objective = await getObjectiveById(objectiveId);
  return objective.subObjectives;
};

export const removeSubobjectiveByObjectiveId = async (objectiveId, subobjectiveToRemove) => {
  const objective = await getObjectiveById(objectiveId);
  objective.subObjectives = objective.subObjectives.filter(subobjective => subobjective.title !== subobjectiveToRemove);
  await updateObjective(objective);
};

export const gradeSubobjectiveByObjectiveId = async (objectiveId, subobjectiveToGrade, grade, role, currentUserId) => {
  const objective = await getObjectiveById(objectiveId);

  // Check if the admin is grading themselves
  const isSelfEvaluation = role === "admin" && objective.assignedTo === currentUserId;

  console.log(isSelfEvaluation);
  console.log(objective.assignedTo);
  console.log(currentUserId);
  console.log(role);

  // Update the specific subobjective's grade based on the role and self-evaluation status
  objective.subObjectives = objective.subObjectives.map(subobjective => {
    if (subobjective.title === subobjectiveToGrade) {
      if (isSelfEvaluation) {
        // Set both grades when admin evaluates their own subobjectives
        return { ...subobjective, gradeAdmin: grade, gradeEmployee: grade };
      } else if (role === "admin") {
        // Update only gradeAdmin if admin is not evaluating themselves
        return { ...subobjective, gradeAdmin: grade };
      } else if (role === "employee") {
        // Update only gradeEmployee if employee is grading
        return { ...subobjective, gradeEmployee: grade };
      }
    }
    return subobjective;
  });
  console.log("Subobjectives:", objective.subObjectives);
  // Check if all subobjectives are graded by both admin and employee
  const allGraded = objective.subObjectives.every(sub =>
    sub.gradeAdmin > 1 && sub.gradeEmployee > 1
  );

  
  if (allGraded) {
    const adminGrades = objective.subObjectives.map(sub => parseInt(sub.gradeAdmin, 10));
    const employeeGrades = objective.subObjectives.map(sub => parseInt(sub.gradeEmployee, 10));
    console.log("NOTE ADMIN: ",adminGrades);
    console.log("NOTE EMPLOYEE: ",employeeGrades);
    objective.gradeAdmin = adminGrades.reduce((a, b) => a + b, 0) / adminGrades.length;

    // If it's self-evaluation, keep grades equal, otherwise update normally
    if (isSelfEvaluation) {
      objective.gradeEmployee = objective.gradeAdmin;
    } else {
      objective.gradeEmployee = employeeGrades.reduce((a, b) => a + b, 0) / employeeGrades.length;
    }
  } else {
    // Set default values to keep objective active
    objective.gradeAdmin = objective.gradeAdmin > 1 ? objective.gradeAdmin : 1;
    objective.gradeEmployee = objective.gradeEmployee > 1 ? objective.gradeEmployee : 1;
  }

  // Update the objective to reflect the new grades
  await updateObjective(objective);
  return objective;
};

export const updateSubobjectiveByObjectiveId = async (objectiveId, subobjectiveTitle, updatedSubobjective) => {
  const objective = await getObjectiveById(objectiveId);

  // Găsește și actualizează subobiectivul
  objective.subObjectives = objective.subObjectives.map(subobjective => {
    if (subobjective.title === subobjectiveTitle) {
      return {
        ...subobjective,
        title: updatedSubobjective.title,
        description: updatedSubobjective.description
      };
    }
    return subobjective;
  });

  // Actualizează obiectivul cu subobiectivele modificate
  await updateObjective({ id: objective.id, subObjectives: objective.subObjectives });

  return objective;
};

