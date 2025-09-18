import burgerConstructorSlice, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
  selectBurgerConstructor
} from '../src/services/slices/burgerConstructor/burgerConstructorSlice';

import { BURGER_CONSTRUCTOR_SLICE_NAME } from '../src/services/slices/sliceNames';
import { TIngredient } from '../src/utils/types';

const reducer = burgerConstructorSlice.reducer;

const bunMock: TIngredient = {
  _id: 'bun1',
  name: 'Булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 50,
  image: 'bun.png',
  image_large: 'bun_large.png',
  image_mobile: 'bun_mobile.png'
};

const ingredientMock: TIngredient = {
  _id: 'sauce1',
  name: 'Соус',
  type: 'sauce',
  proteins: 2,
  fat: 1,
  carbohydrates: 3,
  calories: 15,
  price: 10,
  image: 'sauce.png',
  image_large: 'sauce_large.png',
  image_mobile: 'sauce_mobile.png'
};

describe('burgerConstructorSlice', () => {
  describe('добавление ингредиента', () => {
    it('добавляет булку', () => {
      const state = reducer(initialState, addIngredient(bunMock));
      expect(state.bun?.name).toBe('Булка');
      expect(state.ingredients).toHaveLength(0);
    });

    it('добавляет ингредиент', () => {
      const state = reducer(initialState, addIngredient(ingredientMock));
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0].name).toBe('Соус');
    });
  });

  describe('удаляет ингредиент', () => {
    it('удаляет ингредиент по id', () => {
      const stateWithSauce = reducer(
        initialState,
        addIngredient(ingredientMock)
      );
      const idToRemove = stateWithSauce.ingredients[0].id;

      const state = reducer(stateWithSauce, removeIngredient(idToRemove));
      expect(state.ingredients).toHaveLength(0);
    });
  });

  describe('передвижение ингредиента', () => {
    it('меняет местами ингредиенты (вниз)', () => {
      let state = reducer(initialState, addIngredient(ingredientMock));
      state = reducer(
        state,
        addIngredient({ ...ingredientMock, _id: 'sauce2' })
      );

      const firstId = state.ingredients[0].id;
      const stateMoved = reducer(
        state,
        moveIngredient({ index: 0, upwards: false })
      );

      expect(stateMoved.ingredients[1].id).toBe(firstId);
    });

    it('меняет местами ингредиенты (вверх)', () => {
      let state = reducer(initialState, addIngredient(ingredientMock));
      state = reducer(
        state,
        addIngredient({ ...ingredientMock, _id: 'sauce2' })
      );

      const secondId = state.ingredients[1].id;
      const stateMoved = reducer(
        state,
        moveIngredient({ index: 1, upwards: true })
      );

      expect(stateMoved.ingredients[0].id).toBe(secondId);
    });

    it('игнорирует выход за пределы массива', () => {
      const state = reducer(initialState, addIngredient(ingredientMock));
      const result = reducer(
        state,
        moveIngredient({ index: 0, upwards: true })
      );
      expect(result).toEqual(state);
    });
  });

  describe('очистка конструктора', () => {
    it('сбрасывает булку и ингредиенты', () => {
      let state = reducer(initialState, addIngredient(bunMock));
      state = reducer(state, addIngredient(ingredientMock));

      const cleared = reducer(state, clearConstructor());
      expect(cleared).toEqual(initialState);
    });
  });

  describe('тесты селекторов', () => {
    it('selectBurgerConstructor возвращает состояние конструктора', () => {
      const state = {
        [BURGER_CONSTRUCTOR_SLICE_NAME]: {
          bun: bunMock,
          ingredients: [{ ...ingredientMock, id: '123' }]
        }
      };

      expect(selectBurgerConstructor(state)).toEqual(
        state[BURGER_CONSTRUCTOR_SLICE_NAME]
      );
    });
  });
});
