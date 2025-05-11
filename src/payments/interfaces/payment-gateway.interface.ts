export interface IPaymentGateway {
  createCheckoutSession(data: {
    orderId: number;
    amount: number;
    customerEmail: string;
  }): Promise<{ url: string; sessionId: string }>;
}
