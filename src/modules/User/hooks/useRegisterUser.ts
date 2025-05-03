import { useMutation } from '@tanstack/react-query';
import Api from '../../../api/api';
import {
  CreatePlayerRequest,
  CreatePlayerResponse,
  RegisterUser,
  RegisterUserRequest,
  RegisterUserResponse,
  RoleFactory,
} from '../models';
import { useDispatch } from 'react-redux';
import { setUserId } from '@src/redux/user/userSlice';
import { message } from 'antd';

const registerUser = async (
  user: RegisterUserRequest
): Promise<RegisterUserResponse> => {
  const payload: RegisterUserRequest = {
    ...user,
    RoleId: RoleFactory.Player,
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

export const createPlayer = async (
  request: CreatePlayerRequest
): Promise<CreatePlayerResponse> => {
  const response = await Api.post('Player/CreatePlayer', request);
  const data = response.data as CreatePlayerResponse;
  return data;
};

const registerPlayer = async (
  user: RegisterUser
): Promise<RegisterUserResponse> => {
  const response = await Api.post('Auth/register', user);
  const data = response.data as RegisterUserResponse;
  return data;
};

export function useRegisterPlayer() {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: registerPlayer,
    onSuccess: (data) => {
      dispatch(setUserId(data.id));
      //createPlayer(data.id);
    },
    onError: (error) => {
      console.error('Error registering player:', error);
    },
  });
}

export const useCreatePlayer = () => {
  return useMutation<CreatePlayerResponse, Error, CreatePlayerRequest>({
    mutationFn: (request: CreatePlayerRequest) => createPlayer(request),
    onSuccess: () => {
      message.success('Player created successfully!');
    },
    onError: (error) => {
      console.error('❌ Failed to create player:', error.message);
      message.error('Player creation failed!');
    },
  });
};
