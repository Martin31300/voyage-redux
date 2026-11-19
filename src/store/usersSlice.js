import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { normalizeUser, toList } from "../utils/normalize.js";

export const fetchUsers = apiThunk("users/fetchAll", async (_, token) => {
  const data = await request("/api/users/index.php", { token });
  return toList(data, "users").map(normalizeUser);
});

export const updateProfile = apiThunk("users/updateProfile", async (form, token) =>
  request("/api/profile/update.php", { method: "POST", body: form, token }),
);

export const changePassword = apiThunk("users/changePassword", async (form, token) =>
  request("/api/profile/change-password.php", { method: "POST", body: form, token }),
);

export const adminChangePassword = apiThunk("users/adminChangePassword", async (form, token) =>
  request("/api/users/change-password.php", { method: "POST", body: form, token }),
);

const usersSlice = createSlice({
  name: "users",
  initialState: { items: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase("auth/logout", (state) => {
        state.items = [];
        state.status = "idle";
      });
  },
});

export default usersSlice.reducer;
