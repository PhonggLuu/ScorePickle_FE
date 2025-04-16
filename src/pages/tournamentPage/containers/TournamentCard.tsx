import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const TournamentCard = ({
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
              className="border border-dark bg-light text-dark py-2 px-3 rounded fw-bold ms-3"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default TournamentCard;
