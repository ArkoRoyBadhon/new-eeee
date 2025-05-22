import { createSlice } from "@reduxjs/toolkit";

// const toggleDrawer = () => setIsDrawerOpen(!isDrawerOpen);
// const closeDrawer = () => setIsDrawerOpen(false);

const initialState = {
  //   toggleDrawer,
  isDrawerOpen: false,
  //   closeDrawer,
  // windowDimension: window.innerWidth,
};

const UIActionSlice = createSlice({
  name: "uiAction",
  initialState,
  reducers: {
    toggleDrawer: (state) => {
      state.isDrawerOpen = !state.isDrawerOpen;
    },
    closeDrawer: (state) => {
      state.isDrawerOpen = false;
    },
  },
});

export const { toggleDrawer, closeDrawer } = UIActionSlice.actions;
export default UIActionSlice.reducer;
