import { call, put, cancel, takeLatest, take, fork } from "redux-saga/effects";
import { delay } from "redux-saga";

import api, { apiError } from "../../modules/api";
import { setAuthToken, removeAuthToken } from "../../modules/auth";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT
} from "../constants";

export default function* authSaga() {
  yield takeLatest(LOGIN_REQUEST, login);
  yield takeLatest(LOGIN_SUCCESS, maintainAuthSession);
}

export function* login({ payload, isRegistering }) {
  try {
    let endpoint = "/api/auth";
    if (isRegistering) {
      endpoint += "/register";
    }
    const response = yield call(api.post, endpoint, payload);

    yield fork(setAuthToken, response.data.payload.token);
    yield put({ type: LOGIN_SUCCESS, payload: response.data.payload });
  } catch (err) {
    yield put({ type: LOGIN_FAILURE, payload: apiError(err) });
  }
}

export function* refreshSession(delayMS = 0) {
  try {
    if (delayMS) {
      yield call(delay, delayMS);
    }
    const response = yield call(api.get, "/api/auth");

    yield fork(setAuthToken, response.data.payload.token);
    yield put({
      type: LOGIN_SUCCESS,
      payload: response.data.payload,
      skipTracking: true
    });
  } catch (err) {
    yield put({ type: LOGOUT });
  }
}

export function* maintainAuthSession() {
  const refreshDelay = 1000 * 60 * 60;
  const refresh = yield fork(refreshSession, refreshDelay);

  yield take(LOGOUT);
  yield fork(removeAuthToken);
  yield cancel(refresh);
}
