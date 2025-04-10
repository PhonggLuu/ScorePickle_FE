import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import { Button, Checkbox, message } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useGetAllTournamentsForPlayer } from '@src/modules/Tournament/hooks/useGetAllTournaments';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';

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

export const TournamentPage = () => {
  const { data, isLoading } = useGetAllTournamentsForPlayer();
  const [filters, setFilters] = useState<{
    tournamentType: string[];
    skillLevel: string[];
    status: string[];
  }>({
    tournamentType: [],
    skillLevel: [],
    status: [],
  });

  const user = useSelector((state: RootState) => state.auth.user);

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

  // Hàm lọc dữ liệu
  const filterTournaments = (data) => {
    return data.filter((tournament) => {
      const isTypeMatch =
        filters.tournamentType.length === 0 ||
        tournament.type.toLowerCase().includes(filters.tournamentType);
      const isSkillLevelMatch =
        filters.skillLevel.length === 0 ||
        (filters.skillLevel >= tournament.isMinRanking &&
          filters.skillLevel <= tournament.isMaxRanking);
      const isStatusMatch =
        filters.status.length === 0 ||
        filters.status.includes(tournament.status);

      return isTypeMatch && isSkillLevelMatch && isStatusMatch;
    });
  };

  const handleCheckboxChange = (category, value) => {
    setFilters((prevFilters) => {
      const updatedCategory = prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value];

      return { ...prevFilters, [category]: updatedCategory };
    });
  };

  const recommendTournaments = () => {
    // Áp dụng bộ lọc đặc biệt cho "Recommend Tournament" dựa trên level và gender của người dùng
    setFilters({
      tournamentType: [],
      skillLevel: [user?.userDetails?.experienceLevel?.toString() ?? '0'],
      status: ['Scheduled'],
    });
    message.success('Filter follow your level and gender succesfully');
  };

  const handleResetFilters = () => {
    window.location.reload();
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Tournaments</h1>

        <div className="row">
          <div className="col-md-3 mb-4">
            <div className="mb-4">
              <h2 className="h5 fw-medium mb-3">Recommend Tournament</h2>
              <Button
                className="w-100 mb-4 btn-primary"
                onClick={recommendTournaments}
              >
                Recommend Tournament
              </Button>
            </div>

            <div className="mb-4">
              <h2 className="h5 fw-medium mb-3">Filters</h2>
              <Button className="w-100 mb-4" block onClick={handleResetFilters}>
                Reset Filters
              </Button>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Tournament Type</h3>
              <div className="d-flex flex-column gap-2">
                <Checkbox
                  onChange={() =>
                    handleCheckboxChange('tournamentType', 'singles')
                  }
                >
                  Singles
                </Checkbox>
                <Checkbox
                  onChange={() =>
                    handleCheckboxChange('tournamentType', 'doubles')
                  }
                >
                  Doubles
                </Checkbox>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Skill Level</h3>
              <div className="d-flex flex-column gap-2">
                <div className="row">
                  <div className="col-6">
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '1')}
                    >
                      Level 1
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '2')}
                    >
                      Level 2
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '3')}
                    >
                      Level 3
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '4')}
                    >
                      Level 4
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '5')}
                    >
                      Level 5
                    </Checkbox>
                  </div>
                  <div className="col-6">
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '6')}
                    >
                      Level 6
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '7')}
                    >
                      Level 7
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '8')}
                    >
                      Level 8
                    </Checkbox>
                    <Checkbox
                      onChange={() => handleCheckboxChange('skillLevel', '9')}
                    >
                      Level 9
                    </Checkbox>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Status</h3>
              <div className="d-flex flex-column gap-2">
                <Checkbox
                  onChange={() => handleCheckboxChange('status', 'Scheduled')}
                >
                  Coming Soon
                </Checkbox>
                <Checkbox
                  onChange={() => handleCheckboxChange('status', 'Ongoing')}
                >
                  Ongoing
                </Checkbox>
                <Checkbox
                  onChange={() => handleCheckboxChange('status', 'Completed')}
                >
                  Past Tournaments
                </Checkbox>
              </div>
            </div>

            <Button className="bg-dark text-white" block>
              Apply Filters
            </Button>
          </div>

          <div className="col-md-9">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              filterTournaments(data).map((tournament) => (
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
