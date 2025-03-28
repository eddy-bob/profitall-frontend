import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  ActionReducerMapBuilder,
} from "@reduxjs/toolkit";
import { authApi } from "../../api";

interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }) => {
    const response = await authApi.login(credentials);
    return response.data;
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (userData: { email: string; password: string; name: string }) => {
    const response = await authApi.register(userData);
    return response.data;
  }
);

export const getCurrentUser = createAsyncThunk("auth/me", async () => {
  const response = await authApi.getProfile();
  return response.data;
});

export const repopulateUser = createAsyncThunk(
  "auth/repopulateUser",
  async () => {
    const response = await authApi.getProfile();

    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state: AuthState) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state: AuthState) => {
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder
      // Login
      .addCase(login.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(login.rejected, (state: AuthState, action: any) => {
        state.loading = false;
        state.error = action.error.message || "Login failed";
      })
      // Register
      .addCase(register.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (
          state: AuthState,
          action: PayloadAction<{ user: User; token: string }>
        ) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addCase(register.rejected, (state: AuthState, action: any) => {
        state.loading = false;
        state.error = action.error.message || "Registration failed";
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state: AuthState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getCurrentUser.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
        }
      )
      .addCase(getCurrentUser.rejected, (state: AuthState, action: any) => {
        state.loading = false;
        state.error = action.error.message || "Failed to get user data";
      })
      // Repopulate User
      .addCase(
        repopulateUser.fulfilled,
        (state: AuthState, action: PayloadAction<User>) => {
          console.log("Repopulated user", action.payload);
          state.user = action.payload;
        }
      )
      .addCase(repopulateUser.rejected, (state: AuthState, action) => {
        state.user = null;
        state.error = action.error.message || "Failed to repopulate user";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
