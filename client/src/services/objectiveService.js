import axios from "axios";
import { getUserIdFromToken } from "./userService";
import { getJwt } from "./jwtService";

export const createObjective = async (objective) => {
  const token = getJwt();
  console.log(objective);
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/objectives`,
    objective,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    ...response.data.objective,
    id: response.data.objective._id,
    _id: undefined,
  }; 
};

export const getObjectivesByUserToken = async () => {
  const userId = await getUserIdFromToken();
  const token = getJwt();
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user.objectiveList;
};

export const getObjectivesByUserId = async (userId) => {
  const token = getJwt();
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/users/${userId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.user.objectiveList;
};

export const getObjectiveById = async (id) => {
  const token = getJwt();
  const response = await axios.get(
    `${process.env.REACT_APP_API_URL}/objectives/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return {
    ...response.data.objective,
    id: response.data.objective._id,
    _id: undefined,
  }; 
};

export const deleteObjectiveById = async (id) => {
  const token = getJwt();
  const response = await axios.delete(`${process.env.REACT_APP_API_URL}/objectives/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateObjective = async (objective) => {
  const token = getJwt();
  const objectiveUpdatableData = Object.fromEntries(Object.entries(objective).filter(([key, value]) => key !== "id"));
  
  // Only calculate overall grades if all subobjectives are graded by both admin and employee
  if (objective.subObjectives && objective.subObjectives.every(sub => sub.gradeAdmin > 1 && sub.gradeEmployee > 1)) {
    const adminGrades = objective.subObjectives.map(sub => sub.gradeAdmin);
    const employeeGrades = objective.subObjectives.map(sub => sub.gradeEmployee);
    objectiveUpdatableData.gradeAdmin = adminGrades.reduce((a, b) => a + b, 0) / adminGrades.length;
    objectiveUpdatableData.gradeEmployee = employeeGrades.reduce((a, b) => a + b, 0) / employeeGrades.length;
  } else {
    // Ensure the grades remain valid if subobjectives are not fully graded
    objectiveUpdatableData.gradeAdmin = objective.gradeAdmin > 1 ? objective.gradeAdmin : 1;
    objectiveUpdatableData.gradeEmployee = objective.gradeEmployee > 1 ? objective.gradeEmployee : 1;
  }

  const response = await axios.put(
    `${process.env.REACT_APP_API_URL}/objectives/${objective.id}`, 
    objectiveUpdatableData, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};


export const getAverageObjectiveGradeByUserId = async (userId) => {
    const token = getJwt();
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const objectives = response.data.user.objectiveList;
    console.log(objectives);
    const objectivesGrades = await Promise.all(objectives.map(
        async (objectiveId) => {
            const objectiveData = await getObjectiveById(objectiveId);
            const gradeEmployee = objectiveData.gradeEmployee;
            const gradeAdmin = objectiveData.gradeAdmin;
            return (gradeEmployee + gradeAdmin) / 2;
        }
    ));
    console.log(objectivesGrades);
    const averageGrade = objectivesGrades.reduce((sum, grade) => sum + grade, 0) / objectivesGrades.length;
    return averageGrade;
};

export const updateObjectiveStatus = async (objectiveId, status) => {
  try {
    const token = getJwt();
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/objectives/${objectiveId}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status !== 200) {
      throw new Error('Failed to update objective status');
    }
    return response.data;
  } catch (error) {
    console.error('Error updating objective status:', error);
    throw error;
  }
};