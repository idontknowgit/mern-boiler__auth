import jwtDecode from "jwt-decode";

export const setAuthToken = token => {
  localStorage && localStorage.setItem("authToken", token);
};

export const removeAuthToken = () => {
  localStorage && localStorage.removeItem("authToken");
};

export const getAuthToken = () => {
  try {
    const token = localStorage && localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const buffer = 1000 * 60;

    if (Date.now() <= decoded.exp * 1000 + buffer) {
      return token;
    }

    removeAuthToken();
    return null;
  } catch (err) {
    removeAuthToken();
    return null;
  }
};
