const fetchUsers = async () => {
    const token = getJwt();
    const response = axios.get(`${process.env.API_URL}/users`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
};

const createUser = async (user) => {
    const token = getJwt();
    const response = axios.post(`${process.env.API_URL}/users`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
};

const updateUser = async (user) => {
    const token = getJwt();
    const response = axios.put(`${process.env.API_URL}/users/${user.id}`, user, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
};

const deleteUser = async (id) => {
    const token = getJwt();
    const response = axios.delete(`${process.env.API_URL}/users/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    const data = await response.json();
    return data;
};

export default { fetchUsers, createUser, updateUser, deleteUser };