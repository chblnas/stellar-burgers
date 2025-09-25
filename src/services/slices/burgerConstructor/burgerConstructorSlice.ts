import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { BURGER_CONSTRUCTOR_SLICE_NAME } from '@slices/sliceNames';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface TConstructorState {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
}

export const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: BURGER_CONSTRUCTOR_SLICE_NAME,
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (data: TIngredient) => {
        const id = uuidv4();
        return { payload: { id, ...data } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ index: number; upwards: boolean }>
    ) => {
      const { index, upwards } = action.payload;
      const offset = upwards ? -1 : 1;
      const targetIndex = index + offset;

      if (targetIndex < 0 || targetIndex >= state.ingredients.length) {
        return;
      }

      [state.ingredients[index], state.ingredients[targetIndex]] = [
        state.ingredients[targetIndex],
        state.ingredients[index]
      ];
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  },
  selectors: {
    selectBurgerConstructor: (state) => state
  }
});

export const { selectBurgerConstructor } = burgerConstructorSlice.selectors;
export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice;
