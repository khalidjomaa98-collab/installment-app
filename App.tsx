import React, { useState, useEffect } from 'react';
import { LoanParams, CalculationResult } from './types';
import { calculateLoan } from './services/loanService';
import { ResultsSummary } from './components/ResultsSummary';
import { InstallmentChart } from './components/InstallmentChart';
import { ScheduleTable } from './components/ScheduleTable';
import { WarningMessages } from './components/WarningMessages';
import { numberToArabicWords } from './services/tafqeet';
import { formatEgyptianPhone } from './services/phoneUtils';

const initialDefaultParams: LoanParams = {
  totalAmount: 10000,
  downPayment: 1000,
  interestRate: 5, 
  interestType: 'monthly',
  durationMonths: 6,
  addAdminFees: true,
  adminFeesType: 'percentage',
  adminFeesValue: 10
};

const durationPresets = [6, 8, 10, 12];
const downPaymentPresets = [0, 10, 20, 30, 50];

const App: React.FC = () => {
  const [params, setParams] = useState<LoanParams>(initialDefaultParams);
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [result, setResult] = useState<CalculationResult | null>(null);
  
  // Tab State for Results Section
  const [activeTab, setActiveTab] = useState<'summary' | 'schedule' | 'chart'>('summary');

  // Auto-calculate when params change
  useEffect(() => {
    const res = calculateLoan(params);
    setResult(res);
  }, [params]);

  const updateParam = (key: keyof LoanParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams(initialDefaultParams);
    setCustomerPhone('');
  };

  const handleQuickDownPayment = (percentage: number) => {
    const calculated = Math.round(params.totalAmount * (percentage / 100));
    updateParam('downPayment', calculated);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppSend = () => {
    if (!result) return;
    const quoteText = `📄 *عرض تقسيط - الجندي لخدمات التقسيط*
────────────────────────
• إجمالي السلعة: ${params.totalAmount.toLocaleString()} ج.م
• المقدم: ${params.downPayment.toLocaleString()} ج.م
• مدة التقسيط: ${params.durationMonths} شهر
• *القسط الشهري: ${Math.round(result.monthlyPayment).toLocaleString()} ج.م*
  (${numberToArabicWords(result.monthlyPayment)})
• إجمالي السداد: ${Math.round(result.totalPayment).toLocaleString()} ج.م
────────────────────────`;

    const formatted = formatEgyptianPhone(customerPhone);
    const baseUrl = formatted ? `https://wa.me/${formatted}` : 'https://wa.me/';
    const url = `${baseUrl}?text=${encodeURIComponent(quoteText)}`;
    window.open(url, '_blank');
  };

  // Helper to compute monthly installment for each duration preset on the fly
  const getInstallmentForDuration = (months: number) => {
    return Math.round(calculateLoan({ ...params, durationMonths: months }).monthlyPayment);
  };

  return (
    <div className="min-h-screen bg-ambient-mesh font-[Cairo] selection:bg-emerald-100 selection:text-emerald-900 pb-24 lg:pb-16">
      
      {/* Printable Official Header (Only visible on paper / PDF) */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900">الجندي لخدمات التقسيط</h1>
            <p className="text-xs text-slate-500">بيان تفصيلي لجدول الأقساط وعرض السعر المالي</p>
          </div>
          <div className="text-left text-xs text-slate-500">
            <p>تاريخ البيان: {new Date().toLocaleDateString('ar-EG')}</p>
            {customerPhone && <p className="font-bold text-slate-700">هاتف العميل: {customerPhone}</p>}
            <p className="text-emerald-700 font-bold">عرض سعر معتمد</p>
          </div>
        </div>

        {/* Printable Summary Grid */}
        {result && (
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div><span className="text-slate-500">إجمالي السلعة:</span> <strong className="text-slate-800">{params.totalAmount.toLocaleString()} ج.م</strong></div>
            <div><span className="text-slate-500">المقدم المدفوع:</span> <strong className="text-slate-800">{params.downPayment.toLocaleString()} ج.م</strong></div>
            <div><span className="text-slate-500">المدة:</span> <strong className="text-slate-800">{params.durationMonths} شهر</strong></div>
            <div><span className="text-slate-500">القسط الشهري:</span> <strong className="text-emerald-700 text-sm">{Math.round(result.monthlyPayment).toLocaleString()} ج.م</strong></div>
          </div>
        )}
      </div>

      {/* Navbar */}
      <nav className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 mb-6 sm:mb-8 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <svg className="w-5 h-5 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-black text-slate-800 tracking-tight">
                  الجندي <span className="text-emerald-600 font-extrabold">لخدمات التقسيط</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  حاسبة ذكية
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium">
                حساب الأقساط والمشاركة الفورية
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all shadow-sm"
              title="طباعة عرض السعر وجدول الأقساط"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span className="hidden sm:inline">طباعة العرض</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5 sm:gap-6">
          
          {/* LEFT COLUMN: RESULTS (TABS) */}
          <div className="lg:w-2/3 order-2 lg:order-1 print-expand">
            <div className="no-print">
              <WarningMessages params={params} />
            </div>

            {result && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 min-h-[560px] flex flex-col overflow-hidden">
                
                {/* Tabs Header - Modern Segmented Control */}
                <div className="no-print border-b border-slate-100 p-2.5 sm:px-6 sm:pt-4 bg-slate-50/50 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                  <div className="flex bg-slate-200/60 p-1 rounded-2xl gap-1 w-full sm:w-auto">
                    <button 
                      onClick={() => setActiveTab('summary')}
                      className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'summary' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>ملخص</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'schedule' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>جدول الأقساط</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('chart')}
                      className={`flex-1 sm:flex-initial py-2 px-3 sm:px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                        activeTab === 'chart' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                      </svg>
                      <span>الرسم البياني</span>
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 font-medium hidden md:block">
                    المدة: <strong className="text-slate-700">{params.durationMonths} شهر</strong>
                  </span>
                </div>

                {/* Tab Content */}
                <div className="p-3.5 sm:p-6 lg:p-8 flex-1 bg-slate-50/40">
                  <div className={activeTab === 'summary' ? 'block' : 'hidden print:block'}>
                    <ResultsSummary result={result} params={params} customerPhone={customerPhone} />
                  </div>
                  
                  <div className={activeTab === 'schedule' ? 'block' : 'hidden print:block'}>
                    <ScheduleTable schedule={result.schedule} />
                  </div>

                  <div className={activeTab === 'chart' ? 'block' : 'hidden no-print'}>
                    <InstallmentChart result={result} />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* RIGHT COLUMN: INPUTS (COMPACT MOBILE & TOUCH FRIENDLY PANEL) */}
          <div className="lg:w-1/3 order-1 lg:order-2 no-print">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-4 sm:p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></span>
                  <h2 className="text-base sm:text-lg font-black text-slate-800">بيانات العملية</h2>
                </div>
                
                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="text-[11px] font-bold text-slate-500 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-colors inline-flex items-center gap-1"
                  title="إعادة تعيين البيانات للوضع الافتراضي"
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  <span>عملية جديدة</span>
                </button>
              </div>

              <div className="space-y-3.5 sm:space-y-4">

                {/* Egyptian Customer Phone (WhatsApp Direct) */}
                <div className="bg-emerald-50/70 rounded-2xl p-3 border border-emerald-200/80 shadow-xs">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-800">
                      رقم موبايل العميل (واتساب)
                    </label>
                    <span className="text-[10px] text-emerald-700 font-bold bg-white px-2 py-0.5 rounded-full border border-emerald-200">
                      محادثة مباشرة
                    </span>
                  </div>
                  <div className="relative flex items-center">
                    <input 
                      type="tel"
                      inputMode="numeric"
                      placeholder="010XXXXXXXX"
                      className="w-full bg-white border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-slate-800 font-bold text-sm outline-none transition-all dir-ltr text-right"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    <span className="absolute left-3 text-slate-400 text-xs font-bold pointer-events-none">
                      🇪🇬 +20
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">
                    يفتح الشات مع العميل فوراً بالواتساب دون الحاجة لتسجيل رقمه في جهات الاتصال
                  </p>
                </div>
                
                {/* Row 1: Amount & Down Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      إجمالي السلعة
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all"
                        value={params.totalAmount === 0 ? '' : params.totalAmount}
                        onChange={(e) => updateParam('totalAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-medium">ج.م</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      المقدم (كاش)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        inputMode="numeric"
                        min="0"
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all"
                        value={params.downPayment === 0 ? '' : params.downPayment}
                        onChange={(e) => updateParam('downPayment', Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-medium">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Quick Down Payment Percentages Pills */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400">نسب مقدم سريعة بلمسة واحدة:</span>
                    {params.totalAmount > 0 && params.downPayment > 0 && (
                      <span className="text-[10px] text-emerald-600 font-bold">
                        ({Math.round((params.downPayment / params.totalAmount) * 100)}%)
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {downPaymentPresets.map((pct) => {
                      const calculatedVal = Math.round(params.totalAmount * (pct / 100));
                      const isSelected = params.downPayment === calculatedVal;
                      return (
                        <button
                          key={pct}
                          type="button"
                          onClick={() => handleQuickDownPayment(pct)}
                          className={`py-1.5 text-[11px] font-bold rounded-xl transition-all border ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {pct === 0 ? 'بدون' : `${pct}%`}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Duration Cards (6, 8, 10, 12) with Instant Monthly Price */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-slate-400">اختر مدة التقسيط (الشهور):</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      القسط المحسوب
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {durationPresets.map((months) => {
                      const isSelected = params.durationMonths === months;
                      const monthlyEst = getInstallmentForDuration(months);
                      return (
                        <button
                          key={months}
                          type="button"
                          onClick={() => updateParam('durationMonths', months)}
                          className={`p-1.5 rounded-xl transition-all border text-center flex flex-col justify-center items-center ${
                            isSelected
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20'
                              : 'bg-slate-50 hover:bg-white text-slate-700 border-slate-200'
                          }`}
                        >
                          <span className="text-xs font-black block">
                            {months} ش
                          </span>
                          <span className={`text-[10px] font-bold mt-0.5 block ${isSelected ? 'text-emerald-100' : 'text-emerald-700'}`}>
                            {monthlyEst.toLocaleString()} ج
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Row 2: Admin Fees Container */}
                <div className="bg-slate-50/80 rounded-2xl p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="flex items-center cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={params.addAdminFees}
                        onChange={(e) => updateParam('addAdminFees', e.target.checked)}
                        className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 accent-emerald-600"
                      />
                      <span className="mr-2 text-xs font-bold text-slate-700">مصاريف إدارية</span>
                    </label>
                    {params.addAdminFees && (
                      <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded">
                        مفعّلة
                      </span>
                    )}
                  </div>

                  {params.addAdminFees && (
                    <div className="grid grid-cols-2 gap-2 mt-2 animate-fadeIn">
                      <div className="flex bg-white rounded-xl p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateParam('adminFeesType', 'fixed')}
                          className={`flex-1 text-[11px] font-bold rounded-lg py-1 transition-all ${
                            params.adminFeesType === 'fixed' 
                              ? 'bg-slate-800 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          ثابت
                        </button>
                        <button
                          onClick={() => updateParam('adminFeesType', 'percentage')}
                          className={`flex-1 text-[11px] font-bold rounded-lg py-1 transition-all ${
                            params.adminFeesType === 'percentage' 
                              ? 'bg-slate-800 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          نسبة %
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          min="0"
                          className="w-full bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-slate-800 text-sm font-bold focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none"
                          value={params.adminFeesValue === 0 ? '' : params.adminFeesValue}
                          onChange={(e) => updateParam('adminFeesValue', Math.max(0, parseFloat(e.target.value) || 0))}
                        />
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px]">
                          {params.adminFeesType === 'percentage' ? '%' : 'ج.م'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Interest Type Toggle Slider */}
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">نوع احتساب الفائدة</label>
                  <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button
                      onClick={() => updateParam('interestType', 'monthly')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        params.interestType === 'monthly' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      فائدة شهرية
                    </button>
                    <button
                      onClick={() => updateParam('interestType', 'fixed')}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                        params.interestType === 'fixed' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      فائدة مقطوعة (ثابتة)
                    </button>
                  </div>
                </div>

                {/* Row 4: Interest Rate & Stepper */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">نسبة الفائدة</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        inputMode="numeric"
                        min="0"
                        step="0.1"
                        className="w-full bg-emerald-50/50 hover:bg-white border border-emerald-200/80 rounded-xl px-3 py-2 text-emerald-900 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all"
                        value={params.interestRate}
                        onChange={(e) => updateParam('interestRate', Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-[11px]">%</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">المدة اليدوية (شهر)</label>
                    <div className="relative flex items-center">
                      <button 
                        onClick={() => updateParam('durationMonths', Math.max(1, params.durationMonths - 1))}
                        className="w-8 h-full absolute right-0 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-r-xl border-l border-slate-200 font-bold text-base transition-colors flex items-center justify-center"
                        title="إنقاص شهر"
                      >-</button>
                      <input
                        type="number"
                        inputMode="numeric"
                        min="1"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-9 py-2 text-center text-slate-800 font-black focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm"
                        value={params.durationMonths}
                        onChange={(e) => updateParam('durationMonths', Math.max(1, parseFloat(e.target.value) || 1))}
                      />
                      <button 
                        onClick={() => updateParam('durationMonths', params.durationMonths + 1)}
                        className="w-8 h-full absolute left-0 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-l-xl border-r border-slate-200 font-bold text-base transition-colors flex items-center justify-center"
                        title="زيادة شهر"
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Helper text with dynamic summary pill */}
                <div className="pt-2 border-t border-slate-100 text-center">
                  <span className="inline-block text-[11px] font-medium text-slate-500 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    {params.interestType === 'monthly' 
                      ? `إجمالي الفائدة: ${((params.interestRate * params.durationMonths)).toFixed(1)}% طوال فترة التقسيط`
                      : `إجمالي الفائدة: ${params.interestRate}% مقطوعة تضاف للأصل`
                    }
                  </span>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sticky Bottom Bar for Mobile Ergonomics (Visible only on mobile/tablet) */}
      {result && (
        <div className="no-print lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/90 px-4 py-2.5 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] flex items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block">القسط الشهري:</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900 font-['Cairo']">
                {Math.round(result.monthlyPayment).toLocaleString()}
              </span>
              <span className="text-xs font-bold text-emerald-600">ج.م / شهر</span>
            </div>
          </div>

          <button
            onClick={handleWhatsAppSend}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-md shadow-[#25D366]/25 transition-all"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.311.045-.698.058-2.036-.495-1.584-.654-2.59-2.28-2.668-2.385-.078-.104-.639-.851-.639-1.624 0-.773.404-1.154.548-1.312.144-.158.314-.198.42-.198.105 0 .211.001.303.006.098.005.228-.037.357.273.132.317.452 1.107.492 1.187.04.08.067.174.014.28-.053.107-.08.174-.16.267-.08.093-.169.208-.241.28-.08.08-.163.167-.07.327.094.16.417.689.896 1.115.617.549 1.137.719 1.298.8.16.08.254.067.348-.04.093-.107.401-.467.508-.627.107-.16.214-.134.359-.08.146.054.924.436 1.083.516.16.08.267.12.306.187.04.066.04.385-.104.79z" />
            </svg>
            <span>إرسال واتساب</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default App;