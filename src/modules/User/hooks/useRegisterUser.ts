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
  playerId: number
): Promise<CreatePlayerResponse> => {
  const request: CreatePlayerRequest = {
    PlayerId: playerId,
    Province: '',
    City: '',
  };
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
  return useMutation({
    mutationFn: registerPlayer,
    onSuccess: (data) => {
      createPlayer(data.id);
    },
    onError: (error) => {
      console.error('Error registering player:', error);
    },
  });
}
