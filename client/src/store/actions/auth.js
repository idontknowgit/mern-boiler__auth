import { LOGIN_REQUEST } from "../constants";

export const login = (payload, isRegistering = false) => ({
  type: LOGIN_REQUEST,
  payload,
  isRegistering
});
