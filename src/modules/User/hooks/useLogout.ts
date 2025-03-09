import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeLocalStorageItem } from '@src/utils/localStorageUtils';
import { PATH_AUTH } from '@src/constants';

const useLogout = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const logout = async () => {
    setIsLoggingOut(true);

    try {
      // Giả sử bạn đang lưu token trong localStorage hoặc sessionStorage
      removeLocalStorageItem('token');
      removeLocalStorageItem('refreshToken');

      // Thực hiện điều hướng sau khi đăng xuất
      navigate(PATH_AUTH.signin);
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return { logout, isLoggingOut };
};

export default useLogout;
