import store, { RootState, rootReducer } from '../src/services/store';
import { initialState as ingredientsInitial } from '../src/services/slices/ingredients/ingredientsSlice';
import { initialState as userInitial } from '../src/services/slices/user/userSlice';
import { initialState as constructorInitial } from '../src/services/slices/burgerConstructor/burgerConstructorSlice';
import { initialState as orderInitial } from '../src/services/slices/order/orderSlice';
import { initialState as feedInitial } from '../src/services/slices/feed/feedSlice';

import {
  INGREDIENTS_SLICE_NAME,
  USER_SLICE_NAME,
  BURGER_CONSTRUCTOR_SLICE_NAME,
  ORDER_SLICE_NAME,
  FEED_SLICE_NAME
} from '../src/services/slices/sliceNames';

describe('rootReducer', () => {
  it('должен корректно инициализировать начальное состояние', () => {
    const state: RootState = store.getState();

    expect(state[INGREDIENTS_SLICE_NAME]).toEqual(ingredientsInitial);
    expect(state[USER_SLICE_NAME]).toEqual(userInitial);
    expect(state[BURGER_CONSTRUCTOR_SLICE_NAME]).toEqual(constructorInitial);
    expect(state[ORDER_SLICE_NAME]).toEqual(orderInitial);
    expect(state[FEED_SLICE_NAME]).toEqual(feedInitial);
  });

  it('возвращает корректное начальное состояние при неизвестном экшене', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(state[INGREDIENTS_SLICE_NAME]).toEqual(ingredientsInitial);
    expect(state[USER_SLICE_NAME]).toEqual(userInitial);
    expect(state[BURGER_CONSTRUCTOR_SLICE_NAME]).toEqual(constructorInitial);
    expect(state[ORDER_SLICE_NAME]).toEqual(orderInitial);
    expect(state[FEED_SLICE_NAME]).toEqual(feedInitial);
  });
});
