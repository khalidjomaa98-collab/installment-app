import React from 'react';
import { LoanParams } from '../types';

interface WarningMessagesProps {
  params: LoanParams;
}

export const WarningMessages: React.FC<WarningMessagesProps> = ({ params }) => {
  const warnings: string[] = [];

  // 1. Check if Down Payment is greater than or equal to Total Amount
  if (params.totalAmount > 0 && params.downPayment >= params.totalAmount) {
    warnings.push("مبلغ المقدم أكبر من أو يساوي إجمالي قيمة السلعة (لا يوجد مبلغ متبقي للتقسيط).");
  }

  // 2. Check if Down Payment is 0 (Just a hint, not a critical warning, but useful)
  if (params.totalAmount > 0 && params.downPayment === 0) {
    warnings.push("لم يتم تحديد مقدم (سيتم تقسيط كامل المبلغ).");
  }

  // 3. Check Duration
  if (params.durationMonths === 0) {
    warnings.push("مدة التقسيط 0 شهر! يرجى تحديد مدة زمنية صحيحة.");
  } else if (params.durationMonths < 0) {
    warnings.push("مدة التقسيط لا يمكن أن تكون بالسالب.");
  }

  // 4. Check Interest Rate
  if (params.interestRate === 0) {
    warnings.push("نسبة الفائدة الصفرية (0%) تعني تقسيط بسعر الكاش.");
  }

  // 5. Check logical Admin Fees
  if (params.addAdminFees && params.adminFeesType === 'percentage' && params.adminFeesValue > 30) {
    warnings.push("نسبة المصاريف الإدارية تبدو مرتفعة جداً (>30%).");
  }

  if (warnings.length === 0) return null;

  return (
    <div className="bg-amber-50 border-r-4 border-amber-500 p-4 mb-6 rounded-l-lg shadow-sm animate-fadeIn">
      <div className="flex items-start">
        <div className="flex-shrink-0 ml-3">
          <svg className="h-6 w-6 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-bold text-amber-800">ملاحظات هامة على المدخلات:</h3>
          <ul className="mt-2 list-disc list-inside text-sm text-amber-700 space-y-1">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};