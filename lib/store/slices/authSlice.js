import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  selectedRole: null, // 'buyer' | 'seller' | 'admin'
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.selectedRole = action.payload.selectedRole;
      state.status = "succeeded";
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.selectedRole = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state) => {
      state.status = "loading";
    },
    setRole: (state, action) => {
      state.selectedRole = action.payload;
    },
  },
});

export const { setCredentials, logout, clearError, setLoading, setRole } = authSlice.actions;
export default authSlice.reducer;