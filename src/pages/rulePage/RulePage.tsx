import { useState } from 'react';
import { Tabs, Card, Table, Alert } from 'antd';
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

export const RulePage = () => {
  const [activeTab, setActiveTab] = useState('scoring');

  return (
    <div className="container mt-4">
      <h1 className="display-4 mb-4">Platform Rules</h1>

      <Tabs defaultActiveKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="Scoring System" key="scoring">
          <ScoringSystem />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Challenge Rules" key="challenge">
          <ChallengeRules />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Revised Matches" key="revised">
          <Card>
            <h2 className="h5">Revised Matches</h2>
            <p>Revised matches content would go here.</p>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Tournament Rules" key="tournament">
          <Card>
            <h2 className="h5">Tournament Rules</h2>
            <p>Tournament rules content would go here.</p>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Code of Conduct" key="conduct">
          <Card>
            <h2 className="h5">Code of Conduct</h2>
            <p>Code of conduct content would go here.</p>
          </Card>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Financial Rules" key="financial">
          <Card>
            <h2 className="h5">Financial Rules</h2>
            <p>Financial rules content would go here.</p>
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

function ScoringSystem() {
  const matchData = [
    {
      key: '1',
      matchType: 'Singles',
      scoringFormat: 'Rally scoring to 11 points',
      winCondition: 'Win by 2 points, best of 3 games',
    },
    {
      key: '2',
      matchType: 'Doubles',
      scoringFormat: 'Rally scoring to 11 points',
      winCondition: 'Win by 2 points, best of 3 games',
    },
    {
      key: '3',
      matchType: 'Mixed Doubles',
      scoringFormat: 'Rally scoring to 11 points',
      winCondition: 'Win by 2 points, best of 3 games',
    },
    {
      key: '4',
      matchType: 'Tournament Finals',
      scoringFormat: 'Rally scoring to 15 points',
      winCondition: 'Win by 2 points, best of 3 games',
    },
    {
      key: '5',
      matchType: 'Quick Match',
      scoringFormat: 'Rally scoring to 7 points',
      winCondition: 'Win by 2 points, single game',
    },
  ];

  const ratingData = [
    {
      key: '1',
      skillLevel: 'Beginner',
      ratingRange: '2.0 - 2.5',
      description: 'New to the sport, developing basic skills',
    },
    {
      key: '2',
      skillLevel: 'Intermediate',
      ratingRange: '3.0 - 3.5',
      description: 'Consistent play with developing strategy',
    },
    {
      key: '3',
      skillLevel: 'Advanced',
      ratingRange: '4.0 - 4.5',
      description: 'Strong skills, strategy, and shot selection',
    },
    {
      key: '4',
      skillLevel: 'Expert',
      ratingRange: '5.0 - 5.5',
      description: 'Advanced strategy, consistent execution',
    },
    {
      key: '5',
      skillLevel: 'Professional',
      ratingRange: '5.0+',
      description: 'Tournament-level play, exceptional skills',
    },
  ];

  const matchColumns = [
    { title: 'Match Type', dataIndex: 'matchType' },
    { title: 'Scoring Format', dataIndex: 'scoringFormat' },
    { title: 'Win Condition', dataIndex: 'winCondition' },
  ];

  const ratingColumns = [
    { title: 'Skill Level', dataIndex: 'skillLevel' },
    { title: 'Rating Range', dataIndex: 'ratingRange' },
    { title: 'Description', dataIndex: 'description' },
  ];

  return (
    <Card>
      <h2 className="h5">Scoring System</h2>
      <p className="text-muted mb-4">
        How matches are scored and how ratings are calculated
      </p>

      <section className="mb-4">
        <h3 className="h6">Match Scoring</h3>
        <p>
          Score/Pulse follows standard pickleball scoring rules with some
          platform-specific adaptations:
        </p>
        <Table
          columns={matchColumns}
          dataSource={matchData}
          pagination={false}
        />
      </section>

      <section className="mb-4">
        <h3 className="h6">Rating Calculation</h3>
        <p>
          Player ratings are calculated using a modified ELO rating system
          specifically adapted for pickleball:
        </p>
        <p>
          <strong>Rating Formula:</strong> New Rating = Current Rating + K ×
          (Actual Result - Expected Result)
        </p>
        <ul>
          <li>
            <strong>K factor:</strong> Varies based on match type and player
            experience
          </li>
          <ul>
            <li>Tournament matches: K = 32</li>
            <li>Revised matches: K = 24</li>
            <li>Challenge matches: K = 16</li>
            <li>Practice matches: K = 8</li>
          </ul>
          <li>
            <strong>Expected Result:</strong> Calculated based on rating
            difference between players
          </li>
          <li>
            <strong>Actual Result:</strong> 1 for win, 0 for loss, with score
            differential modifier
          </li>
        </ul>
      </section>

      <section className="mb-4">
        <h3 className="h6">Rating Levels</h3>
        <p>
          Players are categorized into skill levels based on their numerical
          rating:
        </p>
        <Table
          columns={ratingColumns}
          dataSource={ratingData}
          pagination={false}
        />
      </section>

      <section>
        <Alert
          message={
            <>
              <InfoCircleOutlined /> Rating Protection
            </>
          }
          description="Players have a 10-match grace period after reaching a new level before they can be demoted to a lower level."
          type="info"
        />
      </section>
    </Card>
  );
}
function ChallengeRules() {
  const cancellationData = [
    {
      timing: 'More than 48 hours before match',
      penalty: 'No penalty',
      ratingImpact: 'No impact',
    },
    {
      timing: '24-48 hours before match',
      penalty: 'Warning',
      ratingImpact: 'No impact',
    },
    {
      timing: 'Less than 24 hours before match',
      penalty: 'Challenge restriction (3 days)',
      ratingImpact: 'No impact',
    },
    {
      timing: 'No-show without notice',
      penalty: 'Challenge restriction (7 days)',
      ratingImpact: '-0.1 rating points',
    },
    {
      timing: 'Repeated cancellations (3+ in 30 days)',
      penalty: 'Challenge restriction (14 days)',
      ratingImpact: '-0.2 rating points',
    },
  ];

  const columns = [
    {
      title: 'Cancellation Timing',
      dataIndex: 'timing',
      key: 'timing',
    },
    {
      title: 'Penalty',
      dataIndex: 'penalty',
      key: 'penalty',
    },
    {
      title: 'Rating Impact',
      dataIndex: 'ratingImpact',
      key: 'ratingImpact',
    },
  ];

  return (
    <Card>
      <div className="container my-5 p-4 border rounded">
        <h1 className="display-5 font-weight-bold mb-2">Challenge Rules</h1>
        <p className="text-muted mb-4">
          Rules for challenging other players to matches
        </p>

        <section className="mb-5">
          <h2 className="h4 font-weight-semibold mb-3">
            Challenge Eligibility
          </h2>
          <p>
            The challenge system allows players to initiate matches with other
            players on the platform:
          </p>

          <ul className="list-unstyled">
            <li>
              <strong>Rating Restrictions:</strong> Players can challenge others
              within ±1.0 rating points of their own rating
            </li>
            <li>
              <strong>Challenge Frequency:</strong> Players can issue up to 5
              active challenges at once
            </li>
            <li>
              <strong>Repeat Challenges:</strong> Players cannot challenge the
              same opponent more than once every 7 days
            </li>
            <li>
              <strong>Challenge Response Time:</strong> Challenged players have
              72 hours to accept or decline a challenge
            </li>
            <li>
              <strong>Challenge Scheduling:</strong> Once accepted, the match
              must be scheduled within 14 days
            </li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="h4 font-weight-semibold mb-3">
            Challenge Match Requirements
          </h2>
          <p>Challenge matches must meet the following requirements:</p>

          <ul className="list-unstyled">
            <li>
              <strong>Venue:</strong> Matches must be played at a verified venue
              registered on the platform
            </li>
            <li>
              <strong>Verification:</strong> Match results must be verified by
              both players
            </li>
            <li>
              <strong>Format:</strong> Standard scoring format (best of 3 games
              to 11 points)
            </li>
            <li>
              <strong>Witnesses:</strong> Recommended but not required for
              standard challenge matches
            </li>
            <li>
              <strong>Result Submission:</strong> Results must be submitted
              within 24 hours of match completion
            </li>
          </ul>
        </section>

        <section className="mb-5">
          <h2 className="h4 font-weight-semibold mb-3">
            Challenge Cancellation
          </h2>
          <p>Rules regarding cancellation of challenge matches:</p>

          <Table
            columns={columns}
            dataSource={cancellationData}
            rowKey="timing"
            pagination={false}
          />
        </section>

        <Alert
          message="Dispute Resolution"
          description={
            <>
              <p>
                In case of disputes about match results or conduct, both players
                can request a review by the platform's dispute resolution team.
                Decisions made by the dispute resolution team are final.
              </p>
            </>
          }
          type="error"
          showIcon
          icon={<ExclamationCircleOutlined />}
          className="mt-4"
        />
      </div>
    </Card>
  );
}
export default RulePage;
