import { useMutation } from '@tanstack/react-query';
import { SEND_OTP } from '../constants';
import { SendOtpResponse } from '../models';
import Api from '@src/api/api';
import { useDispatch } from 'react-redux';
import { setEmail, setOtp } from '@src/redux/user/userSlice';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';

const sendOtp = async (email: string): Promise<SendOtpResponse> => {
  const response = await Api.get<SendOtpResponse>(`/Auth/VerifyEmail/${email}`);
  const result = response.data;
  if (!result) {
    throw new Error('Not found your email address');
  }
  return result;
};

export function useSendOtp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return useMutation<SendOtpResponse, Error, string>({
    mutationKey: [SEND_OTP],
    mutationFn: sendOtp,
    onSuccess: (data) => {
      message.success('Send OTP to your email successfully');
      dispatch(setEmail(data.email));
      dispatch(setOtp(data.otp));
      navigate('/auth/verify-otp');
    },
    onError: () => {
      message.error('Not found your email address');
    },
  });
}
