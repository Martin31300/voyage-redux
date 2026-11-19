import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { decodeToken, normalizeUser } from "../utils/normalize.js";
import { updateProfile } from "./usersSlice.js";

const readUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const loginUser = apiThunk("auth/login", async (credentials) => {
  const data = await request("/api/auth/login.php", { method: "POST", body: credentials });
  const token = data?.token ?? data?.accessToken ?? data?.jwt ?? data?.data?.token;
  if (!token) throw new Error("Réponse de connexion inattendue");
  const payload = decodeToken(token);
  const claims = payload.user ?? payload.data ?? payload;
  const rawUser = data?.user ?? data?.data?.user ?? data;
  return { token, user: normalizeUser({ ...claims, ...rawUser }) };
});

export const registerUser = apiThunk("auth/register", async (form) =>
  request("/api/auth/register.php", { method: "POST", body: form }),
);

const initialState = {
  token: localStorage.getItem("token"),
  user: readUser(),
  status: "idle",
  error: null,
  registerStatus: "idle",
  registerError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearAuthErrors(state) {
      state.error = null;
      state.registerError = null;
      state.registerStatus = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = "loading";
        state.registerError = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.registerStatus = "succeeded";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = "failed";
        state.registerError = action.payload || action.error.message;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        const { avatar, ...rest } = action.meta.arg;
        state.user = { ...state.user, ...rest, avatar: avatar || state.user.avatar };
        localStorage.setItem("user", JSON.stringify(state.user));
      });
  },
});

export const { logout, clearAuthErrors } = authSlice.actions;
export default authSlice.reducer;
