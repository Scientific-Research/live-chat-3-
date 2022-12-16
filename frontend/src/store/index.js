import { createStore, compose, combineReducers, applyMiddleware } from "redux";
// import {
//   configureStore,
//   compose,
//   combineReducers,
//   applyMiddleware,
// } from "@reduxjs/toolkit";

import thunkMiddleware from "redux-thunk";
import { authReducer } from "./reducers/authReducer";

const rootReducer = combineReducers({
  auth: authReducer,
});

const middleware = [thunkMiddleware];

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);
// import { configureStore } from '@reduxjs/toolkit'
// const store = configureStore({
//   reducer: {},
// })
// export default store;

export default store;
