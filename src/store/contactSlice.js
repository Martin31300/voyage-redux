import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { toList } from "../utils/normalize.js";

export const sendContact = apiThunk("contact/send", async (form, token) =>
  request("/api/contact/store.php", { method: "POST", body: form, token }),
);

export const fetchContacts = apiThunk("contact/fetchAll", async (_, token) => {
  const data = await request("/api/contact/index.php", { token });
  return toList(data, "contacts", "contact_requests");
});

const contactSlice = createSlice({
  name: "contact",
  initialState: { items: [], status: "idle", error: null, sendStatus: "idle", sendError: null },
  reducers: {
    resetSend(state) {
      state.sendStatus = "idle";
      state.sendError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendContact.pending, (state) => {
        state.sendStatus = "loading";
        state.sendError = null;
      })
      .addCase(sendContact.fulfilled, (state) => {
        state.sendStatus = "succeeded";
      })
      .addCase(sendContact.rejected, (state, action) => {
        state.sendStatus = "failed";
        state.sendError = action.payload || action.error.message;
      })
      .addCase(fetchContacts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase("auth/logout", (state) => {
        state.items = [];
        state.status = "idle";
      });
  },
});

export const { resetSend } = contactSlice.actions;
export default contactSlice.reducer;
