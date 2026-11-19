import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { normalizeFavorite, toList } from "../utils/normalize.js";

const loadFavorites = async (token) => {
  const data = await request("/api/favorites/index.php", { token });
  return toList(data, "favorites").map(normalizeFavorite);
};

export const fetchFavorites = apiThunk("favorites/fetch", (_, token) => loadFavorites(token));

export const addFavorite = apiThunk("favorites/add", async (destination, token) => {
  await request("/api/favorites/store.php", {
    method: "POST",
    token,
    body: {
      destinationId: destination.id,
      title: destination.name,
      image: destination.image,
    },
  });
  return loadFavorites(token);
});

export const removeFavorite = apiThunk("favorites/remove", async (destinationId, token) => {
  await request("/api/favorites/delete.php", {
    method: "POST",
    token,
    body: { destinationId },
  });
  return destinationId;
});

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (f) => String(f.destinationId) !== String(action.payload),
        );
      })
      .addCase("auth/logout", (state) => {
        state.items = [];
        state.status = "idle";
      });
  },
});

export default favoritesSlice.reducer;
