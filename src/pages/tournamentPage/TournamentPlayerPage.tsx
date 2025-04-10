import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import { useGetAllTournamentsByPlayerId } from '@src/modules/Tournament/hooks/useGetTournamentByPlayerId';
import { useState } from 'react'; // Import useState for filter state management
import { Tabs } from 'antd';
import TabPane from 'antd/es/tabs/TabPane';

const TournamentCard = ({
  id,
  title,
  dates,
  location,
  type,
  registeredCount,
  description,
  skillLevels,
  entryFee,
  status,
}) => (
  <div className="card mb-4">
    <div className="card-body">
      <div className="row ml-2">
        <div className="col-4">
          <h5 className="card-title mb-4" style={{ fontWeight: 'bold' }}>
            {title}
          </h5>
          <p className="card-text">
            <span className="d-flex align-items-center mb-2">
              <CalendarOutlined className="me-2" />
              {dates}
            </span>
            <span className="d-flex align-items-center mb-2">
              <EnvironmentOutlined className="me-2" />
              {location}
            </span>
            <span className="d-flex align-items-center mb-2">
              <TagOutlined className="me-2" />
              {type}
            </span>
            <span className="d-flex align-items-center mb-2">
              <TeamOutlined className="me-2" />
              {registeredCount}
            </span>
          </p>
        </div>
        <div className="col-2"></div>
        <div className="col-6">
          <div className="d-flex justify-content-end mb-2 mr-2">
            <span
              className="border border-light bg-dark text-white rounded-pill p-1 fw-bold fs-7 px-3"
              style={{ fontSize: '0.75rem' }}
            >
              {status}
            </span>
          </div>
          <p className="card-text mt-2">
            <span className="d-flex align-items-center mb-2">
              {description}
            </span>
            <span className="d-flex align-items-center mb-2">
              {skillLevels !== 'null - null' ? (
                <span>
                  <strong>Skill Levels: {skillLevels}</strong>
                </span>
              ) : (
                <span>
                  <strong>Skill Levels: All</strong>
                </span>
              )}
            </span>
            <span className="d-flex align-items-center mb-2">
              <strong>Entry Fee: {entryFee.toLocaleString('vi-VN')}</strong>
            </span>
          </p>
        </div>
      </div>
    </div>
    <div className="card-header">
      <div className="row">
        <div className="col-6">
          <div className="d-flex justify-content-start">
            <Link
              to={`/tournament-detail/${id}`}
              style={{ textDecoration: 'none' }}
              className="border border-dark bg-light text-dark py-2 px-3 rounded fw-bold"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TournamentPlayerPage = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const { data, isLoading } = useGetAllTournamentsByPlayerId(user?.id ?? 0);
  const [filter, setFilter] = useState('All'); // State for filter selection

  const formatDates = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    };

    const formattedStartDate = start.toLocaleDateString('en-US', options);
    const formattedEndDate = end.toLocaleDateString('en-US', options);

    return `${formattedStartDate} - ${formattedEndDate}`;
  };

  // Filter tournaments based on the selected status
  const filteredTournaments = data?.filter((tournament) => {
    if (filter === 'All') return true;
    return tournament.status === filter;
  });

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">My Tournaments</h1>

        {/* Filter Buttons */}
        <div className="mb-4">
          <button
            onClick={() => setFilter('All')}
            className={`btn ${
              filter === 'All' ? 'btn-primary' : 'btn-secondary'
            } me-2`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('Scheduled')}
            className={`btn ${
              filter === 'Scheduled' ? 'btn-primary' : 'btn-secondary'
            } me-2`}
          >
            Scheduled
          </button>
          <button
            onClick={() => setFilter('OnGoing')}
            className={`btn ${
              filter === 'OnGoing' ? 'btn-primary' : 'btn-secondary'
            } me-2`}
          >
            OnGoing
          </button>
          <button
            onClick={() => setFilter('Completed')}
            className={`btn ${
              filter === 'Completed' ? 'btn-primary' : 'btn-secondary'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="row">
          <div className="col-md-12">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              (filteredTournaments ?? []).map((tournament) => (
                <TournamentCard
                  key={tournament.id}
                  id={tournament.id}
                  title={tournament.name}
                  dates={formatDates(tournament.startDate, tournament.endDate)}
                  location={tournament.location}
                  type={tournament.type}
                  registeredCount={tournament.maxPlayer}
                  description={tournament.description}
                  skillLevels={
                    tournament.isMinRanking + ' - ' + tournament.isMaxRanking
                  }
                  entryFee={tournament.entryFee}
                  status={tournament.status}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
