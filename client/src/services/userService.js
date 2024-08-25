import axios from 'axios';
import getJwt from './jwtService';

export const getUsers = async () => {
    const token = getJwt();
    console.log('API URL:', process.env.REACT_APP_API_URL); // Add this line for debugging
    console.log(token);
    try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

export const createUser = async (user) => {
    const token = getJwt();
    const response = await axios.post(`${process.env.API_URL}/users`, user, {
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







