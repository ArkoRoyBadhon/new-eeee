import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/lib/api";

// Create catalog
export const createCatalog = createAsyncThunk(
  "catalog/createCatalog",
  async (catalogData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      formData.append("catalogName", catalogData.catalogName);
      formData.append("categories", JSON.stringify(catalogData.categories));
      formData.append("subCategories", JSON.stringify(catalogData.subCategories));
      formData.append("image", catalogData.image);

      const response = await axios.post(`${BASE_URL}/catalog/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.catalog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create catalog"
      );
    }
  }
);

// Edit catalog
export const editCatalog = createAsyncThunk(
  "catalog/editCatalog",
  async (catalogData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const formData = new FormData();
      formData.append("catalogId", catalogData.catalogId);
      formData.append("catalogName", catalogData.catalogName);
      formData.append("categories", JSON.stringify(catalogData.categories));
      formData.append("subCategories", JSON.stringify(catalogData.subCategories));
      if (catalogData.image) {
        formData.append("image", catalogData.image);
      }

      const response = await axios.put(`${BASE_URL}/catalog/edit`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data.catalog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update catalog"
      );
    }
  }
);

// Fetch catalog status
export const fetchCatalogStatus = createAsyncThunk(
  "catalog/fetchCatalogStatus",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/catalog/status`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch catalog status"
      );
    }
  }
);

// Fetch all catalogs for a seller
export const fetchCatalogs = createAsyncThunk(
  "catalog/fetchCatalogs",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.get(`${BASE_URL}/catalog/catalogs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.catalogs;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch catalogs"
      );
    }
  }
);

// Fetch all catalogs (for admin)
export const fetchAllCatalogs = createAsyncThunk(
  "catalog/fetchAllCatalogs",
  async ({ page = 1, limit = 10, status = "" }, { getState, rejectWithValue }) => {
    try {
      const token = getState().admin.token;
      const params = new URLSearchParams({ page, limit });
      if (status) {
        params.append("status", status);
      }
      const response = await axios.get(`${BASE_URL}/catalog/all?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all catalogs"
      );
    }
  }
);

// Update catalog status (for admin)
export const updateCatalogStatus = createAsyncThunk(
  "catalog/updateCatalogStatus",
  async ({ catalogId, status, rejectionReasons = [] }, { getState, rejectWithValue }) => {
    try {
      const token = getState().admin.token;
      const response = await axios.put(
        `${BASE_URL}/catalog/status`,
        { catalogId, status, rejectionReasons },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.catalog;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update catalog status"
      );
    }
  }
);

// Delete a catalog (for seller)
export const deleteCatalog = createAsyncThunk(
  "catalog/deleteCatalog",
  async (catalogId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await axios.delete(`${BASE_URL}/catalog/delete/${catalogId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return { catalogId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete catalog"
      );
    }
  }
);

const catalogSlice = createSlice({
  name: "catalog",
  initialState: {
    catalogs: [],
    status: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    resetCatalogState: (state) => {
      state.catalogs = [];
      state.status = null;
      state.total = 0;
      state.page = 1;
      state.pages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Catalog
      .addCase(createCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogs.push(action.payload);
      })
      .addCase(createCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit Catalog
      .addCase(editCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editCatalog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCatalog = action.payload;
        const index = state.catalogs.findIndex(
          (catalog) => catalog._id === updatedCatalog._id
        );
        if (index !== -1) {
          state.catalogs[index] = updatedCatalog;
        }
      })
      .addCase(editCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Catalog Status
      .addCase(fetchCatalogStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalogStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogs = action.payload.catalogs;
      })
      .addCase(fetchCatalogStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Seller's Catalogs
      .addCase(fetchCatalogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalogs.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogs = action.payload;
      })
      .addCase(fetchCatalogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Catalogs (Admin)
      .addCase(fetchAllCatalogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCatalogs.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogs = action.payload.catalogs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAllCatalogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Catalog Status (Admin)
      .addCase(updateCatalogStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCatalogStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedCatalog = action.payload;
        const index = state.catalogs.findIndex(
          (catalog) => catalog._id === updatedCatalog._id
        );
        if (index !== -1) {
          state.catalogs[index] = updatedCatalog;
        }
      })
      .addCase(updateCatalogStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Catalog (Seller)
      .addCase(deleteCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.catalogs = state.catalogs.filter(
          (catalog) => catalog._id !== action.payload.catalogId
        );
      })
      .addCase(deleteCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCatalogState } = catalogSlice.actions;
export default catalogSlice.reducer;