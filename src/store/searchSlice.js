import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { normalizeDestination, toList } from "../utils/normalize.js";

export const searchDestinations = apiThunk("search/run", async ({ keyword, region }) => {
  const data = await request("/api/destinations/search.php", { params: { keyword, region } });
  return toList(data, "destinations").map(normalizeDestination);
});

const searchSlice = createSlice({
  name: "search",
  initialState: { results: [], status: "idle", error: null },
  reducers: {
    clearSearch(state) {
      state.results = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDestinations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(searchDestinations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.results = action.payload;
      })
      .addCase(searchDestinations.rejected, (state, action) => {
        state.status = "failed";
        state.results = [];
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearSearch } = searchSlice.actions;
export default searchSlice.reducer;
