import React from 'react';
import { LoanParams } from '../types';

interface WarningMessagesProps {
  params: LoanParams;
}

export const WarningMessages: React.FC<WarningMessagesProps> = ({ params }) => {
  const criticalWarnings: string[] = [];
  const infoNotices: string[] = [];

  // Critical: Down payment greater than or equal to total amount
  if (params.totalAmount > 0 && params.downPayment >= params.totalAmount) {
    criticalWarnings.push("مبلغ المقدم أكبر من أو يساوي إجمالي قيمة السلعة (لا يوجد مبلغ متبقي للتقسيط).");
  }

  // Critical: Duration issues
  if (params.durationMonths === 0) {
    criticalWarnings.push("مدة التقسيط 0 شهر! يرجى تحديد مدة زمنية صحيحة.");
  } else if (params.durationMonths < 0) {
    criticalWarnings.push("مدة التقسيط لا يمكن أن تكون بالسالب.");
  }

  // Critical: Unusually high admin fees
  if (params.addAdminFees && params.adminFeesType === 'percentage' && params.adminFeesValue > 30) {
    criticalWarnings.push("نسبة المصاريف الإدارية تبدو مرتفعة جداً (>30%).");
  }

  // Info: Zero downpayment
  if (params.totalAmount > 0 && params.downPayment === 0) {
    infoNotices.push("عرض تقسيط بدون مقدم: سيتم تمويل كامل قيمة السلعة.");
  }

  // Info: Zero interest
  if (params.interestRate === 0 && params.totalAmount > 0) {
    infoNotices.push("عرض بدون فوائد (0%): تقسيط مباشر بسعر الكاش.");
  }

  if (criticalWarnings.length === 0 && infoNotices.length === 0) return null;

  return (
    <div className="space-y-3 mb-6 animate-fadeIn">
      {/* Critical Warnings */}
      {criticalWarnings.length > 0 && (
        <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 text-amber-700 rounded-xl flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h4 className="text-xs font-bold text-amber-900 mb-1">يرجى مراجعة المدخلات:</h4>
            <ul className="space-y-1">
              {criticalWarnings.map((warning, index) => (
                <li key={index} className="text-xs text-amber-800 font-medium">
                  • {warning}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Helpful Info Notices */}
      {infoNotices.length > 0 && (
        <div className="bg-emerald-50/80 border border-emerald-200/60 rounded-2xl p-3.5 shadow-sm flex items-center gap-3">
          <div className="p-1 bg-emerald-100 text-emerald-700 rounded-lg flex-shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1">
            {infoNotices.map((notice, index) => (
              <span key={index} className="text-xs text-emerald-800 font-medium inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {notice}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};