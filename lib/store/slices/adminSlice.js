import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: { admin: null, token: null },
  reducers: {
    setAdminCredentials: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
    },
    adminLogout: (state) => {
      state.admin = null;
      state.token = null;
      localStorage.removeItem("adminToken");
    },
  },
});

export const { setAdminCredentials, adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
