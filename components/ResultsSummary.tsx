import React from 'react';
import { CalculationResult } from '../types';

interface ResultsSummaryProps {
  result: CalculationResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  return (
    <div className="space-y-6 mb-8 animate-fadeIn">
      
      {/* Header Info - Simplified */}
      <div className="flex items-center gap-2 text-slate-500 border-b border-slate-100 pb-4">
        <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <span className="font-bold text-sm">ملخص العملية</span>
      </div>

      {/* Hero Card: Monthly Payment */}
      <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 rounded-full -ml-12 -mb-12 blur-xl"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-right">
            <p className="text-slate-300 font-medium mb-2 text-sm">القسط الشهري المستحق</p>
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-5xl font-bold tracking-tight text-white">
                {Math.round(result.monthlyPayment).toLocaleString()}
              </span>
              <span className="text-xl font-medium text-emerald-400">ج.م</span>
            </div>
          </div>
          
          <div className="h-12 w-px bg-white/10 hidden md:block"></div>
          
          <div className="text-center md:text-left">
            <p className="text-slate-300 text-sm mb-1">إجمالي المبلغ المسدد (شامل الفوائد)</p>
            <p className="text-2xl font-bold text-emerald-400">
              {result.totalPayment.toLocaleString()} <span className="text-sm text-white/70">ج.م</span>
            </p>
          </div>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Principal Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-emerald-200 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">أصل مبلغ التمويل</p>
                <p className="text-slate-400 text-[10px] mt-0.5">بعد خصم المقدم + المصاريف الإدارية</p>
            </div>
            <div className="p-2 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            </div>
          </div>
          <div className="flex flex-col">
              <p className="text-2xl font-bold text-slate-800 mt-2">
                {result.financedAmount.toLocaleString()} <span className="text-sm font-normal text-slate-400">ج.م</span>
              </p>
              {result.adminFeesAmount > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                    <span className="text-slate-500">يتضمن مصاريف إدارية:</span>
                    <span className="font-bold text-amber-600">+{result.adminFeesAmount.toLocaleString()} ج.م</span>
                </div>
              )}
          </div>
        </div>

        {/* Interest Card */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-red-200 transition-colors">
           <div className="flex justify-between items-start mb-2">
                <div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">إجمالي الفوائد</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">الأرباح المضافة على المبلغ</p>
                </div>
                <div className="p-2 bg-red-50 rounded-lg">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                    </svg>
                </div>
            </div>
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-slate-800 mt-2">
              {result.totalInterest.toLocaleString()} <span className="text-sm font-normal text-slate-400">ج.م</span>
            </p>
            <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center text-xs">
                 <span className="text-slate-500">هامش الربح:</span>
                 <span className="font-bold text-red-500">
                    {result.originalPrincipal > 0
                      ? `${Math.round((result.totalInterest / result.originalPrincipal) * 100)}% تقريباً`
                      : '—'}
                 </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};