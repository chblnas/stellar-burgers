import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';

import { TIngredient } from '@utils-types';
import { getIngredientsApi } from '@api';
import { INGREDIENTS_SLICE_NAME } from '../sliceNames';

interface TIngredientState {
  data: TIngredient[];
  isLoading: boolean;
  error: null | string;
}

export const initialState: TIngredientState = {
  data: [],
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  `${INGREDIENTS_SLICE_NAME}/fetchIngredients`,
  async () => getIngredientsApi()
);

const ingredientSlice = createSlice({
  name: INGREDIENTS_SLICE_NAME,
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.data,
    selectIngredientsIsLoading: (state) => state.isLoading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ингредиентов';
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  }
});

export const { selectIngredients, selectIngredientsIsLoading } =
  ingredientSlice.selectors;
export default ingredientSlice;
