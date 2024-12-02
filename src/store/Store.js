// import storage from "redux-persist/lib/storage";
// import authReducer from "./slices/authSlice";
// import persistReducer from "redux-persist/es/persistReducer";
// import { configureStore } from "@reduxjs/toolkit";
// import persistStore from "redux-persist/es/persistStore";

// // Configuration object for redux-persist
// const persistConfig = {
//   key: "root",
//   storage,
// };

// // Create a persisted reducer using the authReducer & persistConfig (persisted Reducers)
// const persistedReducer = persistReducer(persistConfig, authReducer);

// // Configure the redux store
// const store = configureStore({
//   reducer: {
//     auth: persistedReducer,
//   },
// });

// // Create a persistor linked to the store to manage persistence
// export const persistor = persistStore(store);

// // Export the configured store as the default export
// export default store;
