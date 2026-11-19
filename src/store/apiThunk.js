import { createAsyncThunk } from "@reduxjs/toolkit";

export const apiThunk = (type, handler) =>
  createAsyncThunk(type, async (arg, { getState, rejectWithValue }) => {
    try {
      return await handler(arg, getState().auth.token, getState);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  });
