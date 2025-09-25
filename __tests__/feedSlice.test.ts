import feedSlice, {
  initialState,
  selectFeedData,
  selectFeedIsLoading,
  selectFeedError,
  fetchFeeds
} from '../src/services/slices/feed/feedSlice';

import { FEED_SLICE_NAME } from '../src/services/slices/sliceNames';

import { TOrder } from '../src/utils/types';

const reducer = feedSlice.reducer;

const feedsMockData = {
  orders: [
    {
      _id: '1',
      status: 'done',
      name: 'Test Order',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      number: 101,
      ingredients: ['a', 'b']
    } as TOrder
  ],
  total: 1,
  totalToday: 1
};

describe('feedSlice', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('тесты асинхронного fetchFeeds', () => {
    it('pending устанавливает isLoading = true и error = null', () => {
      const state = reducer(initialState, fetchFeeds.pending('pending'));

      expect(state.isLoading).toBeTruthy();
      expect(state.error).toBeNull();
    });

    it('fulfilled устанавливает данные и сбрасывает isLoading и error', () => {
      const state = reducer(
        initialState,
        fetchFeeds.fulfilled(feedsMockData, 'fulfilled')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error).toBeNull();
      expect(state.data).toEqual(feedsMockData);
    });

    it('rejected устанавливает error и сбрасывает isLoading', () => {
      const error = 'Ошибка загрузки ленты';

      const state = reducer(
        initialState,
        fetchFeeds.rejected(new Error(error), 'rejected')
      );

      expect(state.isLoading).toBeFalsy();
      expect(state.error?.message).toEqual(error);
    });
  });

  describe('тесты селекторов', () => {
    const state = {
      [FEED_SLICE_NAME]: {
        ...initialState,
        data: feedsMockData,
        isLoading: true,
        error: new Error('Ошибка')
      }
    };

    it('selectFeedData возвращает данные', () => {
      const result = selectFeedData(state);
      expect(result).toEqual(feedsMockData);
    });

    it('selectFeedIsLoading возвращает true, если идет загрузка', () => {
      const result = selectFeedIsLoading(state);
      expect(result).toBe(true);
    });

    it('selectFeedError возвращает текущую ошибку', () => {
      const result = selectFeedError(state);
      expect(result?.message).toEqual('Ошибка');
    });
  });
});
