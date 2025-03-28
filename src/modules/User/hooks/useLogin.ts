import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import Api from '../../../api/api';
import { LoginRequest, LoginResponse, User } from '../models';
import { isAuth } from '../../../redux/authentication/authSlide';
import {
  getLocalStorageItem,
  setLocalStorageItem,
} from '@src/utils/localStorageUtils';

// integration with redux for login user
const login = async (request: LoginRequest): Promise<LoginResponse> => {
  const response = await Api.post('Auth/login', request);
  const data: LoginResponse = response.data as LoginResponse;
  if (data.tokenString) {
    setLocalStorageItem('token', data.tokenString);
  }
  return data;
};

export function useLogin() {
  const dispatch = useDispatch();
  return useMutation({
    mutationFn: login,
    onSuccess: () => {
      dispatch(isAuth());
    },
    onError: (error) => {
      console.error('Error logging in:', error);
    },
  });
}

const getUser = async (): Promise<User> => {
  const token = getLocalStorageItem('token');
  console.log('token: ', token);
  const response = (await Api.get('Auth/GetUserByToken/', {
    token,
  })) as unknown as User;
  return response;
};

export async function saveRefreshToken() {
  const user: User = await getUser();
  setLocalStorageItem('refreshToken', user.refreshToken);
}
