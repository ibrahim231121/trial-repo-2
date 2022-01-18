import {configureStore } from '@reduxjs/toolkit';
import {reducer} from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore } from 'redux';


const persistConfig = {
  key: 'timerReducers',
  storage: storage,
  whitelist: ['timerReducers','cultureReducer'] // which reducer want to store
};

const persistedReducer = persistReducer(persistConfig, reducer);
const store = configureStore({
  reducer: persistedReducer,
  // devTools: process.env.NODE_ENV !== 'production',
  // middleware: [thunk]
});


export default store;

