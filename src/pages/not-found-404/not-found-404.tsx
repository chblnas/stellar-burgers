import { FC } from 'react';
import styles from './not-found-404.module.css';
import clsx from 'clsx';

export const NotFound404: FC = () => (
  <h3 className={clsx(`pb-6 text text_type_main-large`, styles.title)}>
    Страница не найдена. Ошибка 404.
  </h3>
);
