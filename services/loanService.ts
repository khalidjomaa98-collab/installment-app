import { CalculationResult, LoanParams, ScheduleItem } from '../types';

export const calculateLoan = (params: LoanParams): CalculationResult => {
  const { 
    totalAmount, 
    downPayment, 
    interestRate, 
    interestType,
    durationMonths, 
    addAdminFees, 
    adminFeesType, 
    adminFeesValue 
  } = params;
  
  // 1. Calculate Base Principal (Net Item Value)
  const originalPrincipal = Math.max(0, totalAmount - downPayment);
  
  if (originalPrincipal <= 0 || durationMonths <= 0) {
    return {
      monthlyPayment: 0,
      totalInterest: 0,
      totalPayment: 0,
      originalPrincipal: 0,
      adminFeesAmount: 0,
      financedAmount: 0,
      schedule: []
    };
  }

  // 2. Calculate Admin Fees
  let adminFeesAmount = 0;
  if (addAdminFees) {
    if (adminFeesType === 'percentage') {
      // Calculate percentage from (Total - DownPayment)
      adminFeesAmount = originalPrincipal * (adminFeesValue / 100);
    } else {
      adminFeesAmount = adminFeesValue;
    }
  }

  // 3. Calculate Financed Amount (Principal + Admin Fees)
  const financedAmount = originalPrincipal + adminFeesAmount;

  // 4. Calculate Interest
  let totalInterest = 0;
  
  if (interestType === 'fixed') {
    // Fixed/Flat Interest: Calculated once on the principal regardless of duration
    // Example: 20% on 10,000 = 2,000 Total Interest
    totalInterest = financedAmount * (interestRate / 100);
  } else {
    // Monthly Interest: Rate * Duration
    // Example: 2% Monthly for 10 months = 20% Total
    const monthlyRate = interestRate / 100;
    totalInterest = financedAmount * monthlyRate * durationMonths;
  }

  // 5. Calculate Totals
  const totalPayment = financedAmount + totalInterest;
  const monthlyPayment = totalPayment / durationMonths;

  // 6. Generate Schedule (Flat Rate Schedule)
  const schedule: ScheduleItem[] = [];
  let currentBalance = totalPayment; 
  
  const monthlyPrincipal = financedAmount / durationMonths;
  const monthlyInterest = totalInterest / durationMonths;

  for (let i = 1; i <= durationMonths; i++) {
    currentBalance -= monthlyPayment;
    
    schedule.push({
      month: i,
      payment: monthlyPayment,
      principal: monthlyPrincipal,
      interest: monthlyInterest,
      balance: Math.max(0, currentBalance),
    });
  }

  return {
    monthlyPayment,
    totalInterest,
    totalPayment,
    originalPrincipal,
    adminFeesAmount,
    financedAmount,
    schedule
  };
};