export interface NotificationResponse {
  id: number;
  message: string;
  createdAt: Date;
  isRead: boolean;
  type: number;
  referenceId: number;
  bonusId: string | null;
  redirectUrl: string;
  extraInfo: string;
}
