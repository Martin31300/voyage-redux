import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import contactReducer from "./contactSlice.js";
import destinationsReducer from "./destinationsSlice.js";
import commentsReducer from "./commentsSlice.js";
import favoritesReducer from "./favoritesSlice.js";
import usersReducer from "./usersSlice.js";
import searchReducer from "./searchSlice.js";
import themeReducer from "./themeSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    destinations: destinationsReducer,
    comments: commentsReducer,
    favorites: favoritesReducer,
    users: usersReducer,
    search: searchReducer,
    theme: themeReducer,
  },
});
