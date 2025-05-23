import {
  SearchOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
  UserOutlined,
  ClockCircleOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Pie } from '@ant-design/plots';
import type { InputRef } from 'antd';
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Typography,
  message,
  Tooltip,
} from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { useRef, useState, useMemo } from 'react';
import {
  RegistrationDetail,
  TouramentregistrationStatus,
} from '@src/modules/Tournament/models';
import { useApprovalPlayerTournament } from '@src/modules/Tournament/hooks/useApprovalPlayerTournament';

const { Text, Title } = Typography;

type DataIndex = string;

type PlayersTableProps = {
  tournamentId: number;
  tournamentName?: string; // Optional tournament name for display
  registrations: RegistrationDetail[];
  refetch: () => void;
};

// Define status color and label mappings
const statusColors = {
  [TouramentregistrationStatus.Pending]: 'orange',
  [TouramentregistrationStatus.Approved]: 'green',
  [TouramentregistrationStatus.Rejected]: 'red',
  [TouramentregistrationStatus.Waiting]: 'blue',
  [TouramentregistrationStatus.Eliminated]: 'black',
  [TouramentregistrationStatus.Request]: '#ffc069',
  [TouramentregistrationStatus.Winner]: '#52c41a',
};

const statusLabels = {
  [TouramentregistrationStatus.Pending]: 'Pending',
  [TouramentregistrationStatus.Approved]: 'Approved',
  [TouramentregistrationStatus.Rejected]: 'Rejected',
  [TouramentregistrationStatus.Waiting]: 'Waiting',
  [TouramentregistrationStatus.Eliminated]: 'Eliminated',
  [TouramentregistrationStatus.Request]: 'Request',
  [TouramentregistrationStatus.Winner]: 'Winner',
};

// Vietnamese descriptions for tooltips
const statusDescriptions = {
  [TouramentregistrationStatus.Pending]: 'Đã accept từ partner cho payment',
  [TouramentregistrationStatus.Approved]: 'Đã payment',
  [TouramentregistrationStatus.Rejected]: 'Không đồng ý cho tham gia giải đấu',
  [TouramentregistrationStatus.Waiting]: 'Chờ accept từ partner',
  [TouramentregistrationStatus.Eliminated]: 'Bị loại',
  [TouramentregistrationStatus.Request]: 'Nhận được lời mời tham gia',
  [TouramentregistrationStatus.Winner]: 'Người thắng giải đấu',
};

const PlayersTable = ({
  tournamentId,
  tournamentName,
  registrations = [],
  refetch,
}: PlayersTableProps) => {
  const [, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [filteredRegistrations] = useState<RegistrationDetail[]>(registrations);

  const { mutate: approvePlayer } = useApprovalPlayerTournament();

  // Handle player status changes
  const handleStatusChange = (
    playerId: number,
    partnerId: number | undefined,
    status: TouramentregistrationStatus
  ) => {
    approvePlayer(
      {
        tournamentId, // Use the prop tournamentId consistently
        playerId,
        partnerId,
        isApproved: status,
      },
      {
        onSuccess: () => {
          refetch();
          message.success(`Player status updated to ${statusLabels[status]}`);
        },
        onError: (error) => {
          message.error(`Error updating player status: ${error.message}`);
        },
      }
    );
  };

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
            .toLowerCase()
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

  const columns: ColumnsType<any> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ...getColumnSearchProps('id'),
    },
    {
      title: 'Player',
      dataIndex: ['playerDetails', 'firstName'],
      key: 'firstName',
      ...getColumnSearchProps('firstName'),
      render: (_: string, record: RegistrationDetail) => (
        <span>
          {record?.playerDetails?.firstName} {record?.playerDetails?.lastName}
        </span>
      ),
    },
    {
      title: 'Email',
      dataIndex: ['playerDetails', 'email'],
      key: 'email',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'Partner',
      dataIndex: ['partnerDetails', 'firstName'],
      key: 'partnerFirstName',
      render: (_: string, record: RegistrationDetail) => (
        <span>
          {record.partnerDetails?.firstName} {record.partnerDetails?.lastName}
        </span>
      ),
    },
    {
      title: 'Partner Email',
      dataIndex: ['partnerDetails', 'email'],
      key: 'partnerEmail',
    },
    {
      title: 'Registered At',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      render: (registeredAt: string) => new Date(registeredAt).toLocaleString(),
    },
    {
      title: 'Status',
      dataIndex: 'isApproved', // Changed from status to isApproved
      key: 'isApproved',
      filters: Object.entries(statusLabels).map(([value, text]) => ({
        text,
        value: Number(value),
      })),
      onFilter: (value, record) => record.isApproved === value,
      render: (isApproved: TouramentregistrationStatus) => (
        <Tooltip title={statusDescriptions[isApproved]}>
          <Tag color={statusColors[isApproved] || 'default'}>
            {statusLabels[isApproved] || 'Unknown'}
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => {
        if (record.isApproved === TouramentregistrationStatus.Pending) {
          return (
            <Space wrap>
              {/* Approve Button */}
              <Tooltip title="Set to Approved (Payment received)">
                <Button
                  type="primary"
                  onClick={() =>
                    handleStatusChange(
                      record.playerId,
                      record.partnerId,
                      TouramentregistrationStatus.Approved
                    )
                  }
                  icon={<UserAddOutlined />}
                >
                  Approve
                </Button>
              </Tooltip>

              {/* Rejected Button */}
              <Tooltip title="Set to Rejected (Denied tournament participation)">
                <Button
                  danger
                  onClick={() =>
                    handleStatusChange(
                      record.playerId,
                      record.partnerId,
                      TouramentregistrationStatus.Rejected
                    )
                  }
                  icon={<UserDeleteOutlined />}
                >
                  Reject
                </Button>
              </Tooltip>

              {/* Eliminated Button */}
              <Tooltip title="Set to Waiting (Awaiting partner acceptance)">
                <Button
                  style={{
                    backgroundColor:
                      statusColors[TouramentregistrationStatus.Eliminated],
                    color: 'white',
                  }}
                  onClick={() =>
                    handleStatusChange(
                      record.playerId,
                      record.partnerId,
                      TouramentregistrationStatus.Eliminated
                    )
                  }
                  icon={<StopOutlined />}
                >
                  Eliminate
                </Button>
              </Tooltip>
            </Space>
          );
        }
        return null;
      },
    },
  ];

  // Calculate registration stats for display
  const statusCounts = useMemo(() => {
    const counts = {
      total: filteredRegistrations.length,
      [TouramentregistrationStatus.Pending]: 0,
      [TouramentregistrationStatus.Approved]: 0,
      [TouramentregistrationStatus.Rejected]: 0,
      [TouramentregistrationStatus.Waiting]: 0,
      [TouramentregistrationStatus.Eliminated]: 0,
      [TouramentregistrationStatus.Request]: 0,
      [TouramentregistrationStatus.Winner]: 0,
    };

    filteredRegistrations.forEach((registration) => {
      const status: TouramentregistrationStatus = registration.isApproved;
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  }, [filteredRegistrations]);

  // Prepare data for pie chart
  const chartData = useMemo(() => {
    return Object.entries(statusLabels)
      .map(([status, label]) => ({
        type: label,
        value: statusCounts[Number(status) as TouramentregistrationStatus] || 0,
      }))
      .filter((item) => item.value > 0); // Only show statuses that have at least one player
  }, [statusCounts]);

  const pieConfig = {
    appendPadding: 10,
    data: chartData,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [{ type: 'element-active' }],
    height: 200,
    width: 300,
    legend: {
      position: 'bottom' as const,
    },
  };

  return (
    <div>
      {tournamentName && (
        <Title level={4} style={{ marginBottom: 16 }}>
          Player Registrations for: {tournamentName}
        </Title>
      )}

      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col span={10}>
          <Card title="Registration Statistics" bordered={false}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
        <Col span={14}>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card
                title="Total Players"
                bordered={false}
                headStyle={{ backgroundColor: '#e6f7ff' }}
              >
                <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts.total}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Approved Players"
                bordered={false}
                headStyle={{ backgroundColor: '#f6ffed' }}
              >
                <UserAddOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Approved],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Approved]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Pending Players"
                bordered={false}
                headStyle={{ backgroundColor: '#fff7e6' }}
              >
                <ClockCircleOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Pending],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Pending]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Waiting Players"
                bordered={false}
                headStyle={{ backgroundColor: '#e6f7ff' }}
              >
                <ClockCircleOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Waiting],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Waiting]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Rejected Players"
                bordered={false}
                headStyle={{ backgroundColor: '#fff1f0' }}
              >
                <UserDeleteOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Rejected],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Rejected]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Eliminated Players"
                bordered={false}
                headStyle={{ backgroundColor: '#f0f0f0' }}
              >
                <StopOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Eliminated],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Eliminated]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Requested Players"
                bordered={false}
                headStyle={{
                  backgroundColor:
                    statusColors[TouramentregistrationStatus.Request],
                }}
              >
                <StopOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Request],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Request]}
                </Text>
              </Card>
            </Col>
            <Col span={6}>
              <Card
                title="Winner Players"
                bordered={false}
                headStyle={{
                  backgroundColor:
                    statusColors[TouramentregistrationStatus.Winner],
                }}
              >
                <StopOutlined
                  style={{
                    fontSize: 24,
                    color: statusColors[TouramentregistrationStatus.Winner],
                  }}
                />
                <Text style={{ fontSize: 24, marginLeft: 8 }}>
                  {statusCounts[TouramentregistrationStatus.Winner]}
                </Text>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={filteredRegistrations}
        rowKey="id"
        style={{ backgroundColor: '#ffffff' }}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default PlayersTable;
