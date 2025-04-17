import { useMutation } from '@tanstack/react-query';
import api from '@src/api/api';
import { AddFriendRequest, AddFriendResponse } from '../models';
import { message } from 'antd';

export const addFriend = async (
  data: AddFriendRequest
): Promise<AddFriendResponse> => {
  try {
    const response = await api.post(`/Friend/AddFriend/`, data);
    return response.data as AddFriendResponse;
  } catch (error) {
    throw new Error('Error add friend');
  }
};

export function useAddFriend() {
  return useMutation<AddFriendResponse, Error, { data: AddFriendRequest }>({
    mutationFn: ({ data }) => addFriend(data),
    onSuccess: () => {
      message.success('Send friend request successfully');
    },
    onError: () => {
      message.error('Failed to send request');
    },
  });
}
