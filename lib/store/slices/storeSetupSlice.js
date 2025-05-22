import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/lib/api";

// Async thunk to fetch store status
export const fetchStoreStatus = createAsyncThunk(
  "storeSetup/fetchStoreStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/store/status`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store status"
      );
    }
  }
);

// Async thunk to fetch store details
export const fetchStoreDetails = createAsyncThunk(
  "storeSetup/fetchStoreDetails",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/store/details`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store details"
      );
    }
  }
);

// Async thunk to fetch all stores (for admin)
export const fetchAllStores = createAsyncThunk(
  "storeSetup/fetchAllStores",
  async (
    { page = 1, limit = 10, status = "" },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().admin.token;
      const response = await axios.get(`${BASE_URL}/store/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit, status },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stores"
      );
    }
  }
);

// for user
export const fetchAllStoresForAll = createAsyncThunk(
  "storeSetup/fetchAllStores",
  async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/store/all-for-user`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: { page, limit },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch stores"
      );
    }
  }
);

// Async thunk to update store status (for admin)
export const updateStoreStatus = createAsyncThunk(
  "storeSetup/updateStoreStatus",
  async (
    { storeId, status, rejectionReasons = [] },
    { getState, rejectWithValue }
  ) => {
    try {
      const token = getState().admin.token;
      const response = await axios.put(
        `${BASE_URL}/store/status`,
        { storeId, status, rejectionReasons },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update store status"
      );
    }
  }
);

// Async thunk to update store
export const updateStore = createAsyncThunk(
  "storeSetup/updateStore",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.put(`${BASE_URL}/store/update`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update store"
      );
    }
  }
);

// Async thunk to fetch top verified exporters (public)
export const fetchTopVerifiedExporters = createAsyncThunk(
  "storeSetup/fetchTopVerifiedExporters",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/store/top-verified-exporters`);
      return response.data.stores || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top verified exporters"
      );
    }
  }
);

// Async thunk to fetch store by ID (public)
export const fetchStoreById = createAsyncThunk(
  "storeSetup/fetchStoreById",
  async (storeId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/store/${storeId}`);
      return response.data.store;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch store details"
      );
    }
  }
);

const storeSetupSlice = createSlice({
  name: "storeSetup",
  initialState: {
    status: null,
    store: null,
    stores: [],
    total: 0,
    page: 1,
    pages: 1,
    topStores: [],
    selectedStore: null, // Added for storing store details by ID
    loading: false,
    error: null,
  },
  reducers: {
    clearStoreStatus: (state) => {
      state.status = null;
      state.store = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Store Status
      .addCase(fetchStoreStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.status = action.payload.status;
        state.rejectionReasons = action.payload.rejectionReasons || [];
      })
      .addCase(fetchStoreStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Store Details
      .addCase(fetchStoreDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload.store;
        state.status = action.payload.store.status;
        state.editableFields = action.payload.editableFields || [];
      })
      .addCase(fetchStoreDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Stores
      .addCase(fetchAllStores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStores.fulfilled, (state, action) => {
        state.loading = false;
        state.stores = action.payload.stores;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAllStores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Store Status
      .addCase(updateStoreStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStoreStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedStore = action.payload.store;
        const index = state.stores.findIndex(
          (store) => store._id === updatedStore._id
        );
        if (index !== -1) {
          state.stores[index] = updatedStore;
        }
      })
      .addCase(updateStoreStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Store
      .addCase(updateStore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStore.fulfilled, (state, action) => {
        state.loading = false;
        state.store = action.payload.store;
        state.status = action.payload.store.status;
      })
      .addCase(updateStore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Top Verified Exporters
      .addCase(fetchTopVerifiedExporters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopVerifiedExporters.fulfilled, (state, action) => {
        state.loading = false;
        state.topStores = action.payload;
      })
      .addCase(fetchTopVerifiedExporters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.topStores = [];
      })
      // Fetch Store by ID
      .addCase(fetchStoreById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStoreById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStore = action.payload;
      })
      .addCase(fetchStoreById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.selectedStore = null;
      });
  },
});

export const { clearStoreStatus } = storeSetupSlice.actions;
export default storeSetupSlice.reducer;
