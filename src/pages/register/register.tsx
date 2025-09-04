import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import {
  registerUser,
  selectError,
  selectUserIsLoading
} from '@slices/user/userSlice';
import { useSelector, useDispatch } from '@store';
import { Preloader } from '@ui';
import { useForm } from '@hooks/useForm';

export const Register: FC = () => {
  const dispatch = useDispatch();

  const error = useSelector(selectError);
  const isLoading = useSelector(selectUserIsLoading);

  const { values, handleChange } = useForm({
    userName: '',
    email: '',
    password: ''
  });

  const { userName, email, password } = values;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ name: userName, email, password }));
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <RegisterUI
      errorText={error?.message ?? ''}
      email={email}
      userName={userName}
      password={password}
      setEmail={(e) => handleChange('email', e)}
      setPassword={(e) => handleChange('password', e)}
      setUserName={(e) => handleChange('userName', e)}
      handleSubmit={handleSubmit}
    />
  );
};
