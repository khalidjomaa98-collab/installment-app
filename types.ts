export interface LoanParams {
  totalAmount: number;
  downPayment: number;
  interestRate: number; // Percentage value
  interestType: 'monthly' | 'fixed'; // New field: monthly (rate * months) or fixed (flat rate on principal)
  durationMonths: number;
  addAdminFees: boolean;
  adminFeesType: 'fixed' | 'percentage';
  adminFeesValue: number;
}

export interface ScheduleItem {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface CalculationResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPayment: number;
  originalPrincipal: number; // Price - Down Payment
  adminFeesAmount: number;
  financedAmount: number; // Original Principal + Admin Fees
  schedule: ScheduleItem[];
}

export enum AdviceType {
  ANALYSIS = 'analysis',
  CONTRACT = 'contract'
}