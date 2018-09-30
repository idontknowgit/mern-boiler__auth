import { LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE } from "../../constants";
import reducer, { initialState } from "../auth";

describe("auth reducer", () => {
  it("handles LOGIN_REQUEST", () => {
    expect(reducer(undefined, { type: LOGIN_REQUEST })).toEqual({
      ...initialState,
      inProgress: true
    });
  });

  it("handles LOGIN_SUCCESS", () => {
    const action = { type: LOGIN_SUCCESS, payload: { email: "test@test.com" } };

    expect(reducer(undefined, action)).toEqual({
      ...initialState,
      inProgress: false,
      user: action.payload,
      authenticated: true
    });
  });

  it("handles LOGIN_FAILURE", () => {
    expect(reducer(undefined, { type: LOGIN_FAILURE })).toEqual({
      ...initialState,
      inProgress: false
    });
  });
});
