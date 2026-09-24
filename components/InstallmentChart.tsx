import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { CalculationResult } from '../types';

interface InstallmentChartProps {
  result: CalculationResult;
}

export const InstallmentChart: React.FC<InstallmentChartProps> = ({ result }) => {
  const pieData = [
    { name: 'أصل السلعة', value: result.originalPrincipal, color: '#10b981' },
    { name: 'مصاريف إدارية', value: result.adminFeesAmount, color: '#f59e0b' },
    { name: 'إجمالي الفوائد', value: result.totalInterest, color: '#f43f5e' },
  ].filter(item => item.value > 0);

  const principalPct = result.totalPayment > 0 
    ? Math.round((result.originalPrincipal / result.totalPayment) * 100) 
    : 0;
  const interestPct = result.totalPayment > 0 
    ? Math.round((result.totalInterest / result.totalPayment) * 100) 
    : 0;
  const adminPct = result.totalPayment > 0 && result.adminFeesAmount > 0
    ? Math.max(0, 100 - principalPct - interestPct) 
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full p-6 animate-fadeIn">
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-base font-bold text-slate-800">الرسم البياني لتوزيع المستحقات</h4>
            <p className="text-xs text-slate-400 mt-0.5">نسبة وتناسب المبالغ المسددة طوال فترة التقسيط</p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
            توزيع دقيق
          </span>
        </div>
        
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 flex-1">
          {/* Donut Chart with Centered Metric */}
          <div className="w-full lg:w-1/2 h-64 min-h-[260px] relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={72}
                  outerRadius={102}
                  paddingAngle={3}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={4}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${Math.round(value).toLocaleString()} ج.م`, 'المبلغ']}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid #e2e8f0', 
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    fontFamily: 'Cairo',
                    direction: 'rtl'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Centerpiece Stat */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                إجمالي السداد
              </span>
              <span className="text-xl sm:text-2xl font-black text-slate-800 block font-['Cairo']">
                {Math.round(result.totalPayment).toLocaleString()}
              </span>
              <span className="text-[11px] font-bold text-emerald-600">
                ج.م
              </span>
            </div>
          </div>

          {/* Breakdown Cards & Stats */}
          <div className="w-full lg:w-1/2 space-y-3">
            {/* Principal */}
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-emerald-50/40 hover:border-emerald-200 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/30 flex-shrink-0"></span>
                <div>
                  <span className="text-slate-700 text-xs font-bold block">أصل قيمة السلعة</span>
                  <span className="text-[11px] text-slate-400">صافي المبلغ المقسط</span>
                </div>
              </div>
              <div className="text-left flex items-center gap-2">
                <span className="text-xs font-black text-emerald-700 bg-white border border-emerald-100 px-2 py-0.5 rounded-md">
                  {principalPct}%
                </span>
                <span className="font-bold text-slate-800 text-sm font-['Cairo']">
                  {Math.round(result.originalPrincipal).toLocaleString()} ج.م
                </span>
              </div>
            </div>
            
            {/* Admin Fees */}
            {result.adminFeesAmount > 0 && (
              <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-amber-50/40 hover:border-amber-200 transition-colors">
                <div className="flex items-center gap-2.5">
                  <span className="w-3.5 h-3.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/30 flex-shrink-0"></span>
                  <div>
                    <span className="text-slate-700 text-xs font-bold block">مصاريف إدارية</span>
                    <span className="text-[11px] text-slate-400">رسوم المعاملة</span>
                  </div>
                </div>
                <div className="text-left flex items-center gap-2">
                  <span className="text-xs font-black text-amber-700 bg-white border border-amber-100 px-2 py-0.5 rounded-md">
                    {adminPct}%
                  </span>
                  <span className="font-bold text-amber-700 text-sm font-['Cairo']">
                    +{Math.round(result.adminFeesAmount).toLocaleString()} ج.م
                  </span>
                </div>
              </div>
            )}

            {/* Interest */}
            <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:bg-rose-50/40 hover:border-rose-200 transition-colors">
              <div className="flex items-center gap-2.5">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/30 flex-shrink-0"></span>
                <div>
                  <span className="text-slate-700 text-xs font-bold block">إجمالي الفوائد</span>
                  <span className="text-[11px] text-slate-400">أرباح فترة التمويل</span>
                </div>
              </div>
              <div className="text-left flex items-center gap-2">
                <span className="text-xs font-black text-rose-700 bg-white border border-rose-100 px-2 py-0.5 rounded-md">
                  {interestPct}%
                </span>
                <span className="font-bold text-rose-600 text-sm font-['Cairo']">
                  +{Math.round(result.totalInterest).toLocaleString()} ج.م
                </span>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="flex justify-between items-center p-3.5 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-slate-100 rounded-xl border border-emerald-200/80 mt-4">
              <span className="text-slate-800 font-bold text-sm">المجموع الإجمالي النهائي:</span>
              <span className="font-black text-emerald-700 text-lg font-['Cairo']">
                {Math.round(result.totalPayment).toLocaleString()} ج.م
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};