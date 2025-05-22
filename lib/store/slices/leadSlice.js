import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "@/lib/api";

// Submit lead generation form
export const submitLead = createAsyncThunk(
  "lead/submitLead",
  async (leadData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("Submit Lead Token:", token); // Debug token
      const response = await axios.post(`${BASE_URL}/leads/submit`, leadData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.lead;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to submit lead"
      );
    }
  }
);

// Fetch all leads (for admin)
export const fetchAllLeads = createAsyncThunk(
  "lead/fetchAllLeads",
  async ({ page = 1, limit = 10 }, { getState, rejectWithValue }) => {
    try {
      const token = getState().admin.token; 
      console.log("Fetch All Leads Token:", token); // Debug token
      if (!token) {
        throw new Error("No token found");
      }
      const params = new URLSearchParams({ page, limit });
      const response = await axios.get(
        `${BASE_URL}/leads?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch leads"
      );
    }
  }
);

// Fetch single lead by ID (for admin)
export const fetchLeadById = createAsyncThunk(
  "lead/fetchLeadById",
  async (leadId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      console.log("Fetch Lead by ID Token:", token); // Debug token
      const response = await axios.get(`${BASE_URL}/leads/${leadId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch lead"
      );
    }
  }
);

const leadSlice = createSlice({
  name: "lead",
  initialState: {
    leads: [],
    currentLead: null,
    total: 0,
    page: 1,
    pages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    resetLeadState: (state) => {
      state.leads = [];
      state.currentLead = null;
      state.total = 0;
      state.page = 1;
      state.pages = 1;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Lead
      .addCase(submitLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitLead.fulfilled, (state, action) => {
        state.loading = false;
        state.leads.push(action.payload);
      })
      .addCase(submitLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch All Leads
      .addCase(fetchAllLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.pages = action.payload.pages || 1;
      })
      .addCase(fetchAllLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Lead by ID
      .addCase(fetchLeadById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentLead = action.payload;
      })
      .addCase(fetchLeadById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetLeadState } = leadSlice.actions;
export default leadSlice.reducer;
