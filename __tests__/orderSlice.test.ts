import orderSlice, {
  initialState,
  createOrder,
  fetchOrder,
  fetchOrders,
  clearOrderData,
  selectNewOrderData,
  selectNewOrderRequest,
  selectOrderDataByNumber,
  selectOrderRequestByNumber,
  selectOrdersData,
  selectOrdersRequest
} from '../src/services/slices/order/orderSlice';

import * as api from '../src/utils/burger-api';

import { ORDER_SLICE_NAME } from '../src/services/slices/sliceNames';
import { TOrder } from '../src/utils/types';

type TNewOrderResponse = {
  success: boolean;
  order: TOrder;
  name: string;
};

const newOrderMock: TOrder = {
  _id: '1',
  number: 101,
  status: 'done',
  name: 'Test Order',
  ingredients: ['a', 'b'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const ordersMock: TOrder[] = [
  newOrderMock,
  { ...newOrderMock, _id: '2', number: 102 }
];

const mockOrderResponse: TNewOrderResponse = {
  success: true,
  order: newOrderMock,
  name: 'Test Order'
};

describe('orderSlice', () => {
  const reducer = orderSlice.reducer;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createOrder', () => {
    it('pending устанавливает isNewOrderLoading = true и newOrderError = null', () => {
      const state = reducer(
        initialState,
        createOrder.pending('pending', ['a', 'b'])
      );
      expect(state.isNewOrderLoading).toBe(true);
      expect(state.newOrderError).toBeNull();
      expect(state.newOrderData).toBeNull();
    });

    it('fulfilled сохраняет newOrderData и сбрасывает загрузку', () => {
      const payload = { order: newOrderMock };
      const state = reducer(
        initialState,
        createOrder.fulfilled(payload, 'fulfilled', ['a', 'b'])
      );
      expect(state.isNewOrderLoading).toBe(false);
      expect(state.newOrderError).toBeNull();
      expect(state.newOrderData).toEqual(newOrderMock);
    });

    it('rejected устанавливает newOrderError и сбрасывает загрузку', () => {
      const error = new Error('Ошибка создания заказа');
      const state = reducer(
        initialState,
        createOrder.rejected(error, 'rejected', ['a', 'b'])
      );
      expect(state.isNewOrderLoading).toBe(false);
      expect(state.newOrderError?.message).toBe('Ошибка создания заказа');
    });
  });

  describe('fetchOrder', () => {
    it('pending устанавливает isOrderByNumberLoading = true и orderByNumberError = null', () => {
      const state = reducer(initialState, fetchOrder.pending('pending', 101));
      expect(state.isOrderByNumberLoading).toBe(true);
      expect(state.orderByNumberError).toBeNull();
      expect(state.orderByNumberData).toBeNull();
    });

    it('fulfilled сохраняет orderByNumberData и сбрасывает загрузку', () => {
      const state = reducer(
        initialState,
        fetchOrder.fulfilled(newOrderMock, 'fulfilled', 101)
      );
      expect(state.isOrderByNumberLoading).toBe(false);
      expect(state.orderByNumberError).toBeNull();
      expect(state.orderByNumberData).toEqual(newOrderMock);
    });

    it('rejected устанавливает orderByNumberError и сбрасывает загрузку', () => {
      const error = new Error('Ошибка получения заказа');
      const state = reducer(
        initialState,
        fetchOrder.rejected(error, 'rejected', 101)
      );
      expect(state.isOrderByNumberLoading).toBe(false);
      expect(state.orderByNumberError?.message).toBe('Ошибка получения заказа');
    });
  });

  describe('fetchOrders', () => {
    it('pending устанавливает isOrdersLoading = true и ordersError = null', () => {
      const state = reducer(initialState, fetchOrders.pending('pending'));
      expect(state.isOrdersLoading).toBe(true);
      expect(state.ordersError).toBeNull();
      expect(state.ordersData).toEqual([]);
    });

    it('fulfilled сохраняет ordersData и сбрасывает загрузку', () => {
      const state = reducer(
        initialState,
        fetchOrders.fulfilled(ordersMock, 'fulfilled')
      );
      expect(state.isOrdersLoading).toBe(false);
      expect(state.ordersError).toBeNull();
      expect(state.ordersData).toEqual(ordersMock);
    });

    it('rejected устанавливает ordersError и сбрасывает загрузку', () => {
      const error = new Error('Ошибка получения заказов');
      const state = reducer(
        initialState,
        fetchOrders.rejected(error, 'rejected')
      );
      expect(state.isOrdersLoading).toBe(false);
      expect(state.ordersError?.message).toBe('Ошибка получения заказов');
    });
  });

  describe('тесты редьюсеров', () => {
    it('clearOrderData сбрасывает newOrderData и isNewOrderLoading', () => {
      const stateWithData = {
        ...initialState,
        newOrderData: newOrderMock,
        isNewOrderLoading: true
      };
      const state = reducer(stateWithData, clearOrderData());
      expect(state.newOrderData).toBeNull();
      expect(state.isNewOrderLoading).toBe(false);
    });
  });

  describe('тесты createOrder', () => {
    it('fulfilled сохраняет newOrderData', async () => {
      jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(mockOrderResponse);

      const state = reducer(
        initialState,
        createOrder.fulfilled(mockOrderResponse, 'fulfilled', ['a', 'b'])
      );

      expect(state.newOrderData).toEqual(newOrderMock);
      expect(state.isNewOrderLoading).toBe(false);
      expect(state.newOrderError).toBeNull();
    });

    it('rejected сохраняет ошибку', async () => {
      const error = new Error('Ошибка создания заказа');
      jest.spyOn(api, 'orderBurgerApi').mockRejectedValue(error);

      const state = reducer(
        initialState,
        createOrder.rejected(error, 'rejected', ['a', 'b'])
      );

      expect(state.isNewOrderLoading).toBe(false);
      expect(state.newOrderError?.message).toBe('Ошибка создания заказа');
    });

    it('если response.success = false, вызывает rejectWithValue', async () => {
      const failResponse = { success: false, order: newOrderMock, name: '' };
      jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(failResponse);

      const thunk = createOrder(['a', 'b']);
      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await thunk(dispatch, getState, undefined);
      expect(result).toEqual(
        expect.objectContaining({ type: 'orders/createOrder/rejected' })
      );
    });
  });

  describe('тесты fetchOrder', () => {
    it('fulfilled сохраняет orderByNumberData', () => {
      const state = reducer(
        initialState,
        fetchOrder.fulfilled(newOrderMock, 'fulfilled', 101)
      );
      expect(state.orderByNumberData).toEqual(newOrderMock);
      expect(state.isOrderByNumberLoading).toBe(false);
      expect(state.orderByNumberError).toBeNull();
    });

    it('rejected сохраняет orderByNumberError', () => {
      const error = new Error('Ошибка получения заказа');
      const state = reducer(
        initialState,
        fetchOrder.rejected(error, 'rejected', 101)
      );
      expect(state.isOrderByNumberLoading).toBe(false);
      expect(state.orderByNumberError?.message).toBe('Ошибка получения заказа');
    });

    it('если response.success = false, вызывает rejectWithValue', async () => {
      const failResponse = { success: false, orders: [newOrderMock] };
      jest.spyOn(api, 'getOrderByNumberApi').mockResolvedValue(failResponse);

      const thunk = fetchOrder(101);
      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await thunk(dispatch, getState, undefined);
      expect(result).toEqual(
        expect.objectContaining({ type: 'orders/fetchOrder/rejected' })
      );
    });
  });

  describe('тесты fetchOrders', () => {
    it('fulfilled сохраняет ordersData', () => {
      const state = reducer(
        initialState,
        fetchOrders.fulfilled(ordersMock, 'fulfilled')
      );
      expect(state.ordersData).toEqual(ordersMock);
      expect(state.isOrdersLoading).toBe(false);
      expect(state.ordersError).toBeNull();
    });

    it('rejected сохраняет ordersError', () => {
      const error = new Error('Ошибка получения заказов');
      const state = reducer(
        initialState,
        fetchOrders.rejected(error, 'rejected')
      );
      expect(state.isOrdersLoading).toBe(false);
      expect(state.ordersError?.message).toBe('Ошибка получения заказов');
    });

    it('если API возвращает ошибку, вызывает rejectWithValue', async () => {
      const error = new Error('Ошибка получения заказов');
      jest.spyOn(api, 'getOrdersApi').mockRejectedValue(error);

      const dispatch = jest.fn();
      const getState = jest.fn();

      const result = await fetchOrders()(dispatch, getState, undefined);

      expect(result.type).toBe('orders/fetchOrders/rejected');

      if (fetchOrders.rejected.match(result)) {
        expect(result.error.message).toBe('Ошибка получения заказов');
      }
    });
  });

  describe('тесты селекторов', () => {
    const state = {
      [ORDER_SLICE_NAME]: {
        ...initialState,
        newOrderData: newOrderMock,
        isNewOrderLoading: true,
        orderByNumberData: newOrderMock,
        isOrderByNumberLoading: true,
        ordersData: ordersMock,
        isOrdersLoading: true
      }
    };

    it('selectNewOrderData возвращает newOrderData', () => {
      expect(selectNewOrderData(state)).toEqual(newOrderMock);
    });

    it('selectNewOrderRequest возвращает isNewOrderLoading', () => {
      expect(selectNewOrderRequest(state)).toBe(true);
    });

    it('selectOrderDataByNumber возвращает orderByNumberData', () => {
      expect(selectOrderDataByNumber(state)).toEqual(newOrderMock);
    });

    it('selectOrderRequestByNumber возвращает isOrderByNumberLoading', () => {
      expect(selectOrderRequestByNumber(state)).toBe(true);
    });

    it('selectOrdersData возвращает ordersData', () => {
      expect(selectOrdersData(state)).toEqual(ordersMock);
    });

    it('selectOrdersRequest возвращает isOrdersLoading', () => {
      expect(selectOrdersRequest(state)).toBe(true);
    });
  });
});
