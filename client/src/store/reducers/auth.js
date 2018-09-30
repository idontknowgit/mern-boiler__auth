import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../constants";

export const initialState = {
  authenticated: false,
  user: {},
  inProgress: false
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case LOGIN_REQUEST:
      return { ...state, inProgress: true };

    case LOGIN_SUCCESS:
      return {
        ...state,
        authenticated: true,
        user: payload,
        inProgress: false
      };

    case LOGIN_FAILURE:
      return { ...state, inProgress: false };
    default:
      return state;
  }
};
