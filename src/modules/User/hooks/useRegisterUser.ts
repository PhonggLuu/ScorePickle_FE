import { useMutation } from '@tanstack/react-query';
import Api from '../../../api/api';
import {
  RegisterUserRequest,
  RegisterUserResponse,
  RoleFactory,
} from '../models';

const registerUser = async (
  user: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const payload: RegisterUserRequest = {
    ...user,
    RoleId: RoleFactory.Refree,
  };
  const response = await Api.post('Auth/register', payload);
  const data = response.data as RegisterUserResponse;
  return data;
};

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
    onError: (error) => {
      console.error('Error registering user:', error);
    },
  });
}
