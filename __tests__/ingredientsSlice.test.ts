import ingredientSlice, {
  initialState,
  fetchIngredients,
  selectIngredients,
  selectIngredientsIsLoading
} from '../src/services/slices/ingredients/ingredientsSlice';

import { INGREDIENTS_SLICE_NAME } from '../src/services/slices/sliceNames';

import { TIngredient } from '../src/utils/types';

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка тестовая',
    type: 'bun',
    proteins: 10,
    fat: 20,
    carbohydrates: 30,
    calories: 200,
    price: 100,
    image: 'bun.png',
    image_mobile: 'bun-mobile.png',
    image_large: 'bun-large.png'
  }
];

describe('ingredientSlice', () => {
  const reducer = ingredientSlice.reducer;

  describe('fetchIngredients', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(initialState, fetchIngredients.pending('pending'));

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.data).toEqual([]);
    });

    it('fulfilled сохраняет ингредиенты и снимает isLoading', () => {
      const state = reducer(
        initialState,
        fetchIngredients.fulfilled(mockIngredients, 'fulfilled')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.data).toEqual(mockIngredients);
    });

    it('rejected сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('Ошибка загрузки ингредиентов');
      const state = reducer(
        initialState,
        fetchIngredients.rejected(error, 'rejected')
      );

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
      expect(state.data).toEqual([]);
    });

    it('rejected без message использует fallback', () => {
      const state = reducer(
        initialState,
        fetchIngredients.rejected(
          { name: 'TestError', message: undefined } as any,
          'rejected'
        )
      );
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
      expect(state.data).toEqual([]);
    });
  });

  describe('тесты селекторов', () => {
    const state = {
      [INGREDIENTS_SLICE_NAME]: {
        data: mockIngredients,
        isLoading: true,
        error: null
      }
    };

    it('selectIngredients возвращает список ингредиентов', () => {
      expect(selectIngredients(state)).toEqual(mockIngredients);
    });

    it('selectIngredientsIsLoading возвращает состояние загрузки', () => {
      expect(selectIngredientsIsLoading(state)).toBe(true);
    });
  });
});
