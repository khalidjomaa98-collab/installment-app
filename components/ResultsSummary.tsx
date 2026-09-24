import React from 'react';
import { CalculationResult } from '../types';

interface ResultsSummaryProps {
  result: CalculationResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result }) => {
  const principalPercent = result.totalPayment > 0 
    ? Math.round((result.originalPrincipal / result.totalPayment) * 100) 
    : 0;
  const interestPercent = result.totalPayment > 0 
    ? Math.round((result.totalInterest / result.totalPayment) * 100) 
    : 0;
  const adminFeesPercent = result.totalPayment > 0 
    ? Math.max(0, 100 - principalPercent - interestPercent) 
    : 0;

  return (
    <div className="space-y-6 mb-4 animate-fadeIn">
      
      {/* Header Info with Badge */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-bold text-slate-800 text-base">ملخص العملية الحسابية</h3>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
          حساب معتمد
        </span>
      </div>

      {/* Hero Card: Luxury Dark Emerald Gradient */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-slate-700/50">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-teal-500/10 rounded-full -ml-16 -mb-16 blur-2xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-right w-full md:w-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold mb-3 backdrop-blur-sm">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>القسط الشهري المستحق</span>
            </div>
            
            <div className="flex items-baseline justify-center md:justify-start gap-2">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white drop-shadow-sm font-['Cairo']">
                {Math.round(result.monthlyPayment).toLocaleString()}
              </span>
              <span className="text-lg sm:text-xl font-bold text-emerald-400">ج.م / شهر</span>
            </div>
            <p className="text-slate-400 text-xs mt-1.5 font-medium">
              مبلغ ثابت يُسدد شهرياً طوال مدة العقد
            </p>
          </div>
          
          <div className="h-16 w-px bg-white/10 hidden md:block"></div>
          
          <div className="text-center md:text-left bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm w-full md:w-auto min-w-[210px]">
            <p className="text-slate-300 text-xs font-medium mb-1">إجمالي المبلغ المسدد</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-['Cairo']">
              {Math.round(result.totalPayment).toLocaleString()} <span className="text-sm font-normal text-white/80">ج.م</span>
            </p>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center text-[11px] text-slate-300">
              <span>شامل الفوائد والمصاريف</span>
              <span className="text-emerald-300 font-bold">100%</span>
            </div>
          </div>
        </div>

        {/* Visual Ratio Bar Inside Hero Card */}
        {result.totalPayment > 0 && (
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex justify-between items-center text-xs text-slate-300 mb-2">
              <span className="text-[11px] text-slate-400">مخطط توزيع الإجمالي:</span>
              <div className="flex gap-4 text-[11px]">
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> أصل ({principalPercent}%)
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span> فوائد ({interestPercent}%)
                </span>
                {result.adminFeesAmount > 0 && (
                  <span className="inline-flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span> مصاريف ({adminFeesPercent}%)
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
              <div style={{ width: `${principalPercent}%` }} className="bg-emerald-500 h-full transition-all duration-500" title="الأصل"></div>
              <div style={{ width: `${interestPercent}%` }} className="bg-rose-500 h-full transition-all duration-500" title="الفوائد"></div>
              {result.adminFeesAmount > 0 && (
                <div style={{ width: `${adminFeesPercent}%` }} className="bg-amber-400 h-full transition-all duration-500" title="المصاريف الإدارية"></div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail Cards with Modern Financial Styling */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Principal Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">أصل مبلغ التمويل</p>
              <p className="text-slate-400 text-[11px] mt-0.5">صافي السلعة بعد خصم المقدم</p>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 font-['Cairo']">
              {Math.round(result.originalPrincipal).toLocaleString()} <span className="text-sm font-normal text-slate-400">ج.م</span>
            </p>
            
            {result.adminFeesAmount > 0 ? (
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-medium">مصاريف إدارية مضافة:</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  +{Math.round(result.adminFeesAmount).toLocaleString()} ج.م
                </span>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                <span>المصاريف الإدارية:</span>
                <span className="font-medium text-emerald-600">بدون مصاريف (0 ج.م)</span>
              </div>
            )}
          </div>
        </div>

        {/* Interest Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:border-rose-300 hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">إجمالي الأرباح / الفوائد</p>
              <p className="text-slate-400 text-[11px] mt-0.5">العائد المالي المضاف على الفترة</p>
            </div>
            <div className="p-2.5 bg-rose-50 text-rose-600 rounded-xl">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>

          <div className="flex flex-col">
            <p className="text-2xl sm:text-3xl font-black text-slate-800 mt-1 font-['Cairo']">
              {Math.round(result.totalInterest).toLocaleString()} <span className="text-sm font-normal text-slate-400">ج.م</span>
            </p>
            
            <div className="mt-3 pt-3 border-t border-slate-100 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-medium">هامش الربح الإجمالي:</span>
              <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                {result.originalPrincipal > 0
                  ? `${Math.round((result.totalInterest / result.originalPrincipal) * 100)}% من الأصل`
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};