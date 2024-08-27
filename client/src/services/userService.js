import axios from 'axios';
import getJwt from './jwtService';
import {jwtDecode} from 'jwt-decode';

export const getUsers = async () => {
    const token = getJwt();
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.users.map(user => ({
            ...user,
            id: user._id,
            _id: undefined
        }));
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const getUserById = async () => {
    const token = getJwt(); // Assumed function to get the JWT token

    try {
        if (!token) {
            throw new Error('No token found');
        }

        // Decode the JWT token to extract the user ID
        const decodedToken = jwtDecode(token); // Decode the JWT
        const userId = decodedToken.id; // Extract the ID from the decoded token

        if (!userId) {
            throw new Error('User ID not found in token');
        }

        // Make the API call to fetch the user data by ID
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        return response.data.user;
    } catch (error) {
        console.error('Error fetching user by ID:', error);
        throw error;
    }
};

export const createUser = async (user) => {
    const token = getJwt();
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/auth/register`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const updateUser = async (user) => {
    const token = getJwt();
    const response = await axios.put(`${process.env.API_URL}/users/${user.id}`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};

export const deleteUser = async (id) => {
    const token = getJwt();
    const response = await axios.delete(`${process.env.API_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};







