import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css'; // CSS của Antd
import { Button, Checkbox, Input, Pagination, Slider } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useGetAllTournamentsByCreateAt } from '@src/modules/Tournament/hooks/useGetAllTournaments';

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
        {/* Phần 3: Dates, Location, Type, Registered */}
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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const { data, isLoading } = useGetAllTournamentsByCreateAt(
    currentPage,
    pageSize
  );

  const handlePaginationChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };
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
  return (
    <div className="d-flex flex-column min-vh-100">
      <main className="flex-grow-1 container py-4">
        <h1 className="display-4 fw-bold mb-4">Tournaments</h1>

        <div className="row">
          {/* Filters - 3/12 columns */}
          <div className="col-md-3 mb-4">
            <div className="mb-4">
              <h2 className="h5 fw-medium mb-3">Filters</h2>
              <Button className="w-100 mb-4" block>
                Reset Filters
              </Button>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Tournament Type</h3>
              <div className="d-flex flex-column gap-2">
                <Checkbox id="singles">Singles</Checkbox>
                <Checkbox id="doubles">Doubles</Checkbox>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Location</h3>
              <Input placeholder="City, State, or Zip" />
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Distance (km)</h3>
              <Input type="number" defaultValue={5} className="mb-2" />
              <div className="d-flex justify-content-between text-muted small">
                <span>0 km</span>
                <span>10 km</span>
                <span>20 km</span>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Date Range</h3>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="small">Next 6 weeks</span>
                <Button size="small" icon={<CalendarOutlined />} />
              </div>
              <Slider range defaultValue={[6]} max={12} step={1} />
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Skill Level</h3>
              <div className="d-flex flex-column gap-2">
                <div className="row">
                  <div className="col-6">
                    <Checkbox id="skill-10-20">1.0 - 2.0</Checkbox>
                    <Checkbox id="skill-20-25">2.0 - 2.5</Checkbox>
                    <Checkbox id="skill-25-30">2.5 - 3.0</Checkbox>
                    <Checkbox id="skill-30-35">3.0 - 3.5</Checkbox>
                    <Checkbox id="skill-35-40">3.5 - 4.0</Checkbox>
                  </div>
                  <div className="col-6">
                    <Checkbox id="skill-40-45">4.0 - 4.5</Checkbox>
                    <Checkbox id="skill-45-50">4.5 - 5.0</Checkbox>
                    <Checkbox id="skill-50-55">5.0 - 5.5</Checkbox>
                    <br />
                    <Checkbox id="skill-55-plus">5.5+</Checkbox>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="h6 fw-medium">Status</h3>
              <div className="d-flex flex-column gap-2">
                <Checkbox id="registration-open" defaultChecked>
                  Registration Open
                </Checkbox>
                <Checkbox id="coming-soon">Coming Soon</Checkbox>
                <Checkbox id="past-tournaments">Past Tournaments</Checkbox>
              </div>
            </div>

            <Button className="bg-dark text-white" block>
              Apply Filters
            </Button>
          </div>

          {/* Tournament Listings - 9/12 columns */}
          <div className="col-md-9">
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              data?.data?.map((tournament) => (
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

            <div className="pagination-container">
              <Pagination
                current={currentPage}
                total={data?.totalItems}
                pageSize={pageSize}
                onChange={handlePaginationChange}
                pageSizeOptions={['10', '20', '50']}
                showSizeChanger
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
