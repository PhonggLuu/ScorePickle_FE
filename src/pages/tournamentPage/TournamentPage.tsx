import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/reset.css'; // CSS của Antd
import { Button, Checkbox, Input, Slider } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  TagOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router-dom';

const TournamentCard = ({
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
              {skillLevels.map((skill, index) => (
                <span
                  key={index}
                  className="border border-black pr-1 pl-1 rounded-pill mr-1"
                >
                  <strong style={{ fontSize: '.75rem', fontWeight: '600' }}>
                    {skill}
                  </strong>
                </span>
              ))}
            </span>
            <span className="d-flex align-items-center mb-2">
              <strong>Entry Fee: {entryFee}</strong>
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
              to={`/tournament-detail/`}
              style={{ textDecoration: 'none' }}
              className="border border-dark bg-light text-dark py-2 px-3 rounded fw-bold"
            >
              View Details
            </Link>
          </div>
        </div>
        <div className="col-6">
          <div className="d-flex justify-content-end">
            <Link
              to={`/register-tournament/`}
              style={{ textDecoration: 'none' }}
              className="border bg-dark text-white py-2 px-3 rounded fw-bold"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TournamentPage = () => {
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
            <TournamentCard
              title="Summer Slam Open"
              dates="August 15-17, 2024"
              location="Phoenix, AZ"
              type="Open"
              registeredCount={64}
              description="Join us for the biggest summer tournament in the Southwest. Cash prizes for winners in all divisions."
              skillLevels={['3.5+', '4.0+', '5.0+']}
              entryFee="$75"
              status="Registration Open"
            />

            <TournamentCard
              title="Regional Championship"
              dates="September 5-7, 2024"
              location="Denver, CO"
              type="Invitational"
              registeredCount={32}
              description="Invitation-only tournament for top-ranked players in the region. Qualification required."
              skillLevels={['4.5+', '5.0+']}
              entryFee="$95"
              status="Registration Open"
            />

            <TournamentCard
              title="Fall Classic"
              dates="October 12-14, 2024"
              location="Austin, TX"
              type="Amateur"
              registeredCount={0}
              description="Perfect for players of all skill levels. Multiple divisions with round-robin format."
              skillLevels={['2.5-3.0', '3.5-4.0', '4.5+']}
              entryFee="$60"
              status="Coming Soon"
            />
          </div>
        </div>
      </main>
    </div>
  );
};
