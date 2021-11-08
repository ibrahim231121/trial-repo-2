import {configureStore } from '@reduxjs/toolkit';
import {reducer} from './rootReducer';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { createStore } from 'redux';


const persistConfig = {
  key: 'timerReducers',
  storage: storage,
  whitelist: ['timerReducers'] // which reducer want to store
};

const pReducer = persistReducer(persistConfig,reducer);
const store = createStore(pReducer);
const persistor = persistStore(store);
//exporting Actions

 
export { persistor, store };