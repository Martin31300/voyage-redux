import { createSlice } from "@reduxjs/toolkit";
import { apiThunk } from "./apiThunk.js";
import { request } from "../utils/api.js";
import { normalizeComment, toList } from "../utils/normalize.js";

const loadByDestination = async (destinationId) => {
  const data = await request("/api/comments/by-destination.php", {
    params: { destination_id: destinationId },
  });
  return toList(data, "comments").map(normalizeComment);
};

export const fetchCommentsByDestination = apiThunk("comments/fetchByDestination", (id) =>
  loadByDestination(id),
);

export const fetchMyComments = apiThunk("comments/fetchMine", async (_, token) => {
  const data = await request("/api/comments/by-user.php", { token });
  return toList(data, "comments").map(normalizeComment);
});

export const fetchAllComments = apiThunk("comments/fetchAll", async (_, token, getState) => {
  let destinations = getState().destinations.items;
  if (destinations.length === 0) {
    const data = await request("/api/destinations/index.php");
    destinations = toList(data, "destinations");
  }
  const lists = await Promise.all(
    destinations.map(async (d) => {
      const comments = await loadByDestination(d.id);
      return comments.map((c) => ({ ...c, destinationName: c.destinationName ?? d.name }));
    }),
  );
  return lists.flat();
});

export const createComment = apiThunk("comments/create", async (form, token) => {
  await request("/api/comments/store.php", { method: "POST", body: form, token });
  return loadByDestination(form.destination_id);
});

export const deleteComment = apiThunk("comments/delete", async (id, token) => {
  await request("/api/comments/delete.php", { method: "POST", body: { id }, token });
  return id;
});

const removeById = (list, id) => list.filter((c) => c.id !== id);

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    byDestination: [],
    mine: [],
    all: [],
    status: "idle",
    mineStatus: "idle",
    allStatus: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByDestination.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchCommentsByDestination.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.byDestination = action.payload;
      })
      .addCase(fetchCommentsByDestination.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchMyComments.pending, (state) => {
        state.mineStatus = "loading";
      })
      .addCase(fetchMyComments.fulfilled, (state, action) => {
        state.mineStatus = "succeeded";
        state.mine = action.payload;
      })
      .addCase(fetchMyComments.rejected, (state, action) => {
        state.mineStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(fetchAllComments.pending, (state) => {
        state.allStatus = "loading";
      })
      .addCase(fetchAllComments.fulfilled, (state, action) => {
        state.allStatus = "succeeded";
        state.all = action.payload;
      })
      .addCase(fetchAllComments.rejected, (state, action) => {
        state.allStatus = "failed";
        state.error = action.payload || action.error.message;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.byDestination = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.byDestination = removeById(state.byDestination, action.payload);
        state.mine = removeById(state.mine, action.payload);
        state.all = removeById(state.all, action.payload);
      })
      .addCase("auth/logout", (state) => {
        state.mine = [];
        state.all = [];
        state.mineStatus = "idle";
        state.allStatus = "idle";
      });
  },
});

export default commentsSlice.reducer;
