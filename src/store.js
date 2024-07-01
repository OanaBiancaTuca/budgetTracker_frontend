import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./features/userSlice";
import transactionSlice from "./features/transactionSlice";
import accountSlice from "./features/accountSlice";
import categorySlice from "./features/categorySlice";
import budgetSlice from "./features/budgetSlice";
import logoutReducer from './features/logoutSlice';
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import goalSlice from "./features/goalSlice";
import chatbotReducer from "./features/chatbotSlice"; // Import corect pentru reducer-ul chatbot

const persistConfig = {
    key: "paymint",
    storage,
    blacklist: ["logout"],
};

const rootReducer = combineReducers({
    user: userSlice.reducer,
    account: accountSlice.reducer,
    category: categorySlice.reducer,
    transaction: transactionSlice,
    budget: budgetSlice.reducer,
    goal: goalSlice,
    logout: logoutReducer,
    chatbot: chatbotReducer // Adaugă chatbot reducer la root reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Dezactivare verificare de serializabilitate pentru acțiuni neserializabile
        }),
});

const persistor = persistStore(store);

export { store, persistor };