// Tipos para el sistema de reservas
export interface Barber {
  id: string;
  displayName: string;
  phone: string;
  role: 'admin' | 'dev' | 'client';
  active: boolean;
  avatar?: string;
  specialty?: string;
}

export interface WorkingSchedule {
  id: string;
  barberId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  slotMinutes: number;
  createdAt?: any;
  updatedAt?: any;
}

export type PaymentStatus = 'APPROVED' | 'PENDING' | 'DECLINED' | 'VOIDED' | 'ERROR';
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'rescheduled' | 'failed';

export interface Payment {
  provider: 'wompi';
  amount: number;
  currency: 'COP';
  ref: string;
  status: PaymentStatus;
  transactionId?: string;
}

export interface Appointment {
  id: string;
  barberId: string;
  userId: string;
  userPhone: string;
  userName: string;
  date: string; // YYYY-MM-DD
  start: string; // HH:mm
  end: string; // HH:mm
  serviceId?: string;
  serviceName?: string;
  price: number;
  status: AppointmentStatus;
  createdAt: any;
  updatedAt: any;
  payment: Payment;
  cancellationReason?: string;
}

export interface Service {
  id: string;
  name: string;
  durationMinutes: number;
  price: number;
  description?: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  appointmentId?: string;
}

export interface WompiCheckoutParams {
  amount: number;
  currency: string;
  reference: string;
  customerEmail?: string;
  customerPhone?: string;
  customerName?: string;
  onSuccess?: (transaction: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}