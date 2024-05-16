// store.js
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './reducers/authReducer'; // Assuming you have a combined rootReducer

const persistConfig = {
  key: 'KF',
  storage,
  whitelist: ['token', 'googleToken','isAuthenticated'], // Ensure both tokens are part of the persist whitelist

};

const persistedReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

const persistor = persistStore(store);

export { store, persistor };
