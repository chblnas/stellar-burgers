import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
  SerializedError
} from '@reduxjs/toolkit';

import { USER_SLICE_NAME } from '@slices/sliceNames';

import { TUser } from '@utils-types';
import { saveTokens, removeTokens } from '@tokens';

interface TUserState {
  data: TUser | null;
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: SerializedError | null;
}

const initialState: TUserState = {
  data: null,
  isAuthChecked: false,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk<TUser, TLoginData>(
  `${USER_SLICE_NAME}/login`,
  async (data, { rejectWithValue }) => {
    const response = await loginUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    const { user, accessToken, refreshToken } = response;

    saveTokens(refreshToken, accessToken);

    return user;
  }
);

export const registerUser = createAsyncThunk<TUser, TRegisterData>(
  `${USER_SLICE_NAME}/register`,
  async (data, { rejectWithValue }) => {
    const response = await registerUserApi(data);

    if (!response.success) {
      return rejectWithValue(response);
    }

    const { user, accessToken, refreshToken } = response;

    saveTokens(refreshToken, accessToken);

    return user;
  }
);

export const logoutUser = createAsyncThunk(
  `${USER_SLICE_NAME}/logout`,
  async (_, { rejectWithValue }) => {
    const response = await logoutApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    removeTokens();
  }
);

export const fetchUser = createAsyncThunk(
  `${USER_SLICE_NAME}/fetchUser`,
  async (_, { rejectWithValue }) => {
    const response = await getUserApi();

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  `${USER_SLICE_NAME}/update`,
  async (data, { rejectWithValue }) => {
    const response = await updateUserApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.user;
  }
);

const userSlice = createSlice({
  name: USER_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectUser: (state) => state.data,
    selectAuthCheck: (state) => state.isAuthChecked,
    selectError: (state) => state.error,
    selectUserIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addMatcher(isPending, (state, action) => {
        if (action.type.startsWith(`${USER_SLICE_NAME}/`)) {
          state.isLoading = true;
          state.error = null;
        }
      })
      .addMatcher(isRejected, (state, action) => {
        if (action.type.startsWith(`${USER_SLICE_NAME}/`)) {
          state.isLoading = false;
          state.error = action.error;

          if (action.type === fetchUser.rejected.type) {
            state.isAuthChecked = true;
          }
        }
      });
  }
});

export const { selectUser, selectAuthCheck, selectError, selectUserIsLoading } =
  userSlice.selectors;
export default userSlice;
