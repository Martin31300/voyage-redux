import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import {
  normalizeDestination,
  normalizeRegion,
  toList,
  toObject,
} from "../utils/normalize.js";

const loadList = async () => {
  const data = await request("/api/destinations/index.php");
  return toList(data, "destinations").map(normalizeDestination);
};

export const fetchRegions = apiThunk("destinations/fetchRegions", async () => {
  const data = await request("/api/regions/index.php");
  return toList(data, "regions").map(normalizeRegion);
});

export const fetchDestinations = apiThunk("destinations/fetchAll", loadList);

export const fetchDestination = apiThunk("destinations/fetchOne", async (slug) => {
  const data = await request("/api/destinations/show.php", { params: { slug } });
  return normalizeDestination(toObject(data, "destination"));
});

export const fetchDestinationsByRegion = apiThunk("destinations/fetchByRegion", async (region) => {
  const data = await request("/api/destinations/by-region.php", { params: { region } });
  return toList(data, "destinations").map(normalizeDestination);
});

export const createDestination = apiThunk("destinations/create", async (form, token) => {
  await request("/api/destinations/store.php", { method: "POST", body: form, token });
  return loadList();
});

export const deleteDestination = apiThunk("destinations/delete", async (id, token) => {
  await request("/api/destinations/delete.php", { method: "POST", body: { id }, token });
  return id;
});

const initialState = {
  items: [],
  regions: [],
  current: null,
  regionItems: [],
  status: "idle",
  currentStatus: "idle",
  regionStatus: "idle",
  error: null,
};

const failure = (key) => (state, action) => {
  state[key] = "failed";
  state.error = action.payload || action.error.message;
};

const destinationsSlice = createSlice({
  name: "destinations",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegions.fulfilled, (state, action) => {
        state.regions = action.payload;
      })
      .addCase(fetchDestinations.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchDestinations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchDestinations.rejected, failure("status"))
      .addCase(fetchDestination.pending, (state) => {
        state.currentStatus = "loading";
        state.current = null;
        state.error = null;
      })
      .addCase(fetchDestination.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchDestination.rejected, failure("currentStatus"))
      .addCase(fetchDestinationsByRegion.pending, (state) => {
        state.regionStatus = "loading";
        state.error = null;
      })
      .addCase(fetchDestinationsByRegion.fulfilled, (state, action) => {
        state.regionStatus = "succeeded";
        state.regionItems = action.payload;
      })
      .addCase(fetchDestinationsByRegion.rejected, failure("regionStatus"))
      .addCase(createDestination.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteDestination.fulfilled, (state, action) => {
        state.items = state.items.filter((d) => d.id !== action.payload);
      });
  },
});

export default destinationsSlice.reducer;
