import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '@store';
import {
  loginUser,
  selectError,
  selectUserIsLoading
} from '@slices/user/userSlice';
import { Preloader } from '@ui';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from '@hooks/useForm';

export const Login: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoading = useSelector(selectUserIsLoading);
  const error = useSelector(selectError);

  const { from } = location.state || { from: { pathname: '/' } };

  const { values, handleChange } = useForm({
    email: '',
    password: ''
  });

  const { email, password } = values;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }));
    navigate(from.pathname, { replace: true });
  };

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <LoginUI
      errorText={error?.message ?? ''}
      email={email}
      password={password}
      setEmail={(e) => handleChange('email', e)}
      setPassword={(e) => handleChange('password', e)}
      handleSubmit={handleSubmit}
    />
  );
};
