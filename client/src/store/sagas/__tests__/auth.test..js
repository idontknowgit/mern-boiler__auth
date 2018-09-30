import { call, put, fork, take, cancel, takeLatest } from "redux-saga/effects";
import { delay } from "redux-saga";
import { createMockTask } from "redux-saga/utils";

import saga, * as workers from "../auth";
import api from "../../../modules/api";
import { setAuthToken, removeAuthToken } from "../../../modules/auth";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from "../../constants";

describe("auth saga", () => {
  const response = {
    data: {
      payload: { token: "fake-token" }
    }
  };
  const error = {
    response: {
      data: {
        error: { message: "error message " }
      }
    }
  };

  describe("login worker", () => {
    const action = { payload: { email: "email" } };

    it("handles successful login", () => {
      const worker = workers.login(action);

      expect(worker.next().value).toEqual(
        call(api.post, "/api/auth", action.payload)
      );
      expect(worker.next(response).value).toEqual(
        fork(setAuthToken, response.data.payload.token)
      );
      expect(worker.next(response).value).toEqual(
        put({ type: LOGIN_SUCCESS, payload: response.data.payload })
      );
    });

    it("handles unsuccessful login", () => {
      const worker = workers.login(action);

      worker.next();
      expect(worker.throw(error).value).toEqual(
        put({ type: LOGIN_FAILURE, payload: error.response.data.error })
      );
    });

    it("changes endpoint if registering", () => {
      action.isRegistering = true;
      const worker = workers.login(action);

      expect(worker.next().value).toEqual(
        call(api.post, "/api/auth/register", action.payload)
      );
    });
  });

  describe("refreshSession worker", () => {
    it("handles successful refresh", () => {
      const delayMS = 500;
      const worker = workers.refreshSession(delayMS);

      expect(worker.next().value).toEqual(call(delay, delayMS));
      expect(worker.next().value).toEqual(call(api.get, "/api/auth"));
      expect(worker.next(response).value).toEqual(
        fork(setAuthToken, response.data.payload.token)
      );
      expect(worker.next(response).value).toEqual(
        put({
          type: LOGIN_SUCCESS,
          payload: response.data.payload,
          skipTracking: true
        })
      );
    });

    it("handles unsuccessful refresh", () => {
      const worker = workers.refreshSession();
      worker.next();
      expect(worker.throw(error).value).toEqual(put({ type: LOGOUT }));
    });
  });

  describe("maintainAuthSession worker", () => {
    it("calls a delayed refreshSession && cancels it if user logs out", () => {
      const worker = workers.maintainAuthSession();
      const refresh = createMockTask();

      expect(worker.next().value).toEqual(
        fork(workers.refreshSession, 1000 * 60 * 60)
      );
      expect(worker.next(refresh).value).toEqual(take(LOGOUT));
      expect(worker.next().value).toEqual(fork(removeAuthToken));
      expect(worker.next().value).toEqual(cancel(refresh));
    });
  });

  describe("auth saga", () => {
    it("watches for login requests & maintains the auth session", () => {
      const authSaga = saga();

      expect(authSaga.next().value).toEqual(
        takeLatest(LOGIN_REQUEST, workers.login)
      );
      expect(authSaga.next().value).toEqual(
        takeLatest(LOGIN_SUCCESS, workers.maintainAuthSession)
      );
    });
  });
});
