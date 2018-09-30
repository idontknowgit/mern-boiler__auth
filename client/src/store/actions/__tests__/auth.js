import { LOGIN_REQUEST } from "../../constants";
import * as actions from "../auth";

describe("auth action creators", () => {
  describe("login", () => {
    const payload = { email: "test@test.com", password: "random123" };

    it("has correct output on login", () => {
      expect(actions.login(payload)).toEqual({
        type: LOGIN_REQUEST,
        payload,
        isRegistering: false
      });
    });

    it("has correct output on register", () => {
      expect(actions.login(payload, true)).toEqual({
        type: LOGIN_REQUEST,
        payload,
        isRegistering: true
      });
    });
  });
});
