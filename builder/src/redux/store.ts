import { combineReducers, configureStore} from '@reduxjs/toolkit';
import panelSlice from "./panelSlice.ts";

const rootReducer = combineReducers({
    panel: panelSlice
});
const store = configureStore({
    reducer: rootReducer
});
export default store