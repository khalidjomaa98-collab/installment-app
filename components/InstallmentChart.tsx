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
    { name: 'صافي السلعة', value: result.originalPrincipal },
    { name: 'مصاريف إدارية', value: result.adminFeesAmount },
    { name: 'إجمالي الفوائد', value: result.totalInterest },
  ].filter(item => item.value > 0);

  const COLORS = ['#10b981', '#f59e0b', '#dc2626']; 

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden h-full p-6 animate-fadeIn">
      <div className="flex flex-col h-full">
          <h4 className="text-lg font-bold text-slate-800 mb-6">توزيع المبالغ والنسب</h4>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 flex-1">
            <div className="w-full md:w-1/2 h-64 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `${value.toLocaleString()} ج.م`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full md:w-1/2 space-y-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                 <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 ml-2"></span>
                    <span className="text-slate-600 font-medium">صافي السلعة:</span>
                 </div>
                 <span className="font-bold text-slate-800">{result.originalPrincipal.toLocaleString()} ج.م</span>
              </div>
              
              {result.adminFeesAmount > 0 && (
                <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                  <div className="flex items-center">
                      <span className="w-3 h-3 rounded-full bg-amber-500 ml-2"></span>
                      <span className="text-slate-600 font-medium">مصاريف إدارية:</span>
                  </div>
                  <span className="font-bold text-amber-600">+{result.adminFeesAmount.toLocaleString()} ج.م</span>
                </div>
              )}

              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                 <div className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-red-600 ml-2"></span>
                    <span className="text-slate-600 font-medium">إجمالي الفوائد:</span>
                 </div>
                 <span className="font-bold text-red-600">+{result.totalInterest.toLocaleString()} ج.م</span>
              </div>

              <div className="flex justify-between items-center pt-2 bg-slate-50 p-3 rounded-xl mt-4">
                 <span className="text-slate-800 font-bold">المجموع الكلي:</span>
                 <span className="font-bold text-emerald-700 text-lg">{result.totalPayment.toLocaleString()} ج.م</span>
              </div>
            </div>
          </div>
      </div>
    </div>
  );
};