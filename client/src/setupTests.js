import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

configure({ adapter: new Adapter() });

window.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};

export const mountWithStore = (component, store) => {
  return mount(
    <Provider store={store}>
      <MemoryRouter>{component}</MemoryRouter>
    </Provider>
  );
};

export const sleep = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
