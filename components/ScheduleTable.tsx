import React, { useState, useEffect } from 'react';
import { ScheduleItem } from '../types';

interface ScheduleTableProps {
  schedule: ScheduleItem[];
}

export const ScheduleTable: React.FC<ScheduleTableProps> = ({ schedule: initialSchedule }) => {
  const [localSchedule, setLocalSchedule] = useState<ScheduleItem[]>([]);
  const [isEdited, setIsEdited] = useState(false);

  // Sync local state when the prop changes (new calculation from parent)
  useEffect(() => {
    setLocalSchedule(initialSchedule);
    setIsEdited(false);
  }, [initialSchedule]);

  const handlePaymentChange = (index: number, newValStr: string) => {
    const newValue = parseFloat(newValStr);
    if (isNaN(newValue) || newValue < 0) return;

    const newSchedule = [...localSchedule];
    const currentItem = newSchedule[index];
    const oldValue = currentItem.payment;
    const diff = newValue - oldValue;

    // 1. Update the edited row
    newSchedule[index] = { ...currentItem, payment: newValue };

    // 2. Distribute the difference across remaining rows (if any)
    const remainingRowsCount = newSchedule.length - 1 - index;
    
    if (remainingRowsCount > 0) {
      const adjustmentPerRow = diff / remainingRowsCount;

      for (let i = index + 1; i < newSchedule.length; i++) {
        const adjustedPayment = Math.max(0, newSchedule[i].payment - adjustmentPerRow);
        newSchedule[i] = { ...newSchedule[i], payment: adjustedPayment };
      }
    }

    // 3. Recalculate Balances
    const totalExpected = initialSchedule.reduce((sum, i) => sum + i.payment, 0);
    let runningBalance = totalExpected;
    
    const recalculatedSchedule = newSchedule.map(item => {
      runningBalance -= item.payment;
      return { ...item, balance: Math.max(0, runningBalance) };
    });

    setLocalSchedule(recalculatedSchedule);
    setIsEdited(true);
  };

  const resetSchedule = () => {
    setLocalSchedule(initialSchedule);
    setIsEdited(false);
  };

  if (initialSchedule.length === 0) return null;

  const totalExpected = initialSchedule.reduce((sum, i) => sum + i.payment, 0);
  const totalPrincipal = localSchedule.reduce((sum, i) => sum + i.principal, 0);
  const totalInterest = localSchedule.reduce((sum, i) => sum + i.interest, 0);
  const totalPayments = localSchedule.reduce((sum, i) => sum + i.payment, 0);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col animate-fadeIn">
      {/* Header Info */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-800 text-base">جدول استهلاك الأقساط</h4>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
              {initialSchedule.length} شهر
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
            {isEdited ? (
              <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                تم تعديل بعض الأقساط يدوياً
              </span>
            ) : (
              <span className="text-slate-400">
                يمكنك الضغط على خانة أي قسط لتعديل قيمته وتوزيع الفارق تلقائياً
              </span>
            )}
          </p>
        </div>

        {isEdited && (
          <button 
            onClick={resetSchedule}
            className="text-xs bg-white border border-amber-300 text-amber-800 hover:bg-amber-50 px-3.5 py-1.5 rounded-lg transition-all font-bold shadow-sm inline-flex items-center gap-1.5"
            title="إعادة حساب الأقساط المتساوية الأصلية"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            إعادة تعيين للأصل
          </button>
        )}
      </div>

      {/* Table Container */}
      <div className="overflow-auto custom-scrollbar flex-1 max-h-[520px]">
        <table className="min-w-full divide-y divide-slate-100 text-right">
          <thead className="bg-slate-50/95 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-200/80">
            <tr>
              <th scope="col" className="px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                الشهر
              </th>
              <th scope="col" className="px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                قيمة القسط
                <span className="text-[10px] font-normal text-slate-400 mr-1">(قابل للتعديل)</span>
              </th>
              <th scope="col" className="px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                أصل القسط
              </th>
              <th scope="col" className="px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:table-cell">
                فائدة القسط
              </th>
              <th scope="col" className="px-4 py-3.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                المتبقي
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {localSchedule.map((item, idx) => {
              const remainingRatio = totalExpected > 0 ? (item.balance / totalExpected) * 100 : 0;

              return (
                <tr key={item.month} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Month */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-bold text-slate-700">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold group-hover:bg-emerald-100 group-hover:text-emerald-800 transition-colors">
                      شهر {item.month}
                    </span>
                  </td>

                  {/* Editable Payment */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="relative inline-flex items-center group/input">
                      <input 
                        type="number" 
                        value={Math.round(item.payment * 100) / 100} 
                        onChange={(e) => handlePaymentChange(idx, e.target.value)}
                        className="w-28 bg-slate-50/60 group-hover/input:bg-white border border-slate-200 group-hover/input:border-emerald-400 focus:border-emerald-500 focus:bg-white rounded-lg px-2.5 py-1 font-bold text-slate-800 text-sm outline-none transition-all dir-ltr"
                      />
                      <span className="mr-1.5 text-xs text-slate-400 font-normal">ج.م</span>
                    </div>
                  </td>

                  {/* Principal */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-slate-600 font-medium hidden sm:table-cell">
                    {item.principal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Interest */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-rose-500 font-medium hidden sm:table-cell">
                    {item.interest.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* Remaining Balance + Progress Bar */}
                  <td className="px-4 py-3 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-1 min-w-[110px]">
                      <span className={`font-bold font-['Cairo'] ${item.balance === 0 ? 'text-emerald-600' : 'text-slate-700'}`}>
                        {item.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[10px] font-normal text-slate-400">ج.م</span>
                      </span>
                      {/* Mini Visual Progress */}
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.balance === 0 ? 'bg-emerald-500' : 'bg-slate-400 group-hover:bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, remainingRatio))}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          
          {/* Table Footer Summary Row */}
          <tfoot className="bg-slate-50 border-t-2 border-slate-200 font-bold text-xs text-slate-700">
            <tr>
              <td className="px-4 py-3">المجموع الكلي</td>
              <td className="px-4 py-3 text-emerald-700 text-sm font-black">
                {Math.round(totalPayments).toLocaleString()} ج.م
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-slate-600">
                {Math.round(totalPrincipal).toLocaleString()} ج.م
              </td>
              <td className="px-4 py-3 hidden sm:table-cell text-rose-600">
                {Math.round(totalInterest).toLocaleString()} ج.م
              </td>
              <td className="px-4 py-3 text-emerald-600">
                مسدد بالكامل (0.00)
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};