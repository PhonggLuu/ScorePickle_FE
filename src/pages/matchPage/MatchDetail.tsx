// import React from 'react';
// import { useState } from 'react';
// import {
//   Input,
//   DatePicker,
//   Avatar,
//   Radio,
//   Collapse,
//   Typography,
//   Tag,
// } from 'antd';
// import { UserOutlined } from '@ant-design/icons';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'antd/dist/reset.css';
// import type { CollapseProps } from 'antd';
// import dayjs from 'dayjs';
// import { MatchCategory, MatchFormat, Member } from '@src/modules/Match/models';
// import { useParams } from 'react-router-dom';
// import { useGetMatchDetail } from '@src/modules/Match/hooks/useGetMatchDetail';

// const { Title, Text } = Typography;

// export const MatchDetail: React.FC = () => {
//   const [activeKey, setActiveKey] = useState<string | string[]>(['1']);
//   const { id } = useParams<{ id: string }>();
//   const { data } = useGetMatchDetail(Number(id || 0));

//   // Safely extract members for each team
//   if (data === undefined) {
//     return;
//   }
//   const team1Members: Member[] = Array.isArray(data.teams[0]?.members)
//     ? data.teams[0].members
//     : [];
//   const team2Members: Member[] = Array.isArray(data.teams[1]?.members)
//     ? data.teams[1].members
//     : [];

//   // Helper to render a single member
//   const renderMember = (member: Member) => {
//     const pd = member.playerDetails || {};
//     if (!pd) return null;
//     const name =
//       pd.firstName || pd.lastName
//         ? `${pd.firstName ?? ''} ${pd.lastName ?? ''}`.trim()
//         : pd.name || `Player ${member.playerId}`;
//     const avatarUrl = pd.avatarUrl || undefined;
//     const level = pd.userDetails?.experienceLevel ?? 0;

//     return (
//       <div
//         key={member.id}
//         className="selected-player border p-2 rounded-pill mb-2"
//         style={{ background: 'rgba(177, 177, 177, 0.5)' }}
//       >
//         <Avatar
//           src={avatarUrl}
//           icon={!avatarUrl ? <UserOutlined /> : undefined}
//         />
//         <span className="ms-2">{name}</span>
//         <Tag color="blue" className="ms-3">
//           {level}
//         </Tag>
//       </div>
//     );
//   };

//   const items: CollapseProps['items'] = [
//     {
//       key: '1',
//       label: (
//         <Title level={4} style={{ margin: 0 }}>
//           Match
//         </Title>
//       ),
//       children: (
//         <div className="match-form">
//           {/* Match Info Row */}
//           <div className="row mb-4">
//             <div className="col-md-4">
//               <label className="form-label">Title</label>
//               <Input className="rounded-pill p-3" value={data.title} readOnly />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Description</label>
//               <Input
//                 className="rounded-pill p-3"
//                 value={data.description}
//                 readOnly
//               />
//             </div>
//             <div className="col-md-4">
//               <label className="form-label">Date</label>
//               <DatePicker
//                 className="w-100 rounded-pill p-3"
//                 value={dayjs(data.matchDate)}
//                 showTime={{ format: 'HH:mm' }}
//                 format="YYYY-MM-DD HH:mm"
//                 disabled
//               />
//             </div>
//           </div>

//           {/* Teams and Players */}
//           <div className="row mb-4">
//             <div className="col-md-6">
//               <label className="form-label">
//                 {data.matchFormat === MatchFormat.SingleFemale ||
//                 data.matchFormat === MatchFormat.SingleMale
//                   ? 'Player 1'
//                   : 'Team 1'}
//               </label>
//               {team1Members.map(renderMember)}

//               <label className="form-label mt-4">
//                 {data.matchFormat === MatchFormat.SingleFemale ||
//                 data.matchFormat === MatchFormat.SingleMale
//                   ? 'Player 2'
//                   : 'Team 2'}
//               </label>
//               {team2Members.map(renderMember)}
//             </div>

//             {/* Match Settings */}
//             <div className="col-md-6">
//               <div className="d-flex justify-content-between align-items-center my-3">
//                 <label className="form-label">Match Category</label>
//                 <Radio.Group value={data.matchCategory} disabled>
//                   <Radio.Button value={MatchCategory.Competitive}>
//                     Competitive
//                   </Radio.Button>
//                   <Radio.Button value={MatchCategory.Custom}>
//                     Friendly
//                   </Radio.Button>
//                 </Radio.Group>
//               </div>

//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <label className="form-label">Match Type</label>
//                 <Text>{data.matchFormat}</Text>
//               </div>

//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <label className="form-label">Score to Win</label>
//                 <Text>{data.winScore}</Text>
//               </div>

//               {/* <div className="d-flex justify-content-between align-items-center mb-3">
//                 <label className="form-label">Venue</label>
//                 <Card>
//                         <Image src={data.venue.urlImage} />
//                         <br />
//                         <Text>{venue.name}</Text>
//                       </Card>
//               </div> */}

//               <div className="d-flex justify-content-between align-items-center mb-3">
//                 <label className="form-label">Referee</label>
//                 <Text>{data.refereeId ? `ID: ${data.refereeId}` : 'TBD'}</Text>
//               </div>
//             </div>
//           </div>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="container p-5">
//       <div className="d-flex justify-content-between align-items-center">
//         <h1 className="display-4 fw-bold mb-4 text-white">Match Detail</h1>
//       </div>
//       <div className="p-3 bg-light">
//         <Collapse
//           items={items}
//           activeKey={activeKey}
//           onChange={setActiveKey as (key: string | string[]) => void}
//           bordered={false}
//         />
//       </div>
//     </div>
//   );
// };

// export default MatchDetail;

import { Button, DatePicker, Image, Modal } from 'antd';
import { MapPin, Calendar, Trophy, Users } from 'lucide-react';
import { useGetMatchDetail } from '@src/modules/Match/hooks/useGetMatchDetail';
import { useParams } from 'react-router-dom';
import {
  MatchCategory,
  MatchFormat,
  MatchStatus,
} from '@src/modules/Match/models';
import dayjs from 'dayjs';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useJoinMatch } from '@src/modules/Match/hooks/useJoinMatch';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useMatchRealtimeLogs } from '@src/modules/Match/hooks/useMatchRealtimeLogs';

export default function MatchDetails() {
  const { id } = useParams<{ id: string }>();
  const { data, refetch } = useGetMatchDetail(Number(id || 0));
  const { mutate: joinMatch } = useJoinMatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user);
  const { logs } = useMatchRealtimeLogs(Number(id), 1);
  const team1 = logs.filter((log) => log.team === 1);
  const team2 = logs.filter((log) => log.team === 2);
  console.log(logs);
  console.log(team1);
  console.log(team2);

  if (data === undefined) {
    return;
  }

  const handleOnClick = () => setIsModalVisible(true);
  const handleCancel = () => setIsModalVisible(false);
  const handleJoinMatch = () => {
    const payload = {
      matchId: Number(id),
      userJoinId: user?.id ?? 0,
    };
    joinMatch({ data: payload });
    setIsModalVisible(false);
    refetch();
  };

  return (
    <div className="card shadow container mt-4">
      <div className="card-header text-dark">
        <div className="d-flex justify-content-between align-items-center">
          <h1 className="h3 my-3  ">{data.title}</h1>
          <span className={`badge ${MatchStatus[data.status]}`}>
            ${MatchStatus[data.status]}
          </span>
        </div>
      </div>

      <div className="card-body mb-3">
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <MapPin className="me-2" size={20} />
              <span>Description: {data.description}</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Calendar className="me-2" size={20} />
              Match Date:{' '}
              <DatePicker
                value={dayjs(data.matchDate)}
                showTime={{ format: 'HH:mm' }}
                format="YYYY-MM-DD HH:mm"
                disabled
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="d-flex align-items-center mb-3">
              <Users className="me-2" size={20} />
              <span>Match Format: {MatchFormat[data.matchFormat]}</span>
            </div>
            <div className="d-flex align-items-center mb-3">
              <Trophy className="me-2" size={20} />
              <span>
                Match Type:{' '}
                {data.matchCategory === MatchCategory.Custom
                  ? 'Friendly'
                  : 'Competitive'}
              </span>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <div className="row align-items-center text-center">
              {/* Team 1 */}
              <div className="col-md-5">
                <div className="card h-100">
                  <div className="card-header">
                    <h3 className="h5 mb-0">{data.teams[0].name}</h3>
                  </div>
                  <div className="card-body">
                    {MatchFormat[data.matchFormat]
                      .toLowerCase()
                      .includes('single') ? (
                      data.player1 && (
                        <div key={data.player1.id} className="my-5">
                          <div className="d-flex flex-column align-items-center">
                            <div
                              className="position-relative mb-2"
                              style={{ width: 50, height: 50 }}
                            >
                              <Image
                                src={
                                  data.player1.avatarUrl ??
                                  'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                }
                                alt={data.player1.avatarUrl}
                                className="rounded-circle object-fit-cover border"
                              />
                            </div>
                            <h4 className="h6 mb-1">{`${data.player1.firstName} ${data.player1.lastName}`}</h4>
                          </div>
                        </div>
                      )
                    ) : (
                      <>
                        {data.player1 && (
                          <div
                            key={data.player1 ? data.player1.id : 0}
                            className="my-5"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <Image
                                  src={
                                    data.player1
                                      ? data.player1.avatarUrl
                                      : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                  }
                                  alt={
                                    data.player1
                                      ? `${data.player1.firstName} ${data.player1.lastName}`
                                      : ''
                                  }
                                  className="rounded-circle object-fit-cover border"
                                />
                              </div>
                              <h4 className="h6 mb-1">
                                {data.player1
                                  ? `${data.player1.firstName} ${data.player1.lastName}`
                                  : ''}
                              </h4>
                            </div>
                          </div>
                        )}

                        {data.player2 && (
                          <div
                            key={data.player2 ? data.player2.id : 0}
                            className="my-5"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <Image
                                  src={
                                    data.player2
                                      ? data.player2.avatarUrl
                                      : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                  }
                                  alt={
                                    data.player2
                                      ? `${data.player2.firstName} ${data.player2.lastName}`
                                      : ''
                                  }
                                  className="rounded-circle object-fit-cover border"
                                />
                              </div>
                              <h4 className="h6 mb-1">
                                {data.player2
                                  ? `${data.player2.firstName} ${data.player2.lastName}`
                                  : ''}
                              </h4>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Score */}
              <div className="col-md-2 my-3 my-md-0">
                <div className="d-flex justify-content-center align-items-center">
                  <div className="display-4 fw-bold">
                    {/* {data.teams[0].id} - {data.teams[1].id} */}
                  </div>
                </div>
              </div>

              {/* Team 2 */}
              <div className="col-md-5">
                <div className="card h-100">
                  <div className="card-header">
                    <h3 className="h5 mb-0">{data.teams[1].name}</h3>
                  </div>
                  <div className="card-body">
                    {MatchFormat[data.matchFormat]
                      .toLowerCase()
                      .includes('single') ? (
                      data.player3 ? (
                        <div key={data.player3.id} className="my-5">
                          <div className="d-flex flex-column align-items-center">
                            <div
                              className="position-relative mb-2"
                              style={{ width: 50, height: 50 }}
                            >
                              <Image
                                src={
                                  data.player3.avatarUrl ??
                                  'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                }
                                alt={data.player3.avatarUrl}
                                className="rounded-circle object-fit-cover border"
                              />
                            </div>
                            <h4 className="h6 mb-1">{`${data.player3.firstName} ${data.player3.lastName}`}</h4>
                          </div>
                        </div>
                      ) : (
                        <div className="my-5">
                          <div className="d-flex flex-column align-items-center">
                            <div
                              className="position-relative mb-2"
                              style={{ width: 50, height: 50 }}
                            >
                              <PlusCircleOutlined
                                style={{ fontSize: '50px', cursor: 'pointer' }}
                                className="rounded-circle object-fit-cover border"
                                onClick={handleOnClick}
                              />
                            </div>
                            <h4 className="h6 mb-1">Empty</h4>
                          </div>
                        </div>
                      )
                    ) : (
                      <>
                        {data.player3 ? (
                          <div
                            key={data.player3 ? data.player3.id : 0}
                            className="my-5"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <Image
                                  src={
                                    data.player3
                                      ? data.player3.avatarUrl
                                      : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                  }
                                  alt={
                                    data.player3
                                      ? `${data.player3.firstName} ${data.player3.lastName}`
                                      : ''
                                  }
                                  className="rounded-circle object-fit-cover border"
                                />
                              </div>
                              <h4 className="h6 mb-1">
                                {data.player3
                                  ? `${data.player3.firstName} ${data.player3.lastName}`
                                  : ''}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          <div className="my-5">
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <PlusCircleOutlined
                                  style={{
                                    fontSize: '50px',
                                    cursor: 'pointer',
                                  }}
                                  className="rounded-circle object-fit-cover border"
                                  onClick={handleOnClick}
                                />
                              </div>
                              <h4 className="h6 mb-1">Empty</h4>
                            </div>
                          </div>
                        )}

                        {data.player4 ? (
                          <div
                            key={data.player4 ? data.player4.id : 0}
                            className="my-5"
                          >
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <Image
                                  src={
                                    data.player4
                                      ? data.player4.avatarUrl
                                      : 'https://inkythuatso.com/uploads/thumbnails/800/2023/03/9-anh-dai-dien-trang-inkythuatso-03-15-27-03.jpg'
                                  }
                                  alt={
                                    data.player4
                                      ? `${data.player4.firstName} ${data.player4.lastName}`
                                      : ''
                                  }
                                  className="rounded-circle object-fit-cover border"
                                />
                              </div>
                              <h4 className="h6 mb-1">
                                {data.player4
                                  ? `${data.player4.firstName} ${data.player4.lastName}`
                                  : ''}
                              </h4>
                            </div>
                          </div>
                        ) : (
                          <div className="my-5">
                            <div className="d-flex flex-column align-items-center">
                              <div
                                className="position-relative mb-2"
                                style={{ width: 50, height: 50 }}
                              >
                                <PlusCircleOutlined
                                  style={{
                                    fontSize: '50px',
                                    cursor: 'pointer',
                                  }}
                                  className="rounded-circle object-fit-cover border"
                                  onClick={handleOnClick}
                                />
                              </div>
                              <h4 className="h6 mb-1">Empty</h4>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {logs1 && (
            <div className="d-md-none mt-3">
              <div
                className="alert alert-danger d-flex align-items-center"
                role="alert"
              >
                <div className="d-flex align-items-center">
                  <div className="me-2">
                    <div
                      className="spinner-grow spinner-grow-sm text-danger"
                      role="status"
                    >
                      <span className="visually-hidden"></span>
                    </div>
                  </div>
                  <div>
                    {logs1.map((log, index) => (
                      <div key={index}>{log.points}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <Modal
          title="Join Match"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={[
            <Button key="no" onClick={handleCancel}>
              No
            </Button>,
            <Button key="yes" type="primary" onClick={() => handleJoinMatch()}>
              Yes
            </Button>,
          ]}
        >
          <p>Do you wanna join this match?</p>
        </Modal>
      </div>
    </div>
  );
}
