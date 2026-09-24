import React, { useState } from 'react';
import { CalculationResult, LoanParams } from '../types';
import { numberToArabicWords } from '../services/tafqeet';

interface ResultsSummaryProps {
  result: CalculationResult;
  params: LoanParams;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ result, params }) => {
  const [copied, setCopied] = useState(false);

  const principalPercent = result.totalPayment > 0 
    ? Math.round((result.originalPrincipal / result.totalPayment) * 100) 
    : 0;
  const interestPercent = result.totalPayment > 0 
    ? Math.round((result.totalInterest / result.totalPayment) * 100) 
    : 0;
  const adminFeesPercent = result.totalPayment > 0 
    ? Math.max(0, 100 - principalPercent - interestPercent) 
    : 0;

  const quoteText = `📄 *عرض تقسيط - الجندي لخدمات التقسيط*
────────────────────────
• إجمالي السلعة: ${params.totalAmount.toLocaleString()} ج.م
• المقدم: ${params.downPayment.toLocaleString()} ج.م
• مدة التقسيط: ${params.durationMonths} شهر
• *القسط الشهري: ${Math.round(result.monthlyPayment).toLocaleString()} ج.م*
  (${numberToArabicWords(result.monthlyPayment)})
• إجمالي السداد: ${Math.round(result.totalPayment).toLocaleString()} ج.م
────────────────────────`;

  const handleCopy = () => {
    navigator.clipboard.writeText(quoteText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(quoteText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 mb-4 animate-fadeIn">
      
      {/* Header Info with Quick Share Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-bold text-slate-800 text-base">ملخص العملية الحسابية</h3>
        </div>
        
        {/* Quick Share Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
              copied 
                ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
            title="نسخ ملخص العرض كنص"
          >
            {copied ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span>تم النسخ!</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>نسخ العرض</span>
              </>
            )}
          </button>

          <button
            onClick={handleWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] text-white transition-all shadow-sm shadow-[#25D366]/20"
            title="إرسال العرض في رسالة واتساب"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.058-2.036-.495-1.584-.654-2.59-2.28-2.668-2.385-.078-.104-.639-.851-.639-1.624 0-.773.404-1.154.548-1.312.144-.158.314-.198.42-.198.105 0 .211.001.303.006.098.005.228-.037.357.273.132.317.452 1.107.492 1.187.04.08.067.174.014.28-.053.107-.08.174-.16.267-.08.093-.169.208-.241.28-.08.08-.163.167-.07.327.094.16.417.689.896 1.115.617.549 1.137.719 1.298.8.16.08.254.067.348-.04.093-.107.401-.467.508-.627.107-.16.214-.134.359-.08.146.054.924.436 1.083.516.16.08.267.12.306.187.04.066.04.385-.104.79z" />
            </svg>
            <span>واتساب</span>
          </button>
        </div>
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

            {/* Arabic Tafqeet Words */}
            <p className="text-emerald-300/90 text-xs mt-2 font-medium bg-white/5 py-1 px-3 rounded-lg inline-block border border-white/10">
              {numberToArabicWords(result.monthlyPayment)}
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