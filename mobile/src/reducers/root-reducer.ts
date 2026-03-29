import { combineReducers } from '@reduxjs/toolkit';
import apiReducer from '../slices/api-slice';
import productsReducer from '../slices/products-slice';

const rootReducer = combineReducers({
    api: apiReducer,
    products: productsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
