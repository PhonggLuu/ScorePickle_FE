import { useMutation } from '@tanstack/react-query';
import api from '@src/api/api';
import { UpdatePasswordRequest } from '../models';
import { message } from 'antd';

const updatePassword = async (
  request: UpdatePasswordRequest
): Promise<boolean> => {
  try {
    const response = await api.post(`/Auth/UpdatePassword/`, request);
    return response.data as boolean;
  } catch (error) {
    throw new Error('Error updating password');
  }
};

export function useUpdatePassword() {
  return useMutation<boolean, Error, { userId: number; newPassword: string }>({
    mutationFn: ({ userId, newPassword }) =>
      updatePassword({ userId, newPassword }),
    onSuccess: (data): void => {
      if (data) {
        message.success('Update Password successfully');
      }
    },
    onError: (data): void => {
      if (data) {
        message.error(data.message);
      }
    },
  });
}
