import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import { useRef, useState } from 'react';
import { RegistrationDetail } from '@src/modules/Tournament/models';

type DataIndex = string;

type PlayersTableProps = {
  tournamentId: number;
  tournamentName?: string; // Optional tournament name for display
  registrations: RegistrationDetail[];
  refetch: () => void;
};

export const Participants = ({ registrations = [] }: PlayersTableProps) => {
  const [, setSearchText] = useState<string>('');
  const [searchedColumn, setSearchedColumn] = useState<string>('');
  const searchInput = useRef<InputRef>(null);
  const [filteredRegistrations] = useState<RegistrationDetail[]>(registrations);

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
      ...getColumnSearchProps('partnerFirstName'),
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
      ...getColumnSearchProps('partnerEmail'),
    },
  ];

  return (
    <div>
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

export default Participants;
