import { getFeedsApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { FEED_SLICE_NAME } from '@slices/sliceNames';
import { TOrdersData } from '@utils-types';

interface TFeedState {
  data: TOrdersData;
  isLoading: boolean;
  error: SerializedError | null;
}

const initialState: TFeedState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk<TOrdersData>(
  `${FEED_SLICE_NAME}/fetchFeeds`,
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: FEED_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectFeedData: (state) => state.data,
    selectFeedIsLoading: (state) => state.isLoading,
    selectFeedError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.error = null;
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.data = action.payload;
        state.error = null;
        state.isLoading = false;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      });
  }
});

export const { selectFeedData, selectFeedError, selectFeedIsLoading } =
  feedSlice.selectors;
export default feedSlice;
