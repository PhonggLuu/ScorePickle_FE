export interface Bill {
  userId: number;
  note: string;
  type: number;
  paymentMethod: any;
  id: number;
  tournamentId: number;
  amount: number;
  status: string;
  createdDate: string;
  paymentDate?: string;
  transactionId?: string;
}

export interface PaymentResponse {
  responseCodeMessage: string;
  transactionStatusMessage: string;
  vnPayResponse: VnPayResponse;
}

export interface VnPayResponse {
  bankTranNo: string;
  payDate: string;
  orderInfo: string;
  responseCode: string;
  transactionId: string;
  transactionStatus: string;
  cardType: number;
  txnRef: string;
  amount: number;
  bankCode: string;
  note: string;
}
