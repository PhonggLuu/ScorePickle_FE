import React from 'react';
import { Layout, Row, Col, Image, Input, Button } from 'antd';
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
      style={{ backgroundColor: '#f0f2f5', padding: '20px 50px 80px 50px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          borderBottom: '1px solid #d9d9db',
          marginBottom: '40px',
        }}
      >
        <Image
          style={{ height: '160px' }}
          src="/logo-no-background.png"
          preview={false}
        />
      </div>
      <Row
        justify={'space-between'}
        style={{ margin: '0 100px' }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <p className="title">Liên hệ</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <p>
                  <PhoneFilled
                    style={{
                      fontSize: '22px',
                      color: '#fff',
                      padding: '12px',
                      backgroundColor: '#727375',
                      borderRadius: '50%',
                    }}
                  />
                </p>
              </div>
              <div>
                <p className="subtitle">Gọi chúng tôi</p>
                <p>0912312312</p>
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
                  <SendOutlined
                    style={{
                      fontSize: '22px',
                      color: '#fff',
                      padding: '12px',
                      backgroundColor: '#1c4c93 ',
                      borderRadius: '50%',
                    }}
                  />
                </p>
              </div>
              <div>
                <p className="subtitle">Gửi email đến ScorePickle</p>
                <p>scorepickle@gmail.com</p>
              </div>
            </div>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <p className="title">Về ScorePickle</p>
            <Row>
              <Col
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontWeight: '600',
                }}
              >
                <Link to="/blog">Blog</Link>
                <Link to="/rules">Luật chơi</Link>
                <Link to="/news">Tin tức</Link>
              </Col>
              <Col
                xs={12}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  fontWeight: '600',
                }}
              >
                <Link to="/about">Về chúng tôi</Link>
                <Link to="/tournament-events">Danh sách giải đấu</Link>
                <Link to="/ranking">Bảng xếp hạng</Link>
                <Link to="/register-tournament">Tham gia giải đấu</Link>
                <Link to="/support">Hỗ trợ</Link>
              </Col>
            </Row>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <h4 className="title">Đăng ký tổ chức giải đấu</h4>
            <Input
              type="email"
              style={{ height: '45px', marginTop: '10px' }}
              placeholder="Nhập email để chúng tôi liên hệ"
            />
            <Button
              type="primary"
              style={{
                backgroundColor: '#1c4c93',
                height: '45px',
                width: '120px',
                marginTop: '20px',
                padding: '10px',
              }}
            >
              <p style={{ fontWeight: '600' }}>Đăng ký</p>
            </Button>
          </div>
        </Col>

        <Col xs={24} sm={24} md={5}>
          <div className="containerF">
            <p className="title">Theo dõi chúng tôi</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div>
                <p>
                  <FacebookFilled
                    style={{
                      fontSize: '22px',
                      color: '#fff',
                      padding: '12px',
                      backgroundColor: '#0866ff',
                      borderRadius: '50%',
                    }}
                  />
                </p>
              </div>
              <div>
                <p className="subtitle">Facebook</p>
                <a href="https://www.facebook.com/pickleball/">
                  facebook.com/pickleball/
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
                <p>
                  <InstagramFilled
                    style={{
                      fontSize: '22px',
                      color: '#fff',
                      padding: '12px',
                      backgroundColor: '#ff0268 ',
                      borderRadius: '50%',
                    }}
                  />
                </p>
              </div>
              <div>
                <p className="subtitle">Instagram</p>
                <a href="https://www.instagram.com/pickleball/">
                  instagram.com/pickleball/
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Footer>
  );
};

export default CustomFooter;
