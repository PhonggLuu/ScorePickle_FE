import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css';
import { Button, Checkbox, Input, message } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  FilterOutlined,
  LoadingOutlined,
  SearchOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useGetAllTournamentsForPlayer } from '@src/modules/Tournament/hooks/useGetAllTournaments';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux/store';
import './tournament-page.css';

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
        <div className="col-5">
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
        <div className="col-1"></div>
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
  const [isSidebarHidden, setIsSidebarHidden] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleSidebar = () => {
    setIsSidebarHidden((prevState) => !prevState);
  };

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
      // Check if tournament type matches any of the selected types
      const isTypeMatch =
        filters.tournamentType.length === 0 ||
        filters.tournamentType.some((type) =>
          tournament.type.toLowerCase().includes(type.toLowerCase())
        );

      // Check if skill level is within the selected skill levels
      const isSkillLevelMatch =
        filters.skillLevel.length === 0 ||
        filters.skillLevel.some(
          (level) =>
            level >= tournament.isMinRanking && level <= tournament.isMaxRanking
        );

      // Check if the status matches any of the selected statuses
      const isStatusMatch =
        filters.status.length === 0 ||
        filters.status.includes(tournament.status);

      const isSearchMatch =
        searchTerm.trim() === '' ||
        tournament.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tournament.location.toLowerCase().includes(searchTerm.toLowerCase());

      // Return true if all conditions are met
      return isTypeMatch && isSkillLevelMatch && isStatusMatch && isSearchMatch;
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
    <div className="d-flex flex-column min-vh-100 text-white">
      <main className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Tournaments</h1>

        <div
          className="row"
          style={{ minHeight: '100vh', overflowX: 'hidden' }}
        >
          <div
            className={`${isSidebarHidden ? 'sidebar-hidden' : 'col-md-3'}`}
            style={{
              transition: 'transform 0.3s ease, width 0.3s ease',
              transform: isSidebarHidden
                ? 'translateX(-100%)'
                : 'translateX(0)',
            }}
          >
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
                  className="text-white"
                  onChange={() =>
                    handleCheckboxChange('tournamentType', 'singles')
                  }
                >
                  Single
                </Checkbox>
                <Checkbox
                  className="text-white"
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
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '1')}
                    >
                      Level 1
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '2')}
                    >
                      Level 2
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '3')}
                    >
                      Level 3
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '4')}
                    >
                      Level 4
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '5')}
                    >
                      Level 5
                    </Checkbox>
                  </div>
                  <div className="col-6">
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '6')}
                    >
                      Level 6
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '7')}
                    >
                      Level 7
                    </Checkbox>
                    <Checkbox
                      className="text-white"
                      onChange={() => handleCheckboxChange('skillLevel', '8')}
                    >
                      Level 8
                    </Checkbox>
                    <Checkbox
                      className="text-white"
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
                  className="text-white"
                  onChange={() => handleCheckboxChange('status', 'Scheduled')}
                >
                  Coming Soon
                </Checkbox>
                <Checkbox
                  className="text-white"
                  onChange={() => handleCheckboxChange('status', 'Ongoing')}
                >
                  Ongoing
                </Checkbox>
                <Checkbox
                  className="text-white"
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

          <div
            className={`main-content ${
              isSidebarHidden ? 'col-12' : 'col-md-9'
            }`}
            style={{
              transition: 'all 0.3s ease',
              willChange: 'width', // Tối ưu hiệu năng
            }}
          >
            <div className="container-fluid p-0">
              <div
                className="d-flex flex-column"
                style={{
                  color: 'white',
                }}
              >
                <h1 className="mb-3 fw-bold">Events</h1>

                <div className="position-relative mb-3">
                  <Input
                    prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="rounded-pill py-2 ps-3"
                    style={{
                      backgroundColor: 'white',
                      border: 'none',
                      boxShadow: 'none',
                      width: '50%',
                    }}
                  />
                  <Button
                    onClick={toggleSidebar}
                    className="btn rounded-pill position-absolute end-0 top-0 h-100 d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      color: 'white',
                      backgroundColor: 'white',
                    }}
                  >
                    <FilterOutlined style={{ color: '#0066cc' }} />
                  </Button>
                </div>

                <h2 className="fs-4 fw-bold mb-2">Explore</h2>
              </div>
            </div>
            {isLoading ? (
              <div className="d-flex justify-content-center align-items-center">
                <LoadingOutlined style={{ fontSize: '50px' }} />
              </div>
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
