import {
  ReloadOutlined,
  SearchOutlined,
  DollarOutlined,
  FileDoneOutlined,
  PieChartOutlined,
  BarChartOutlined,
  UserOutlined,
  ApartmentOutlined,
  GiftOutlined,
} from '@ant-design/icons';
import type { InputRef } from 'antd';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Statistic,
  Table,
  Tag,
  Typography,
  Spin,
  Tooltip,
  Tabs,
  Select,
  Badge,
  Avatar,
} from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bill,
  PaymentStatus,
  TypePayment,
} from '../../../modules/Payment/models';
import { useGetAllBill } from '../../../modules/Payment/hooks/useGetAllBill';
import { Column, Pie } from '@ant-design/charts';
import { User } from '../../../modules/User/models';
import { fetchUserById } from '../../../modules/User/hooks/useGetUserById';

const { Text, Title } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

type DataIndex = string;

const typeColors: Record<number, string> = {
  [TypePayment.Fee]: '#1890ff', // Registration
  [TypePayment.Donate]: '#fa8c16', // Sponsorship
  [TypePayment.Award]: '#722ed1', // Award
};

// Move these functions outside the component to avoid the "Cannot access before initialization" error
const getStatusTagColor = (status: number) => {
  switch (status) {
    case 1:
      return 'green'; // Paid
    case 2:
      return 'orange'; // Pending
    case 3:
      return 'red'; // Failed
    case 4:
      return 'blue'; // Refunded
    default:
      return 'default';
  }
};

const getStatusText = (status: number) => {
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

const getTypeText = (type: number) => {
  switch (type) {
    case 1:
      return 'Sponsorship';
    case 2:
      return 'Registration';
    case 3:
      return 'Award';
    default:
      return 'Unknown';
  }
};

export const PaymentAdmin = () => {
  const { data: bills, isLoading, error, refetch } = useGetAllBill();

  const [, setFilteredBills] = useState<Bill[]>([]);
  const [, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number>(
    new Date().getFullYear()
  );
  const [userDetails, setUserDetails] = useState<User[]>([]);
  const searchInput = useRef<InputRef>(null);
  const userCache = useRef<Map<number, User>>(new Map());
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);

  useEffect(() => {
    setFilteredBills(bills || []);
  }, [bills]);

  // Fetch user details
  useEffect(() => {
    if (Array.isArray(bills) && bills.length > 0) {
      const userIds = bills
        .map((bill) => bill.userId)
        .filter((id) => id !== undefined && id !== null);

      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const uniqueUserIds = Array.from(new Set(userIds));
          const userPromises = uniqueUserIds.map(async (id) => {
            if (userCache.current.has(id)) {
              return userCache.current.get(id);
            } else {
              try {
                const user = await fetchUserById(id);
                if (user) {
                  userCache.current.set(id, user);
                }
                return user;
              } catch (error) {
                console.error(`Error fetching user with ID ${id}:`, error);
                return null;
              }
            }
          });

          const users = await Promise.all(userPromises);
          setUserDetails(users.filter((user) => user !== null) as User[]);
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoadingUsers(false);
        }
      };

      fetchUsers();
    }
  }, [bills]);

  // Helper function to get user details by ID
  const getUserById = (userId: number): User | undefined => {
    return userDetails.find((user) => user.id === userId);
  };

  // Calculate statistics
  const statistics = useMemo(() => {
    if (!bills || !bills.length) {
      return {
        totalAmount: 0,
        totalSponsor: 0,
        totalFee: 0,
        totalAward: 0,
        totalCount: 0,
        sponsorCount: 0,
        feeCount: 0,
        awardCount: 0,
      };
    }

    // Ensure consistent type handling - convert status to number if it's a string
    const total = bills.filter(
      (bill) => bill.status === PaymentStatus.Completed
    );
    const sponsor = bills.filter(
      (bill) =>
        Number(bill.type) === TypePayment.Donate &&
        bill.status === PaymentStatus.Completed
    );
    const fee = bills.filter(
      (bill) =>
        Number(bill.type) === TypePayment.Fee &&
        bill.status === PaymentStatus.Completed
    );
    const award = bills.filter(
      (bill) =>
        Number(bill.type) === TypePayment.Award &&
        bill.status === PaymentStatus.Completed
    );

    return {
      totalAmount:
        fee.reduce((sum, bill) => sum + bill.amount, 0) +
        sponsor.reduce((sum, bill) => sum + bill.amount, 0) -
        award.reduce((sum, bill) => sum + bill.amount, 0),
      totalSponsor: sponsor.reduce((sum, bill) => sum + bill.amount, 0),
      totalFee: fee.reduce((sum, bill) => sum + bill.amount, 0),
      totalAward: award.reduce((sum, bill) => sum + bill.amount, 0),
      totalCount: total.length,
      sponsorCount: sponsor.length,
      feeCount: fee.length,
      awardCount: award.length,
    };
  }, [bills]);

  // Prepare data for charts
  const statusData = useMemo(() => {
    if (!bills) return [];

    const statusCounts = bills.reduce(
      (acc, bill) => {
        const status = getStatusText(Number(bill.status));
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(statusCounts).map(([status, count]) => ({
      type: status,
      value: count,
    }));
  }, [bills]);

  const paymentTypeData = useMemo(() => {
    if (!bills) return [];

    const typeAmounts = bills.reduce(
      (acc, bill) => {
        const type =
          Number(bill.type) === 1
            ? 'Sponsorship'
            : Number(bill.type) === 2
              ? 'Registration'
              : 'Award';
        acc[type] = (acc[type] || 0) + bill.amount;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(typeAmounts).map(([type, amount]) => ({
      type: type,
      value: amount,
    }));
  }, [bills]);

  // Monthly payment data
  const monthlyPaymentsData = useMemo(() => {
    if (!bills) return [];

    // Create empty data for all months
    const months = Array.from({ length: 12 }, (_, i) => {
      return {
        month: new Date(yearFilter, i).toLocaleString('default', {
          month: 'short',
        }),
        monthIndex: i,
        Registration: 0,
        Sponsorship: 0,
        Award: 0,
      };
    });

    // Fill data from bills
    bills.forEach((bill) => {
      const paymentDate = bill.paymentDate ? new Date(bill.paymentDate) : null;
      if (paymentDate && paymentDate.getFullYear() === yearFilter) {
        const monthIndex = paymentDate.getMonth();
        //Number(bill.type) === 1 ? 'Sponsorship' : 'Sponsorship';
        let type = '';
        switch (Number(bill.type)) {
          case 1:
            type = 'Sponsorship';
            break;
          case 2:
            type = 'Registration';
            break;
          case 3:
            type = 'Award';
            break;
          default:
            type = 'Unknown';
        }

        // Add to the specific type
        months[monthIndex][type] += bill.amount;

        // Add to total
        // months[monthIndex].Total += bill.amount;
      }
    });

    // Format for chart - create an array of objects for each month/type combination
    const chartData: any[] = [];
    months.forEach((month) => {
      chartData.push({
        month: month.month,
        type: 'Registration',
        amount: month.Registration,
      });
      chartData.push({
        month: month.month,
        type: 'Sponsorship',
        amount: month.Sponsorship,
      });
      chartData.push({
        month: month.month,
        type: 'Award',
        amount: month.Award,
      });
    });

    return chartData;
  }, [bills, yearFilter]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: () => void,
    dataIndex: DataIndex
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters?: () => void) => {
    if (clearFilters) {
      clearFilters();
    }
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<any> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            ?.toLowerCase()
            .includes((value as string).toLowerCase())
        : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
      ) : (
        text
      ),
  });

  const columns: ColumnsType<Bill> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#389e0d' }}>
          ₫{amount.toLocaleString()}
        </Text>
      ),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'User',
      dataIndex: 'userId',
      key: 'userId',
      render: (userId: number) => {
        const user = getUserById(userId);
        if (loadingUsers) {
          return <Spin size="small" />;
        }
        if (user) {
          return (
            <Space>
              <Avatar
                icon={<UserOutlined />}
                src={user.avatarUrl}
                style={{
                  backgroundColor: user.avatarUrl ? undefined : '#1890ff',
                }}
              />
              <Tooltip title={`${user.email || 'No email'}`}>
                <span>{`${user.firstName || ''} ${user.lastName || ''}`}</span>
              </Tooltip>
            </Space>
          );
        }
        return <span>User ID: {userId}</span>;
      },
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        // Custom filter for user names
        const users = userDetails.filter((u) => u !== null);

        return (
          <div style={{ padding: 8 }}>
            <Select
              showSearch
              style={{ width: 200, marginBottom: 8 }}
              placeholder="Search by user"
              optionFilterProp="children"
              onChange={(value) => setSelectedKeys(value ? [value] : [])}
              filterOption={(input, option) =>
                (option?.label as string)
                  ?.toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={users.map((user) => ({
                value: user.id,
                label: `${user.firstName || ''} ${user.lastName || ''}`,
              }))}
              value={selectedKeys[0]}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 8,
              }}
            >
              <Button
                type="primary"
                onClick={() => confirm()}
                size="small"
                style={{ width: 90 }}
              >
                Filter
              </Button>
              <Button
                onClick={() => clearFilters && clearFilters()}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </div>
          </div>
        );
      },
      filterIcon: (filtered) => (
        <UserOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value, record) => record.userId === value,
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      ...getColumnSearchProps('note'),
    },
    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      render: (method: string) => <Tag color="blue">{method}</Tag>,
      filters: [
        { text: 'VNPAY', value: 'VNPAY' },
        { text: 'Cash', value: 'Cash' },
        { text: 'PayOs', value: 'PayOs' },
        { text: 'Bank Transfer', value: 'Bank Transfer' },
      ],
      onFilter: (value, record) => record.paymentMethod === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: number | string) => (
        <Tag color={getStatusTagColor(Number(status))}>
          {getStatusText(Number(status))}
        </Tag>
      ),
      filters: [
        { text: 'Paid', value: 1 },
        { text: 'Pending', value: 2 },
        { text: 'Failed', value: 3 },
        { text: 'Refunded', value: 4 },
      ],
      onFilter: (value, record) => Number(record.status) === value,
    },
    {
      title: 'Payment Date',
      dataIndex: 'paymentDate',
      key: 'paymentDate',
      render: (text: string) =>
        text ? new Date(text).toLocaleString() : 'Not paid yet',
      sorter: (a, b) => {
        if (!a.paymentDate) return 1;
        if (!b.paymentDate) return -1;
        return (
          new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
        );
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (raw: number | string) => {
        const t = Number(raw);
        return <Tag color={typeColors[t] || 'default'}>{getTypeText(t)}</Tag>;
      },
      filters: [
        { text: 'Registration', value: TypePayment.Fee },
        { text: 'Sponsorship', value: TypePayment.Donate },
        { text: 'Award', value: TypePayment.Award },
      ],
      onFilter: (value, record) => Number(record.type) === value,
    },
  ];

  const pieConfig = {
    appendPadding: 10,
    angleField: 'value',
    colorField: 'type',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [{ type: 'pie-legend-active' }, { type: 'element-active' }],
  };

  const renderPaymentTypePieChart = () => {
    const config = {
      ...pieConfig,
      data: paymentTypeData,
      color: (datum: any, defaultColor?: string) => {
        // map the chart’s “type” string back to your numeric enum
        const key =
          datum.type === 'Registration'
            ? TypePayment.Fee
            : datum.type === 'Sponsorship'
              ? TypePayment.Donate
              : TypePayment.Award;
        return typeColors[key] || defaultColor || '#000';
      },
      radius: 0.7,
      innerRadius: 0.6,
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value} ₫',
        style: {
          textAlign: 'center',
          fontSize: '14px',
          fill: '#fff',
        },
      },
      statistic: {
        title: {
          style: {
            fontSize: '14px',
          },
          content: 'Payment',
        },
        content: {
          style: {
            fontSize: '16px',
          },
          content: 'Types',
        },
      },
    };
    return <Pie {...config} />;
  };

  const renderStatusPieChart = () => {
    const config = {
      ...pieConfig,
      data: statusData,
      color: ['#52c41a', '#faad14', '#f5222d', '#1890ff'],
      radius: 0.7,
      innerRadius: 0.6,
      label: {
        type: 'inner',
        offset: '-50%',
        content: '{value}',
        style: {
          textAlign: 'center',
          fontSize: '14px',
          fill: '#fff',
        },
      },
      statistic: {
        title: {
          style: {
            fontSize: '14px',
          },
          content: 'Payment',
        },
        content: {
          style: {
            fontSize: '16px',
          },
          content: 'Status',
        },
      },
    };
    return <Pie {...config} />;
  };

  const renderMonthlyChart = () => {
    const config = {
      data: monthlyPaymentsData,
      isGroup: true,
      xField: 'month',
      yField: 'amount',
      seriesField: 'type',
      marginRatio: 0.1,
      columnWidthRatio: 0.8,
      columnStyle: {
        radius: [40, 40, 0, 0],
      },
      color: (datum: any, defaultColor?: string) => {
        const key =
          datum.type === 'Registration'
            ? TypePayment.Fee
            : datum.type === 'Sponsorship'
              ? TypePayment.Donate
              : TypePayment.Award;
        return typeColors[key] || defaultColor || '#000';
      },
      label: {
        position: 'top' as const,
        style: { fill: 'black', opacity: 0.6 },
      },
      legend: {
        position: 'top-right' as const,
      },
      autoFit: true,
      padding: [30, 30, 50, 50],
    };

    return <Column {...config} />;
  };

  const filterBillsByTab = () => {
    if (!bills) return [];
    switch (activeTab) {
      case 'paid':
        return bills.filter((bill) => Number(bill.status) === 1);
      case 'registration':
        return bills.filter(
          (bill) =>
            Number(bill.status) === PaymentStatus.Completed &&
            Number(bill.type) === TypePayment.Fee
        );
      case 'sponsorship':
        return bills.filter(
          (bill) =>
            Number(bill.status) === PaymentStatus.Completed &&
            Number(bill.type) === TypePayment.Donate
        );
      case 'award':
        return bills.filter(
          (bill) =>
            Number(bill.status) === PaymentStatus.Completed &&
            Number(bill.type) === TypePayment.Award
        );
      case 'all':
      default:
        return bills;
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p>Loading payment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Title level={4} type="danger">
            Error loading payment data
          </Title>
          <p>{(error as Error).message}</p>
          <Button
            type="primary"
            onClick={() => refetch()}
            icon={<ReloadOutlined />}
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="payment-admin-container">
      {/* Summary Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: '16px' }}>
                  Total Revenue
                </Text>
              }
              value={statistics.totalAmount}
              precision={0}
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
              prefix={<DollarOutlined />}
              suffix="₫"
              formatter={(value) => value?.toLocaleString()}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge
                status="success"
                text={
                  <Text type="secondary">
                    {statistics.totalCount} transactions
                  </Text>
                }
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: '16px' }}>
                  Registration Fee
                </Text>
              }
              value={statistics.totalFee}
              precision={0}
              valueStyle={{
                color: typeColors[TypePayment.Fee],
                fontSize: '24px',
              }}
              prefix={<FileDoneOutlined />}
              suffix="₫"
              formatter={(value) => value?.toLocaleString()}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge
                status="success"
                text={
                  <Text type="secondary">{statistics.feeCount} payments</Text>
                }
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: '16px' }}>
                  Sponsorship
                </Text>
              }
              value={statistics.totalSponsor}
              precision={0}
              valueStyle={{
                color: typeColors[TypePayment.Donate],
                fontSize: '24px',
              }}
              prefix={<GiftOutlined />}
              suffix="₫"
              formatter={(value) => value?.toLocaleString()}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge
                status="warning"
                text={
                  <Text type="secondary">
                    {statistics.sponsorCount} sponsorships
                  </Text>
                }
              />
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card
            bordered={false}
            hoverable
            style={{
              height: '100%',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <Statistic
              title={
                <Text strong style={{ fontSize: '16px' }}>
                  Awards
                </Text>
              }
              value={statistics.totalAward}
              precision={0}
              valueStyle={{
                color: typeColors[TypePayment.Award],
                fontSize: '24px',
              }}
              prefix={<ApartmentOutlined />}
              suffix="₫"
              formatter={(value) => value?.toLocaleString()}
            />
            <div style={{ marginTop: '8px' }}>
              <Badge
                status="warning"
                text={
                  <Text type="secondary">{statistics.awardCount} awards</Text>
                }
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} md={24} lg={16}>
          <Card
            bordered={false}
            title={
              <Space>
                <BarChartOutlined style={{ color: '#1890ff' }} />
                <span>Monthly Payment Analysis</span>
                <Select
                  value={yearFilter}
                  onChange={(value) => setYearFilter(value)}
                  style={{ marginLeft: 16, width: 100 }}
                >
                  {[2023, 2024, 2025].map((year) => (
                    <Option key={year} value={year}>
                      {year}
                    </Option>
                  ))}
                </Select>
              </Space>
            }
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <div style={{ height: 320 }}>{renderMonthlyChart()}</div>
          </Card>
        </Col>
        <Col xs={24} md={12} lg={8}>
          <Card
            bordered={false}
            title={
              <Space>
                <PieChartOutlined style={{ color: '#722ed1' }} />
                <span>Payment Distribution</span>
              </Space>
            }
            style={{
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <Row gutter={16}>
              <Col span={24}>
                <Tabs defaultActiveKey="type" centered>
                  <TabPane tab="By Type" key="type">
                    <div style={{ height: 250 }}>
                      {renderPaymentTypePieChart()}
                    </div>
                  </TabPane>
                  <TabPane tab="By Status" key="status">
                    <div style={{ height: 250 }}>{renderStatusPieChart()}</div>
                  </TabPane>
                </Tabs>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Payment Records */}
      <Card
        bordered={false}
        title={
          <Space>
            <DollarOutlined style={{ color: '#52c41a' }} />
            <span>Payment Records</span>
            {loadingUsers && <Spin size="small" />}
          </Space>
        }
        style={{
          borderRadius: '8px',
          marginBottom: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
        }}
        extra={
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
        }
      >
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          style={{ marginBottom: 16 }}
          tabBarStyle={{ marginBottom: 16 }}
        >
          <TabPane
            tab={
              <Tooltip title="All Payments">
                <Space>
                  <span>All</span>
                  <Badge
                    count={statistics.totalCount}
                    style={{ backgroundColor: '#1890ff' }}
                  />
                </Space>
              </Tooltip>
            }
            key="all"
          />
          <TabPane
            tab={
              <Tooltip title="Paid Payments">
                <Space>
                  <span>Registration Fee</span>
                  <Badge
                    count={statistics.feeCount}
                    style={{ backgroundColor: typeColors[TypePayment.Fee] }}
                  />
                </Space>
              </Tooltip>
            }
            key="fee"
          />
          <TabPane
            tab={
              <Tooltip title="Sponsorships">
                <Space>
                  <span>Sponsorships</span>
                  <Badge
                    count={statistics.sponsorCount}
                    style={{ backgroundColor: typeColors[TypePayment.Donate] }}
                  />
                </Space>
              </Tooltip>
            }
            key="sponsorship"
          />
          <TabPane
            tab={
              <Tooltip title="Award Payments">
                <Space>
                  <span>Awards</span>
                  <Badge
                    count={statistics.awardCount}
                    style={{ backgroundColor: typeColors[TypePayment.Award] }}
                  />
                </Space>
              </Tooltip>
            }
            key="award"
          />
        </Tabs>

        <Table
          columns={columns}
          dataSource={filterBillsByTab()}
          rowKey="id"
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            pageSizeOptions: ['50', '100'],
            defaultPageSize: 50,
          }}
          bordered
          size="middle"
          scroll={{ x: 'max-content' }}
          rowClassName={(record) => {
            if (Number(record.status) === 2) return 'pending-row';
            if (Number(record.status) === 3) return 'failed-row';
            return '';
          }}
          summary={(pageData) => {
            let totalAmount = 0;
            pageData.forEach(({ amount }) => {
              totalAmount += amount;
            });
            return (
              <>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={2}>
                    <Text strong>Page Total</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} colSpan={2}>
                    <Text strong style={{ color: '#389e0d' }}>
                      ₫{totalAmount.toLocaleString()}
                    </Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell
                    index={2}
                    colSpan={5}
                  ></Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />
      </Card>

      <style>
        {`
          .pending-row {
            background-color: #fffbe6;
          }
          .failed-row {
            background-color: #fff1f0;
          }
          .payment-admin-container .ant-table-thead > tr > th {
            background-color: #f6ffed;
            font-weight: bold;
          }
          .payment-admin-container .ant-statistic-content {
            font-family: 'Arial', sans-serif;
          }
        `}
      </style>
    </div>
  );
};

export default PaymentAdmin;
