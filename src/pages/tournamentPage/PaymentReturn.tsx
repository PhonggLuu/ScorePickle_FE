import type React from 'react';
import {
  CheckCircleFilled,
  CloseCircleFilled,
  InfoCircleFilled,
} from '@ant-design/icons';
import { Card, Button } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCheckPayment } from '@src/modules/Payment/hooks/useCheckPayment';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useEffect } from 'react';

// interface PaymentReturnProps {
//   vnp_Amount: string;
//   vnp_BankCode: string;
//   vnp_BankTranNo: string;
//   vnp_CardType: string;
//   vnp_OrderInfo: string;
//   vnp_PayDate: string;
//   vnp_ResponseCode: string;
//   vnp_TmnCode: string;
//   vnp_TransactionNo: string;
//   vnp_TransactionStatus: string;
//   vnp_TxnRef: string;
//   vnp_SecureHash: string;
// }
// interface PaymentReturnProps {
//     response: string;
// }

const PaymentReturn: React.FC = () =>
  //{
  //   response,
  //   vnp_Amount,
  //   vnp_BankCode,
  //   vnp_BankTranNo,
  //   vnp_CardType,
  //   vnp_OrderInfo,
  //   vnp_PayDate,
  //   vnp_ResponseCode,
  //   vnp_TmnCode,
  //   vnp_TransactionNo,
  //   vnp_TransactionStatus,
  //   vnp_TxnRef,
  //   vnp_SecureHash,
  //}
  {
    const currentUrl = window.location.href;
    const urlObj = new URL(currentUrl);

    // Sử dụng URLSearchParams để truy xuất các tham số từ query string
    const params = new URLSearchParams(urlObj.search);

    // Lấy giá trị của các tham số cần thiết
    const vnp_Amount = Number(params.get('vnp_Amount'));
    const vnp_CardType = params.get('vnp_CardType');
    const vnp_ResponseCode = params.get('vnp_ResponseCode');

    const user = useSelector((state: RootState) => state.auth.user);
    const { data: checkPayment } = useCheckPayment(user?.id || 0, currentUrl);

    useEffect(() => {
      if (checkPayment) {
        console.log('Check Payment Data:', checkPayment);
      } else {
        console.log('No payment data available.');
      }
    }, [checkPayment]);

    function getErrorMessage(responseCode) {
      switch (responseCode) {
        case '09':
          return 'Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.';
        case '10':
          return 'Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần';
        case '11':
          return 'Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.';
        case '12':
          return 'Thẻ/Tài khoản của khách hàng bị khóa.';
        case '13':
          return 'Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.';
        case '24':
          return 'Khách hàng hủy giao dịch';
        case '51':
          return 'Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.';
        case '52':
          return 'Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.';
        case '75':
          return 'Ngân hàng thanh toán đang bảo trì.';
        case '79':
          return 'KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch';
        default:
          return 'Mã lỗi không xác định.';
      }
    }
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: '100vh' }}
      >
        <Card
          className="text-center"
          style={{ maxWidth: '500px', width: '100%' }}
        >
          <div className="py-4">
            <h4 className="mt-3" style={{ fontWeight: 'bold' }}>
              {(() => {
                switch (vnp_ResponseCode) {
                  case '00':
                    return (
                      <>
                        <CheckCircleFilled
                          style={{ fontSize: '48px', color: '#52c41a' }}
                        />
                        <br />
                        Thanh toán thành công!
                      </>
                    );
                  case '07':
                    return (
                      <>
                        <InfoCircleFilled
                          style={{ fontSize: '48px', color: 'yellow' }}
                        />
                        <br />
                        Trừ tiền thành công. Giao dịch bị nghi ngờ.
                      </>
                    );
                  default:
                    return (
                      <>
                        <CloseCircleFilled
                          style={{ fontSize: '48px', color: 'red' }}
                        />
                        <br />
                        Thanh toán không thành công!
                      </>
                    );
                }
              })()}
            </h4>

            {vnp_ResponseCode !== '00' && vnp_ResponseCode !== '07' && (
              <h4 className="mb-5" style={{ fontSize: '16px' }}>
                <span className="fw-normal">
                  {getErrorMessage(vnp_ResponseCode)}
                </span>
              </h4>
            )}
            <div className="text-center mb-4 mt-5">
              <div className="mb-2">
                <span className="fw-semibold">Số tiền:</span>{' '}
                {(vnp_Amount / 100).toLocaleString('vi-VN')}
              </div>
              <div className="mb-2">
                <span className="fw-semibold">Kênh thanh toán:</span>{' '}
                {vnp_CardType}
              </div>
            </div>

            <Button
              type="primary"
              size="large"
              className="w-100"
              style={{ backgroundColor: '#0d6efd', borderColor: '#0d6efd' }}
              onClick={() => {
                window.location.href = '/';
              }}
            >
              Quay về trang chủ
            </Button>
          </div>
        </Card>
      </div>
    );
  };

export default PaymentReturn;
