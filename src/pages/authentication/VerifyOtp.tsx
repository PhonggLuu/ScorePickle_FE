import {
  Button,
  Col,
  Flex,
  Form,
  Input,
  message,
  Row,
  theme,
  Typography,
} from 'antd';
import { useMediaQuery } from 'react-responsive';
import { useState } from 'react';
import { RootState } from '@src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setVerified } from '@src/redux/user/userSlice';

const { Title, Text } = Typography;

type FieldType = {
  otp?: string;
};

export const VerifyOtp = () => {
  const {
    token: { colorPrimary },
  } = theme.useToken();
  const isMobile = useMediaQuery({ maxWidth: 769 });
  const [loading, setLoading] = useState(false);
  const otp = useSelector((state: RootState) => state.user.otp);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    setLoading(true);

    if (values.otp === otp) {
      message.success('OTP verified successfully!');
      dispatch(setVerified(true));
      navigate('/auth/signup');
    }
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Row style={{ minHeight: isMobile ? 'auto' : '100vh', overflow: 'hidden' }}>
      <Col xs={24} lg={12}>
        <Flex
          vertical
          align="center"
          justify="center"
          className="text-center"
          style={{ background: colorPrimary, height: '100%', padding: '1rem' }}
        >
          <div></div>
        </Flex>
      </Col>
      <Col xs={24} lg={12}>
        <Flex
          vertical
          align={isMobile ? 'center' : 'flex-start'}
          justify="center"
          gap="middle"
          style={{ height: '100%', width: '100%', padding: '2rem' }}
        >
          <Title className="m-0">Verify OTP</Title>
          <Text>Enter otp to verify email.</Text>
          <Form
            name="sign-up-form"
            layout="vertical"
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            requiredMark={false}
            style={{ width: '100%' }}
          >
            <Form.Item<FieldType>
              label="Otp"
              name="otp"
              rules={[{ required: true, message: 'Please input otp' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item>
              <Flex align="center" gap="small">
                <Button
                  type="primary"
                  htmlType="submit"
                  size="middle"
                  loading={loading}
                >
                  Submit
                </Button>
                <Button type="text" size="middle" loading={loading}>
                  Cancel
                </Button>
              </Flex>
            </Form.Item>
          </Form>
        </Flex>
      </Col>
    </Row>
  );
};
