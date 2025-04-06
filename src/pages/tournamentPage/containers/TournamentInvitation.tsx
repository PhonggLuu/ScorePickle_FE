import { useGetTournamentTeamRequestByPlayerId } from '@src/modules/TournamentRegistration/hooks/useGetTournamentTeamRequest';
import { useRespondTeamRequest } from '@src/modules/TournamentRegistration/hooks/useRespondTeamRequest';
import { InvitationStatus } from '@src/modules/TournamentRegistration/models';
import { Button, message } from 'antd';

const TournamentInvitation = ({ playerId }) => {
  const { data, error, isLoading, refetch } =
    useGetTournamentTeamRequestByPlayerId(playerId);
  const { mutate } = useRespondTeamRequest();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No invitations available.</p>;
  }

  const handleAcceptInvitation = async (invitationId) => {
    try {
      await mutate({ id: invitationId, isAccept: 'true' });
      message.success('Accepted invitation successfully!');
      refetch();
    } catch (err) {
      message.error('Failed to accept invitation!');
    }
  };

  const handleRejectInvitation = async (invitationId) => {
    try {
      await mutate({ id: invitationId, isAccept: 'false' });
      message.success('Rejected invitation successfully!');
      refetch();
    } catch (err) {
      message.error('Failed to reject invitation!');
    }
  };

  return (
    <ul>
      {data.map((invitation, index) => (
        <li key={index} className="row mb-2">
          <strong className="col-6">
            Lời mời tham gia giải đấu bởi {invitation.requesterId}
          </strong>
          {invitation.status === InvitationStatus.Pending && (
            <div className="col-6 d-flex justify-content-end">
              <Button
                style={{ borderColor: 'green', color: 'green' }}
                onClick={() => {
                  handleAcceptInvitation(invitation.id);
                }}
              >
                <span>Accept</span>
              </Button>
              <Button
                style={{ borderColor: 'red', color: 'red' }}
                onClick={() => {
                  handleRejectInvitation(invitation.id);
                }}
                className="ms-2"
              >
                Reject
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default TournamentInvitation;
