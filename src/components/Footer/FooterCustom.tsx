import React from 'react';
import { Layout, Row, Col, Input, Button } from 'antd';
import {
  FacebookFilled,
  InstagramFilled,
  PhoneFilled,
  SendOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import './Footer.scss';

const { Footer } = Layout;

const CustomFooter: React.FC = () => {
  return (
    <Footer
      style={{
        background: 'linear-gradient(to right, #1e3a8a, #3b82f6)',
        padding: '20px 50px 80px 50px',
        marginTop: '140px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid #d9d9db',
          marginBottom: '40px',
        }}
      >
        {/* <Image
          style={{ height: '160px' }}
          src="/logo-no-background.png"
          preview={false}
        /> */}
      </div>
      <Row
        justify={'space-between'}
        style={{ margin: '0 100px' }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <h3
              className="fw-bold"
              style={{ color: 'rgba(0, 247, 255, 0.85)' }}
            >
              Contact
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <p>
                  <PhoneFilled style={{ fontSize: '30px', color: 'white' }} />
                </p>
              </div>
              <div>
                <p className="text-white m-0">Gọi chúng tôi</p>
                <p className="text-white">0912312312</p>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <div>
                <p>
                  <SendOutlined style={{ fontSize: '30px', color: 'white' }} />
                </p>
              </div>
              <div>
                <p className="text-white m-0">Gửi email đến ScorePickle</p>
                <p className="text-white">scorepickle@gmail.com</p>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <h3
              className="fw-bold"
              style={{ color: 'rgba(0, 247, 255, 0.85)' }}
            >
              Về ScorePickle
            </h3>
            <Row>
              <Col
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Link to="/blog" className="text-white">
                  Blog
                </Link>
                <Link to="/news" className="text-white">
                  News
                </Link>
                <Link to="/rules" className="text-white">
                  Rules
                </Link>
              </Col>
              <Col
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <Link to="/about" className="text-white">
                  About us
                </Link>
                <Link to="/support" className="text-white">
                  Support
                </Link>
                <Link to="/rule-page" className="text-white">
                  Platform Rules
                </Link>
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div
            className="containerF"
            style={{ color: 'rgba(0, 247, 255, 0.85)' }}
          >
            <h3 className="fw-bold">Register to organize a tournament</h3>
            <Input
              type="email"
              style={{ height: '45px', marginTop: '10px' }}
              placeholder="Input email to contact"
            />
            <Button
              type="primary"
              style={{
                backgroundColor: 'rgba(0, 46, 96, 0.85)',
                height: '45px',
                width: '120px',
                marginTop: '20px',
                padding: '10px',
              }}
            >
              <p style={{ fontWeight: '600' }}>Register</p>
            </Button>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <h3
              className="fw-bold"
              style={{ color: 'rgba(0, 247, 255, 0.85)' }}
            >
              Follow us
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <FacebookFilled style={{ fontSize: '40px', color: 'white' }} />
              </div>
              <div>
                <a
                  href="https://www.facebook.com/pickleball/"
                  className="text-white"
                >
                  facebook.com/pickleball
                </a>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginTop: '20px',
              }}
            >
              <div>
                <InstagramFilled style={{ fontSize: '40px', color: 'white' }} />
              </div>
              <div>
                <Link
                  to="https://www.instagram.com/pickleball/"
                  className="text-white"
                >
                  instagram.com/pickleball
                </Link>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
