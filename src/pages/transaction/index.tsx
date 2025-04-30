import { useMemo } from 'react';
import {
  Table,
  Tag,
  Typography,
  Spin,
  Card,
  Button,
  Empty,
  Row,
  Col,
  Statistic,
} from 'antd';
import { useGetAllBillByUser } from '@src/modules/Tournament/hooks/useGetAllBillByUser';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { motion } from 'framer-motion';
import {
  DollarCircleOutlined,
  ReloadOutlined,
  FileSearchOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 24,
    },
  },
};

const getStatusColor = (status) => {
  switch (status) {
    case 1:
      return 'green';
    case 2:
      return 'orange';
    case 3:
      return 'red';
    case 4:
      return 'blue';
    default:
      return 'default';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 1:
      return 'Paid';
    case 2:
      return 'Pending';
    case 3:
      return 'Failed';
    case 4:
      return 'Refunded';
    default:
      return 'Unknown';
  }
};

const getStatusIcon = (status) => {
  switch (status) {
    case 1:
      return <CheckCircleOutlined />;
    case 2:
      return <ClockCircleOutlined />;
    case 3:
      return <CloseCircleOutlined />;
    case 4:
      return <ReloadOutlined />;
    default:
      return null;
  }
};

const Transaction = () => {
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const {
    data: bills,
    isLoading,
    error,
    refetch,
  } = useGetAllBillByUser(userId || 0);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (!bills || bills.length === 0) {
      return {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        transactionCount: 0,
        paidCount: 0,
        pendingCount: 0,
      };
    }

    return bills.reduce(
      (acc, bill) => {
        // Count all transactions
        acc.transactionCount += 1;

        // Add to total regardless of status
        acc.totalAmount += bill.amount || 0;

        // Count by status
        if (Number(bill.status) === 1) {
          // Paid
          acc.paidAmount += bill.amount || 0;
          acc.paidCount += 1;
        } else if (Number(bill.status) === 2) {
          // Pending
          acc.pendingAmount += bill.amount || 0;
          acc.pendingCount += 1;
        }

        return acc;
      },
      {
        totalAmount: 0,
        paidAmount: 0,
        pendingAmount: 0,
        transactionCount: 0,
        paidCount: 0,
        pendingCount: 0,
      }
    );
  }, [bills]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `₫${amount?.toLocaleString() || 0}`,
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      filters: bills
        ? [...new Set(bills.map((bill) => bill.paymentMethod))].map(
            (method) => ({
              text: method,
              value: method,
            })
          )
        : [],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)} icon={getStatusIcon(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 1 },
        { text: 'Pending', value: 2 },
        { text: 'Failed', value: 3 },
        { text: 'Refunded', value: 4 },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (date) => (date ? new Date(date).toLocaleString() : 'N/A'),
      sorter: (a, b) => {
        if (!a.paymentDate) return -1;
        if (!b.paymentDate) return 1;
        return (
          new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
        );
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      responsive: ['md'],
    },
  ];

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: 'center', padding: '50px' }}
      >
        <Spin size="large" />
        <motion.p
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Loading transactions...
        </motion.p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <Card>
          <motion.div style={{ textAlign: 'center' }} variants={slideUp}>
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1],
              }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <WarningOutlined
                style={{ fontSize: 48, color: '#ff4d4f', marginBottom: 16 }}
              />
            </motion.div>
            <Text type="danger" style={{ fontSize: 18 }}>
              Error loading transactions
            </Text>
            <motion.div
              style={{ marginTop: 16 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                icon={<ReloadOutlined />}
                onClick={() => refetch()}
                type="primary"
              >
                Retry
              </Button>
            </motion.div>
          </motion.div>
        </Card>
      </motion.div>
    );
  }

  const hasTransactions = bills && bills.length > 0;

  return (
    <motion.div
      style={{
        maxWidth: '1400px',
        margin: '40px auto',
        padding: '0 16px',
      }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      {/* Transaction Summary */}
      {hasTransactions && (
        <motion.div variants={slideUp} custom={0} style={{ marginBottom: 24 }}>
          <Card bordered={false}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Statistic
                    title={
                      <Text strong style={{ fontSize: 16 }}>
                        <DollarCircleOutlined
                          style={{ marginRight: 8, color: '#1890ff' }}
                        />
                        Total Amount
                      </Text>
                    }
                    value={summaryStats.totalAmount}
                    precision={0}
                    valueStyle={{ color: '#1890ff', fontWeight: 'bold' }}
                    prefix="₫"
                    suffix={
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <Tag color="blue">
                          {summaryStats.transactionCount} transactions
                        </Tag>
                      </motion.span>
                    }
                  />
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Statistic
                    title={
                      <Text strong style={{ fontSize: 16 }}>
                        <CheckCircleOutlined
                          style={{ marginRight: 8, color: '#52c41a' }}
                        />
                        Paid Amount
                      </Text>
                    }
                    value={summaryStats.paidAmount}
                    precision={0}
                    valueStyle={{ color: '#52c41a' }}
                    prefix="₫"
                    suffix={
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <Tag color="green">{summaryStats.paidCount} paid</Tag>
                      </motion.span>
                    }
                  />
                </motion.div>
              </Col>
              <Col xs={24} md={8}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <Statistic
                    title={
                      <Text strong style={{ fontSize: 16 }}>
                        <ClockCircleOutlined
                          style={{ marginRight: 8, color: '#fa8c16' }}
                        />
                        Pending Amount
                      </Text>
                    }
                    value={summaryStats.pendingAmount}
                    precision={0}
                    valueStyle={{ color: '#fa8c16' }}
                    prefix="₫"
                    suffix={
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 }}
                      >
                        <Tag color="orange">
                          {summaryStats.pendingCount} pending
                        </Tag>
                      </motion.span>
                    }
                  />
                </motion.div>
              </Col>
            </Row>
          </Card>
        </motion.div>
      )}

      {/* Transaction History */}
      <motion.div variants={slideUp} custom={1}>
        <Card
          title={
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <DollarCircleOutlined
                style={{ marginRight: 12, color: '#1890ff' }}
              />
              Transaction History
            </motion.div>
          }
          bordered={false}
          extra={
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                Refresh
              </Button>
            </motion.div>
          }
        >
          {hasTransactions ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Table
                columns={columns as any}
                dataSource={bills}
                rowKey="id"
                pagination={{
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                }}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row>
                      <Table.Summary.Cell index={0} colSpan={1}>
                        <strong>Total</strong>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={1} colSpan={1}>
                        <Text type="danger" strong>
                          ₫{summaryStats.totalAmount.toLocaleString()}
                        </Text>
                      </Table.Summary.Cell>
                      <Table.Summary.Cell index={2} colSpan={4} />
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
                bordered
                scroll={{ x: 'max-content' }}
                locale={{ emptyText: 'No transactions found' }}
                rowClassName={(_, index) => `table-row-motion row-${index}`}
                className="transaction-table"
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 100,
                delay: 0.2,
              }}
              style={{
                padding: '40px 20px',
                textAlign: 'center',
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                imageStyle={{ height: 80 }}
                description={
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Title level={4} style={{ marginBottom: 16 }}>
                      No Transaction History
                    </Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>
                      You don't have any transactions yet. Your payment history
                      will appear here once you make a purchase.
                    </Text>
                  </motion.div>
                }
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ marginTop: 16 }}
                >
                  <Button icon={<FileSearchOutlined />} type="primary">
                    Explore Events
                  </Button>
                </motion.div>
              </Empty>
            </motion.div>
          )}
        </Card>
      </motion.div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        .transaction-table .ant-table-row {
          transition: background-color 0.3s ease, transform 0.2s ease;
        }
        
        .transaction-table .ant-table-row:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          z-index: 1;
          position: relative;
        }
        
        .transaction-table .ant-tag {
          transition: all 0.3s ease;
        }
        
        .transaction-table .ant-tag:hover {
          transform: scale(1.05);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .transaction-table .row-0 { animation-delay: 0.05s; }
        .transaction-table .row-1 { animation-delay: 0.1s; }
        .transaction-table .row-2 { animation-delay: 0.15s; }
        .transaction-table .row-3 { animation-delay: 0.2s; }
        .transaction-table .row-4 { animation-delay: 0.25s; }
        .transaction-table .row-5 { animation-delay: 0.3s; }
        .transaction-table .row-6 { animation-delay: 0.35s; }
        .transaction-table .row-7 { animation-delay: 0.4s; }
        .transaction-table .row-8 { animation-delay: 0.45s; }
        .transaction-table .row-9 { animation-delay: 0.5s; }
        
        .transaction-table .ant-table-row {
          animation: fadeIn 0.3s ease forwards;
          opacity: 0;
        }
        
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(24, 144, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
        }
        
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        
        .ant-statistic-content-value {
          font-size: 24px !important;
        }
        
        .ant-card {
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `,
        }}
      />
    </motion.div>
  );
};

export default Transaction;
