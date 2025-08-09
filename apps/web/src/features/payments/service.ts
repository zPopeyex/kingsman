export interface CheckoutPayload {
  type: 'booking' | 'order'
  amountCOP: number
  reference: string
  customer: {
    name?: string
    email?: string
  }
}

export interface PaymentService {
  createCheckout(payload: CheckoutPayload): Promise<string>
  handleReturn(params: URLSearchParams): Promise<void>
}
