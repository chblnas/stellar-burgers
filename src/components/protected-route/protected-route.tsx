import { Preloader } from '@ui';
import { TProtectedRouteProps } from './type';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '@store';
import { selectAuthCheck, selectUser } from '@slices/user/userSlice';

export const ProtectedRoute = ({
  children,
  isPublic
}: TProtectedRouteProps) => {
  const user = useSelector(selectUser);
  const checkUser = useSelector(selectAuthCheck);

  const location = useLocation();

  if (!checkUser) {
    return <Preloader />;
  }

  if (isPublic && user) {
    const from = location.state?.from || { pathname: '/profile' };
    return <Navigate to={from} />;
  }

  if (!isPublic && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return children;
};
