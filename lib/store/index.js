import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiActionReducer from "./slices/UIaction";
import adminReducer from "./slices/adminSlice";
import subscriptionReducer from "./slices/subscriptionSlice";
import storeSetupReducer from "./slices/storeSetupSlice";
import catalogReducer from "./slices/catalogSlice";
import notificationReducer from "./slices/notificationSlice";
import leadReducer from "./slices/leadSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    uiAction: uiActionReducer,
    admin: adminReducer,
    subscriptions: subscriptionReducer,
    storeSetup: storeSetupReducer,
    catalog: catalogReducer,
    lead: leadReducer,
    notifications: notificationReducer,
  },
});
