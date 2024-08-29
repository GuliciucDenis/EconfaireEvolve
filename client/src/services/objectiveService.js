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