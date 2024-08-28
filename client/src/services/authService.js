import { jwtDecode } from "jwt-decode";
import { getJwt } from "./jwtService";

export const getUserRoleFromToken = () => {
  const token = getJwt();
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.role;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};