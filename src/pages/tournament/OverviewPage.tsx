import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Card, Col, Input, Row, Space, Table, Tag } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllTournaments } from '@src/modules/Tournament/hooks/useGetAllTournaments';

type DataIndex = string;

export const OverviewPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading, refetch } = useGetAllTournaments(
    currentPage,
    pageSize
  );
  const [searchText, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  // todo: remove this
  console.log(searchText);

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
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      ...getColumnSearchProps('location'),
    },
    {
      title: 'Max Players',
      dataIndex: 'maxPlayer',
      key: 'maxPlayer',
    },
    {
      title: 'Total Prize',
      dataIndex: 'totalPrize',
      key: 'totalPrize',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'green' : 'red'}>{status}</Tag>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      filters: [
        { text: 'Singles', value: 'Singles' },
        { text: 'Doubles', value: 'Doubles' },
      ],
      onFilter: (value, record) => record.type.indexOf(value as string) === 0,
      render: (type: string) => (
        <Tag color={type === 'Singles' ? 'blue' : 'purple'}>{type}</Tag>
      ),
    },
    {
      title: 'Is Accepted',
      dataIndex: 'isAccept',
      key: 'isAccept',
      filters: [
        { text: 'Accepted', value: true },
        { text: 'Not Accepted', value: false },
      ],
      onFilter: (value, record) => record.isAccept === value,
      render: (isAccept: boolean) =>
        isAccept ? (
          <Tag color="green">Accepted</Tag>
        ) : (
          <Tag color="green">Rejected</Tag>
        ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (record) => <Link to={`/tournament/${record.id}`}>Detail</Link>,
    },
  ];

  const totalTournaments = data?.totalItems || 0;
  const activeTournaments =
    data?.data.filter((t) => t.status === 'Active').length || 0;
  const singlesTournaments =
    data?.data.filter((t) => t.type === 'Singles').length || 0;
  const doublesTournaments =
    data?.data.filter((t) => t.type === 'Doubles').length || 0;

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card title="Total Tournaments" bordered={false}>
            {totalTournaments}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Active Tournaments" bordered={false}>
            {activeTournaments}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Singles Tournaments" bordered={false}>
            {singlesTournaments}
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Doubles Tournaments" bordered={false}>
            {doublesTournaments}
          </Card>
        </Col>
      </Row>
      <Button
        type="primary"
        onClick={() => refetch()}
        style={{ marginBottom: 16 }}
      >
        Refetch
      </Button>
      <Table
        columns={[
          {
            title: 'STT',
            render: (index) => (currentPage - 1) * pageSize + index + 1,
          },
          ...columns,
        ]}
        dataSource={data?.data}
        loading={isLoading}
        rowKey="id"
        pagination={{
          current: data?.currentPage,
          total: data?.totalItems,
          pageSize: data?.pageSize,
          onChange: handlePaginationChange,
          pageSizeOptions: ['10', '20', '50'],
          showSizeChanger: true,
        }}
      />
    </div>
  );
};

export default OverviewPage;
