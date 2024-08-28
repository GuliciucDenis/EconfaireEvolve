import { jwtDecode } from "jwt-decode";

export const getJwt = () => {
    return document.cookie.split('; ').find(row => row.startsWith('jwt=')).split('=')[1];
};

export const getUseRoleFromToken = () => {
    const token = getJwt();
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
};