import { Spin, Alert, Card } from 'antd';
import { useGetAllMatchByTournamentId } from '@src/modules/Match/hooks/useGetMatchByTournamentId';
import TournamentMatchCard from './TournamentMatchCard';

interface TournamentInfoProps {
  id: number;
}

export const TournamentMatches: React.FC<TournamentInfoProps> = ({ id }) => {
  const { data: matches, isLoading, error } = useGetAllMatchByTournamentId(id);

  if (isLoading) {
    return <Spin tip="Loading matches..." />;
  }

  if (error) {
    return <Alert message="Error fetching matches" type="error" />;
  }

  return (
    <>
      <div className="container">
        <div className="d-flex flex-column align-items-center">
          {matches?.map((match) => (
            <div
              key={match.id}
              className="w-sm-100 w-50 w-md-50 w-lg-50 mb-4 mx-auto"
            >
              <TournamentMatchCard value={match} />
            </div>
          ))}
        </div>
      </div>

      {!matches && (
        <div className="row">
          <div className="col-md-12">
            <Card className="mb-4">No matches found</Card>
          </div>
        </div>
      )}
    </>
  );
};

export default TournamentMatches;
