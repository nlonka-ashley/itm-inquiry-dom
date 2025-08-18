import {
  DollarOutlined,
  ScheduleOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Helmet } from '@modern-js/runtime/head';
import { Link } from '@modern-js/runtime/router';
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Layout,
  Row,
  Space,
  Typography,
  theme,
} from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Index = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.defaultAlgorithm,
      token: {
        colorBgLayout: '#f5f5f5',
        colorBgContainer: '#ffffff',
        colorBgElevated: '#ffffff',
      },
    }}
  >
    <Helmet>
      <title>Ashley Supplier Portal - Inquiry Applications</title>
      <link
        rel="icon"
        type="image/x-icon"
        href="https://lf3-static.bytednsdoc.com/obj/eden-cn/uhbfnupenuhf/favicon.ico"
      />
    </Helmet>

    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px', background: '#f5f5f5' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <Title level={1} style={{ color: '#1890ff', marginBottom: '16px' }}>
              Ashley Supplier Portal
            </Title>
            <Title level={3} style={{ color: '#666', fontWeight: 'normal' }}>
              Inquiry Applications
            </Title>
            <Paragraph
              style={{
                fontSize: '16px',
                color: '#666',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              Access powerful inquiry tools to search and analyze your purchase
              orders, production schedules, and payment information.
            </Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center">
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <ShoppingCartOutlined
                  style={{
                    fontSize: '48px',
                    color: '#1890ff',
                    marginBottom: '24px',
                  }}
                />
                <Title level={3} style={{ marginBottom: '16px' }}>
                  Domestic PO Item Inquiry
                </Title>
                <Paragraph
                  style={{
                    color: '#666',
                    marginBottom: '24px',
                    minHeight: '60px',
                  }}
                >
                  Search and analyze domestic purchase order items with advanced
                  filtering options. View order status, quantities, dates, and
                  export data to Excel.
                </Paragraph>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <Link to="/dom-item-inquiry">
                    <Button type="primary" size="large" block>
                      Open DOM Item Inquiry
                    </Button>
                  </Link>
                  <Paragraph style={{ fontSize: '12px', color: '#999' }}>
                    Migrated from ItmInquiryDOM.asp
                  </Paragraph>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <ScheduleOutlined
                  style={{
                    fontSize: '48px',
                    color: '#52c41a',
                    marginBottom: '24px',
                  }}
                />
                <Title level={3} style={{ marginBottom: '16px' }}>
                  Production Schedule Inquiry
                </Title>
                <Paragraph
                  style={{
                    color: '#666',
                    marginBottom: '24px',
                    minHeight: '60px',
                  }}
                >
                  Analyze production schedules with multi-criteria filtering,
                  time period selection, and comprehensive reporting
                  capabilities.
                </Paragraph>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <Link to="/production-schedule">
                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{
                        backgroundColor: '#52c41a',
                        borderColor: '#52c41a',
                      }}
                    >
                      Open Production Schedule
                    </Button>
                  </Link>
                  <Paragraph style={{ fontSize: '12px', color: '#999' }}>
                    Migrated from ProductionSched.asp
                  </Paragraph>
                </Space>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{ height: '100%', textAlign: 'center' }}
                bodyStyle={{ padding: '40px 24px' }}
              >
                <DollarOutlined
                  style={{
                    fontSize: '48px',
                    color: '#fa8c16',
                    marginBottom: '24px',
                  }}
                />
                <Title level={3} style={{ marginBottom: '16px' }}>
                  POs Paid Inquiry
                </Title>
                <Paragraph
                  style={{
                    color: '#666',
                    marginBottom: '24px',
                    minHeight: '60px',
                  }}
                >
                  Search and track paid purchase orders with detailed payment
                  information, vendor analysis, and comprehensive financial
                  reporting.
                </Paragraph>
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%' }}
                >
                  <Link to="/pos-paid-inquiry">
                    <Button
                      type="primary"
                      size="large"
                      block
                      style={{
                        backgroundColor: '#fa8c16',
                        borderColor: '#fa8c16',
                      }}
                    >
                      Open POs Paid Inquiry
                    </Button>
                  </Link>
                  <Paragraph style={{ fontSize: '12px', color: '#999' }}>
                    Migrated from POsPaid.asp
                  </Paragraph>
                </Space>
              </Card>
            </Col>
          </Row>

          <div
            style={{
              textAlign: 'center',
              marginTop: '50px',
              padding: '20px',
              background: '#fff',
              borderRadius: '8px',
            }}
          >
            <Paragraph style={{ color: '#666', marginBottom: '8px' }}>
              <strong>Company:</strong> ASHLEY
            </Paragraph>
            <Paragraph
              style={{ color: '#999', fontSize: '14px', marginBottom: '0' }}
            >
              Modern React applications built with Modern.js and Ant Design
              v5.26.7
            </Paragraph>
          </div>
        </div>
      </Content>
    </Layout>
  </ConfigProvider>
);

export default Index;
