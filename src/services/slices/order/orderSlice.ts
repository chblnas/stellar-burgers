import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { ORDER_SLICE_NAME } from '@slices/sliceNames';
import { TOrder } from '@utils-types';

interface TOrderState {
  newOrderData: TOrder | null;
  isNewOrderLoading: boolean;
  newOrderError: SerializedError | null;

  orderByNumberData: TOrder | null;
  isOrderByNumberLoading: boolean;
  orderByNumberError: SerializedError | null;

  ordersData: TOrder[];
  isOrdersLoading: boolean;
  ordersError: SerializedError | null;
}

const initialState: TOrderState = {
  newOrderData: null,
  isNewOrderLoading: false,
  newOrderError: null,

  orderByNumberData: null,
  isOrderByNumberLoading: false,
  orderByNumberError: null,

  ordersData: [],
  isOrdersLoading: false,
  ordersError: null
};

export const createOrder = createAsyncThunk(
  `${ORDER_SLICE_NAME}/createOrder`,
  async (data: string[], { rejectWithValue }) => {
    const response = await orderBurgerApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response;
  }
);

export const fetchOrder = createAsyncThunk<TOrder, number>(
  `${ORDER_SLICE_NAME}/fetchOrder`,
  async (data, { rejectWithValue }) => {
    const response = await getOrderByNumberApi(data);

    if (!response?.success) {
      return rejectWithValue(response);
    }

    return response.orders[0];
  }
);

export const fetchOrders = createAsyncThunk(
  `${ORDER_SLICE_NAME}/fetchOrders`,
  async () => await getOrdersApi()
);

export const orderSlice = createSlice({
  name: ORDER_SLICE_NAME,
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.newOrderData = null;
      state.isNewOrderLoading = false;
    }
  },
  selectors: {
    selectNewOrderData: (state) => state.newOrderData,
    selectNewOrderRequest: (state) => state.isNewOrderLoading,
    selectOrderDataByNumber: (state) => state.orderByNumberData,
    selectOrderRequestByNumber: (state) => state.isOrderByNumberLoading,
    selectOrdersData: (state) => state.ordersData,
    selectOrdersRequest: (state) => state.isOrdersLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isNewOrderLoading = true;
        state.newOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.newOrderError = null;
        state.isNewOrderLoading = false;
        state.newOrderData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isNewOrderLoading = false;
        state.newOrderError = action.error;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.isOrderByNumberLoading = true;
        state.orderByNumberError = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.orderByNumberData = action.payload;
        state.orderByNumberError = null;
        state.isOrderByNumberLoading = false;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.orderByNumberError = action.error;
        state.isOrderByNumberLoading = false;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.ordersError = null;
        state.isOrdersLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.ordersError = null;
        state.isOrdersLoading = false;
        state.ordersData = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.ordersError = action.error;
        state.isOrdersLoading = false;
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export const {
  selectNewOrderData,
  selectNewOrderRequest,
  selectOrderDataByNumber,
  selectOrderRequestByNumber,
  selectOrdersData,
  selectOrdersRequest
} = orderSlice.selectors;
export default orderSlice;
