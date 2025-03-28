import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/lib/features/auth/authSlice";
import orderReducer from "@/lib/features/orders/orderSlice";
import chatReducer from "@/lib/features/chat/chatSlice";

export const store = configureStore({
  reducer: {
    orders: orderReducer,
    auth: authReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
