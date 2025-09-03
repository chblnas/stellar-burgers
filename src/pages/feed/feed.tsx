import {
  fetchFeeds,
  selectFeedData,
  selectFeedIsLoading
} from '@slices/feed/feedSlice';
import { useDispatch, useSelector } from '@store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const data = useSelector(selectFeedData);
  const isLoading = useSelector(selectFeedIsLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (isLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={data.orders} handleGetFeeds={handleGetFeeds} />;
};
