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
  const objectiveUpdatableData = Object.fromEntries(Object.entries(objective).filter(([key,value]) => key!=="id"));
  const response = await axios.put(`${process.env.REACT_APP_API_URL}/objectives/${objective.id}`, objectiveUpdatableData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
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