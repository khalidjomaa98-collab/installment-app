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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col animate-fadeIn">
      {/* Header Info */}
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
         <div>
             <h4 className="font-bold text-slate-800">تفاصيل الأقساط</h4>
             <p className="text-xs text-slate-500">
                {initialSchedule.length} شهر • {isEdited ? <span className="text-amber-600 font-bold">تم التعديل يدوياً</span> : 'حساب تلقائي'}
             </p>
         </div>
         {isEdited && (
            <button 
                onClick={resetSchedule}
                className="text-xs bg-white border border-amber-200 text-amber-700 px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors font-bold shadow-sm"
            >
                إعادة تعيين
            </button>
         )}
      </div>

      <div className="overflow-auto custom-scrollbar flex-1">
        <table className="min-w-full divide-y divide-slate-100 relative">
          <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
            <tr>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">الشهر</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">
                قيمة القسط <span className="text-[10px] font-normal text-slate-400 block">(قابل للتعديل)</span>
              </th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">الأصل</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">الفائدة</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">المتبقي</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-50">
            {localSchedule.map((item, idx) => (
              <tr key={item.month} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-2 whitespace-nowrap text-sm font-bold text-slate-700">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                            {item.month}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm">
                    <div className="relative max-w-[100px]">
                        <input 
                            type="number" 
                            value={Math.round(item.payment * 100) / 100} 
                            onChange={(e) => handlePaymentChange(idx, e.target.value)}
                            className="w-full bg-transparent border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-none focus:bg-emerald-50/50 py-1 font-bold text-slate-800 transition-all text-left dir-ltr"
                        />
                    </div>
                </td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-slate-500 hidden sm:table-cell">{item.principal.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-red-400 hidden sm:table-cell">{item.interest.toFixed(2)}</td>
                <td className="px-4 py-2 whitespace-nowrap text-sm text-emerald-600 font-bold">{item.balance.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};