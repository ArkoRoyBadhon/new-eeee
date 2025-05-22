import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { subscriptionApi } from "../../api";

const initialState = {
  subscriptions: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

// Async thunk for requesting a subscription (seller action)
export const requestSubscription = createAsyncThunk(
  "subscriptions/requestSubscription",
  async (plan, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;
      if (!token) {
        throw new Error("Authentication required");
      }
      const response = await subscriptionApi.requestSubscription(plan, token);
      return response;
    } catch (error) {
      console.error("Request Subscription Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for fetching subscription requests (admin action)
export const fetchSubscriptionRequests = createAsyncThunk(
  "subscriptions/fetchSubscriptionRequests",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { admin } = getState();
      const token = admin.token;
      if (!token) {
        throw new Error("Admin authentication required");
      }
      const response = await subscriptionApi.getSubscriptionRequests(token);
      console.log("Fetched Subscriptions:", response.subscriptions);
      return response.subscriptions || [];
    } catch (error) {
      console.error("Fetch Subscription Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for managing (approve/reject) a subscription (admin action)
export const manageSubscription = createAsyncThunk(
  "subscriptions/manageSubscription",
  async ({ id, status }, { getState, rejectWithValue }) => {
    try {
      const { admin } = getState();
      const token = admin.token;
      if (!token) {
        throw new Error("Admin authentication required");
      }
      const response = await subscriptionApi.manageSubscription(id, status, token);
      return response;
    } catch (error) {
      console.error("Manage Subscription Error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Request Subscription
    builder
      .addCase(requestSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(requestSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(requestSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Fetch Subscription Requests
    builder
      .addCase(fetchSubscriptionRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSubscriptionRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchSubscriptionRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Manage Subscription
    builder
      .addCase(manageSubscription.pending, (state) => {
        state.status = "loading";
      })
      .addCase(manageSubscription.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.subscriptions = state.subscriptions.map((sub) =>
          sub._id === action.payload.subscription._id ? action.payload.subscription : sub
        );
        state.error = null;
      })
      .addCase(manageSubscription.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;