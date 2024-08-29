import axios from "axios";
import { getUserIdFromToken } from "./userService";
import { getJwt } from "./jwtService";

export const getObjectivesByUserToken = async (userId) => {
  const token = getJwt();
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${userId}/objectives`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.objectives;
  } catch (error) {
    console.error("Error fetching objectives:", error);
    throw error;
  }
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


