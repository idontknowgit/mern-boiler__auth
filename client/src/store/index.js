import { createStore, applyMiddleware, compose } from "redux";
import { routerMiddleware } from "react-router-redux";
import createHistory from "history/createBrowserHistory";
import createSagaMiddleware from "redux-saga";

import rootReducer from "./reducers";
import rootSaga from "./sagas";

export const history = createHistory();
const sagaMiddleware = createSagaMiddleware();

const configureStore = () => {
  const middleware = [sagaMiddleware, routerMiddleware(history)];

  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    middleware.push(require("redux-logger").logger);
  }

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(...middleware),
      window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  sagaMiddleware.run(rootSaga);

  return store;
};

export default configureStore;
