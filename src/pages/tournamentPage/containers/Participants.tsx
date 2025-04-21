import { Avatar, Button, Card, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { RegistrationDetail } from '@src/modules/Tournament/models';
import { useSelector } from 'react-redux';

type PlayersTableProps = {
  tournamentId: number;
  tournamentName?: string; // Optional tournament name for display
  registrations: RegistrationDetail[];
  refetch: () => void;
};

const PlayerCard = ({
  firstName,
  secondName,
  lastName,
  avatarUrl,
  email,
  ranking,
}) => (
  <Card className="profile-card border rounded shadow-sm mb-2 card">
    <div className="d-flex align-items-center">
      <div className="avatar-container">
        <Avatar
          style={{ marginLeft: '10px' }}
          size={40}
          src={
            avatarUrl ??
            'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
          }
          className="bg-primary"
        />
      </div>
      <div className="ms-3 user-info">
        <div className="mb-0 fw-bold" style={{ fontSize: '14px' }}>
          {firstName} {secondName} {lastName}
        </div>
        <p className="d-flex small text-muted">{email}</p>
      </div>
      <Button
        className="position-absolute end-0 translate-middle-y me-3 d-flex justify-content-center align-items-center"
        style={{
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#05155E1A',
        }}
      >
        <span className="fw-200">Level {ranking}</span>
      </Button>
    </div>
  </Card>
);

export const Participants = ({ registrations = [] }: PlayersTableProps) => {
  const [filteredRegistrations] = useState<RegistrationDetail[]>(registrations);

  const user = useSelector((state: any) => state.auth.user);

  // const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<any> => ({
  //   filterDropdown: ({
  //     setSelectedKeys,
  //     selectedKeys,
  //     confirm,
  //     clearFilters,
  //   }) => (
  //     <div style={{ padding: 8 }}>
  //       <Input
  //         ref={searchInput}
  //         placeholder={`Search ${dataIndex}`}
  //         value={selectedKeys[0]}
  //         onChange={(e) =>
  //           setSelectedKeys(e.target.value ? [e.target.value] : [])
  //         }
  //         onPressEnter={() =>
  //           handleSearch(selectedKeys as string[], confirm, dataIndex)
  //         }
  //         style={{ marginBottom: 8, display: 'block' }}
  //       />
  //       <Space>
  //         <Button
  //           type="primary"
  //           onClick={() =>
  //             handleSearch(selectedKeys as string[], confirm, dataIndex)
  //           }
  //           icon={<SearchOutlined />}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Search
  //         </Button>
  //         <Button
  //           onClick={() => handleReset(clearFilters)}
  //           size="small"
  //           style={{ width: 90 }}
  //         >
  //           Reset
  //         </Button>
  //       </Space>
  //     </div>
  //   ),
  //   filterIcon: (filtered: boolean) => (
  //     <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
  //   ),
  //   onFilter: (value, record) =>
  //     record[dataIndex]
  //       ? record[dataIndex]
  //           .toString()
  //           .toLowerCase()
  //           .includes((value as string).toLowerCase())
  //       : '',
  //   onFilterDropdownVisibleChange: (visible) => {
  //     if (visible) {
  //       setTimeout(() => searchInput.current?.select(), 100);
  //     }
  //   },
  //   render: (text) =>
  //     searchedColumn === dataIndex ? (
  //       <span style={{ backgroundColor: '#ffc069', padding: 0 }}>{text}</span>
  //     ) : (
  //       text
  //     ),
  // });

  // 1. Kiểm tra xem có bản ghi nào có partner không
  const hasPartner = registrations.some((item) => !!item.partnerId);

  // 2. Định nghĩa các cột chung
  const baseColumns: ColumnsType<RegistrationDetail> = [
    {
      title: hasPartner ? 'Player 1' : 'Player',
      dataIndex: ['playerDetails', 'avatarUrl'],
      key: 'avatarUrl',
      render: (_: string, record) => (
        // url ? (
        //   <Avatar src={url} size={40} />
        // ) : (
        //   <Avatar icon={<UserOutlined />} size={40} />
        // ),

        <PlayerCard
          firstName={record.playerDetails.firstName}
          secondName={record.playerDetails.secondName}
          lastName={record.playerDetails.lastName}
          avatarUrl={record.playerDetails.avatarUrl}
          email={record.playerDetails.email}
          ranking={record.playerDetails.ranking}
        />
      ),
    },
  ];

  // 3. Nếu có partner thì thêm 2 cột này
  const partnerColumns: ColumnsType<RegistrationDetail> = [
    {
      title: hasPartner ? 'Player 2' : 'Player',
      dataIndex: ['partnerDetails', 'avatarUrl'],
      key: 'avatarUrl',
      render: (_: string, record) => (
        // url ? (
        //   <Avatar src={url} size={40} />
        // ) : (
        //   <Avatar icon={<UserOutlined />} size={40} />
        // ),

        <PlayerCard
          firstName={record.playerDetails.firstName}
          secondName={record.playerDetails.secondName}
          lastName={record.playerDetails.lastName}
          avatarUrl={record.playerDetails.avatarUrl}
          email={record.playerDetails.email}
          ranking={record.playerDetails.ranking}
        />
      ),
    },
  ];

  // 4. Kết hợp columns trước khi render <Table>
  const columns: ColumnsType<RegistrationDetail> = [
    ...baseColumns,
    ...(hasPartner ? partnerColumns : []),
  ];

  const rowClassName = (record: RegistrationDetail) => {
    // Check if the player's id or the partner's id matches the user id and highlight the row
    if (record.playerId === user?.id || record.partnerId === user?.id) {
      return 'highlight-row';
    }
    return '';
  };

  return (
    <>
      <style>
        {`
          .highlight-row {
            background-color:rgb(250, 215, 166) !important;
          }
        `}
      </style>
      <div>
        <Table
          columns={columns}
          dataSource={filteredRegistrations}
          rowKey="id"
          style={{ backgroundColor: '#ffffff' }}
          pagination={{ pageSize: 10 }}
          rowClassName={rowClassName}
        />
      </div>
    </>
  );
};

export default Participants;
