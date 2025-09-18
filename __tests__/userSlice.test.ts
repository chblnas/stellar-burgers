import userSlice, {
  initialState,
  loginUser,
  registerUser,
  logoutUser,
  fetchUser,
  updateUser,
  selectUser,
  selectAuthCheck,
  selectError,
  selectUserIsLoading
} from '../src/services/slices/user/userSlice';

import { USER_SLICE_NAME } from '../src/services/slices/sliceNames';

const reducer = userSlice.reducer;

const loginMockData = { email: 'test@test.com', password: '123' };
const registerMockData = {
  email: 'test@test.com',
  password: '123',
  name: 'test'
};

const userMockData = { email: 'test@test.com', name: 'test' };

describe('userSlice', () => {
  describe('loginUser', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(
        initialState,
        loginUser.pending('pending', loginMockData)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя и авторизует', () => {
      const state = reducer(
        initialState,
        loginUser.fulfilled(userMockData, 'fulfilled', loginMockData)
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('Ошибка логина');
      const state = reducer(
        initialState,
        loginUser.rejected(error, 'rejected', loginMockData)
      );
      expect(state.error?.message).toBe('Ошибка логина');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('registerUser', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(
        initialState,
        registerUser.pending('pending', registerMockData)
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя и авторизует', () => {
      const state = reducer(
        initialState,
        registerUser.fulfilled(userMockData, 'fulfilled', registerMockData)
      );
      expect(state.isAuthenticated).toBe(true);
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('Ошибка регистрации');
      const state = reducer(
        initialState,
        registerUser.rejected(error, 'rejected', registerMockData)
      );
      expect(state.error?.message).toBe('Ошибка регистрации');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('fetchUser', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(initialState, fetchUser.pending('pending'));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет пользователя, авторизует и отмечает authCheck', () => {
      const state = reducer(
        initialState,
        fetchUser.fulfilled(userMockData, 'fulfilled')
      );
      expect(state.data).toEqual(userMockData);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isAuthChecked).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку, сбрасывает isLoading и отмечает authCheck', () => {
      const error = new Error('Ошибка загрузки пользователя');
      const state = reducer(
        initialState,
        fetchUser.rejected(error, 'rejected')
      );
      expect(state.error?.message).toBe('Ошибка загрузки пользователя');
      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(
        initialState,
        updateUser.pending('pending', { name: 'new' })
      );
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled обновляет данные пользователя', () => {
      const state = reducer(
        initialState,
        updateUser.fulfilled(userMockData, 'fulfilled', { name: 'new' })
      );
      expect(state.data).toEqual(userMockData);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('Ошибка обновления');
      const state = reducer(
        initialState,
        updateUser.rejected(error, 'rejected', { name: 'new' })
      );
      expect(state.error?.message).toBe('Ошибка обновления');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('logoutUser', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(initialState, logoutUser.pending('pending'));
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сбрасывает пользователя и авторизацию', () => {
      const preloaded = {
        ...initialState,
        data: userMockData,
        isAuthenticated: true
      };
      const state = reducer(
        preloaded,
        logoutUser.fulfilled(undefined, 'fulfilled')
      );
      expect(state.data).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('rejected сохраняет ошибку и сбрасывает isLoading', () => {
      const error = new Error('Ошибка выхода');
      const state = reducer(
        initialState,
        logoutUser.rejected(error, 'rejected')
      );
      expect(state.error?.message).toBe('Ошибка выхода');
      expect(state.isLoading).toBe(false);
    });
  });

  describe('тесты селекторов', () => {
    const state = {
      [USER_SLICE_NAME]: {
        ...initialState,
        data: userMockData,
        isAuthChecked: true,
        isAuthenticated: true,
        isLoading: true,
        error: { name: 'TestError', message: 'Ошибка' } as any
      }
    };

    it('selectUser возвращает пользователя', () => {
      expect(selectUser(state)).toEqual(userMockData);
    });

    it('selectAuthCheck возвращает статус проверки авторизации', () => {
      expect(selectAuthCheck(state)).toBe(true);
    });

    it('selectError возвращает ошибку', () => {
      expect(selectError(state)?.message).toBe('Ошибка');
    });

    it('selectUserIsLoading возвращает статус загрузки', () => {
      expect(selectUserIsLoading(state)).toBe(true);
    });
  });
});
