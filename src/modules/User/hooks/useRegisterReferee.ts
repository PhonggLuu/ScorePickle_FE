import { useMutation } from '@tanstack/react-query';
import Api from '@src/api/api';
import { RegisterUserRequest, RoleFactory } from '../models';

const registerReferees = async (user: RegisterUserRequest): Promise<void> => {
  const payload: RegisterUserRequest = {
    ...user,
    RoleId: RoleFactory.Refree,
  };
  await Api.post('/User/create-referee', payload);
};

export function useRegisterReferees() {
  return useMutation({
    mutationFn: registerReferees,
    onError: (error) => {
      console.error('Error registering:', error);
    },
  });
}
