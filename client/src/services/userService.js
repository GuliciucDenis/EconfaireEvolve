import axios from "axios";
import { getJwt } from "./jwtService";
import { jwtDecode } from "jwt-decode";

export const getUsers = async () => {
  const token = getJwt();
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.users.map((user) => ({
      ...user,
      id: user._id,
      _id: undefined,
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getUser = async () => {
  const id = await getUserIdFromToken();
  return await getUserById(id);
};

export const getUserById = async (id) => {
  const token = getJwt(); // Assumed function to get the JWT token

  try {
    if (!token) {
      throw new Error("No token found");
    }

    // Make the API call to fetch the user data by ID
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      ...response.data.user,
      id: response.data.user._id,
      _id: undefined,
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  const token = getJwt();
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/users/auth/register`,
    user,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUser = async (user) => {
  const token = getJwt();
  try {
    if (!token) {
      throw new Error("No token found");
    }

    // Decode the JWT token to extract the user ID
    const decodedToken = jwtDecode(token); // Decode the JWT
    const userId = decodedToken.id; // Extract the ID from the decoded token

    console.log("Token:", token);
    console.log("Decoded Token:", decodedToken);
    console.log("User ID from token:", userId);

    if (!userId) {
      throw new Error("User ID not found in token");
    }

    // Make the API call to update the user data by ID
    const response = await axios.put(
      `${process.env.REACT_APP_API_URL}/users/${userId}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('THIS IS THE RESPONSE: ', response);
    return response.data.user;
  } catch (error) {
    // Moved the error handling code inside the catch block
    console.error("Error fetching user by ID:", error);

    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }

    throw error;
  }
};


export const deleteUser = async (id) => {
  const token = getJwt();
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_URL}/users/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
    }
    throw error;
  }
};

export const getUserIdFromToken = async () => {
  const token = getJwt();
  const decodedToken = jwtDecode(token);
  return decodedToken.id;
};

export const getUserObjectives = async (userId) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_URL}/users/${userId}/objectives`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching user objectives:", error);
    throw error;
  }
};
