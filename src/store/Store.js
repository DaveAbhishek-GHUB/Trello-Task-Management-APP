import storage from "redux-persist/lib/storage";
import userReducer from "./slices/userSlice";
import persistReducer from "redux-persist/es/persistReducer";
import { configureStore } from "@reduxjs/toolkit";
import persistStore from "redux-persist/es/persistStore";

// Configuration object for redux-persist
const persistConfig = {
  key: "root",
  storage,
};

// Create a persisted reducer using the authReducer & persistConfig (persisted Reducers)
const persistedReducer = persistReducer(persistConfig, userReducer);

// Configure the redux store
const store = configureStore({
  reducer: {
    user: persistedReducer,
  },
});

// Create a persistor linked to the store to manage persistence
export const persistor = persistStore(store);

// Export the configured store as the default export
export default store;
