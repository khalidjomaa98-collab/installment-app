import React, { useState, useEffect } from 'react';
import { LoanParams, CalculationResult } from './types';
import { calculateLoan } from './services/loanService';
import { ResultsSummary } from './components/ResultsSummary';
import { InstallmentChart } from './components/InstallmentChart';
import { ScheduleTable } from './components/ScheduleTable';
import { WarningMessages } from './components/WarningMessages';

const App: React.FC = () => {
  const [params, setParams] = useState<LoanParams>({
    totalAmount: 10000,
    downPayment: 1000,
    interestRate: 5, 
    interestType: 'monthly',
    durationMonths: 6,
    addAdminFees: true,
    adminFeesType: 'percentage',
    adminFeesValue: 10
  });

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-ambient-mesh font-[Cairo] selection:bg-emerald-100 selection:text-emerald-900 pb-16">
      
      {/* Printable Official Header (Only visible on paper / PDF) */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-4 text-center">
        <div className="flex justify-between items-center mb-2">
          <div className="text-right">
            <h1 className="text-2xl font-black text-slate-900">الجندي لخدمات التقسيط</h1>
            <p className="text-xs text-slate-500">بيان تفصيلي لجدول الأقساط وعرض السعر المالي</p>
          </div>
          <div className="text-left text-xs text-slate-500">
            <p>تاريخ البيان: {new Date().toLocaleDateString('ar-EG')}</p>
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
      <nav className="no-print bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 mb-8 sticky top-0 z-40 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20">
              <svg className="w-5 h-5 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-800 tracking-tight">
                  الجندي <span className="text-emerald-600 font-extrabold">لخدمات التقسيط</span>
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  حاسبة ذكية
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                حساب الأقساط الفورية وجداول الاستهلاك
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl transition-all shadow-sm hover:shadow"
              title="طباعة عرض السعر وجدول الأقساط"
            >
              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              <span>طباعة العرض</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: RESULTS (TABS) */}
          <div className="lg:w-2/3 order-2 lg:order-1 print-expand">
            <div className="no-print">
              <WarningMessages params={params} />
            </div>

            {result && (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 min-h-[580px] flex flex-col overflow-hidden">
                
                {/* Tabs Header - Modern Segmented Control */}
                <div className="no-print border-b border-slate-100 p-3 sm:px-6 sm:pt-4 bg-slate-50/50 flex items-center justify-between gap-2 overflow-x-auto no-scrollbar">
                  <div className="flex bg-slate-200/60 p-1 rounded-2xl gap-1">
                    <button 
                      onClick={() => setActiveTab('summary')}
                      className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
                        activeTab === 'summary' 
                          ? 'bg-white text-emerald-700 shadow-sm' 
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <span>نظرة عامة</span>
                    </button>

                    <button 
                      onClick={() => setActiveTab('schedule')}
                      className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
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
                      className={`py-2 px-4 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center gap-2 ${
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
                <div className="p-4 sm:p-6 lg:p-8 flex-1 bg-slate-50/40">
                  <div className={activeTab === 'summary' ? 'block' : 'hidden print:block'}>
                    <ResultsSummary result={result} />
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

          {/* RIGHT COLUMN: INPUTS (COMPACT MODERN PANEL) */}
          <div className="lg:w-1/3 order-1 lg:order-2 no-print">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 p-5 sm:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-1.5 h-6 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></span>
                  <h2 className="text-lg font-black text-slate-800">بيانات العملية</h2>
                </div>
                <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  حساب تلقائي
                </span>
              </div>

              <div className="space-y-4">
                
                {/* Row 1: Amount & Down Payment */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">
                      إجمالي السلعة
                    </label>
                    <div className="relative">
                      <input
                        type="number"
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
                        min="0"
                        className="w-full bg-slate-50 hover:bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none text-sm transition-all"
                        value={params.downPayment === 0 ? '' : params.downPayment}
                        onChange={(e) => updateParam('downPayment', Math.max(0, parseFloat(e.target.value) || 0))}
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-medium">ج.م</span>
                    </div>
                  </div>
                </div>

                {/* Row 2: Admin Fees Container */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
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
                    <div className="grid grid-cols-2 gap-2 mt-2.5 animate-fadeIn">
                      <div className="flex bg-white rounded-xl p-0.5 border border-slate-200">
                        <button
                          onClick={() => updateParam('adminFeesType', 'fixed')}
                          className={`flex-1 text-[11px] font-bold rounded-lg py-1 transition-all ${
                            params.adminFeesType === 'fixed' 
                              ? 'bg-slate-800 text-white shadow-sm' 
                              : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          مبلغ ثابت
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

                {/* Row 4: Interest Rate & Duration Stepper */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">نسبة الفائدة</label>
                    <div className="relative">
                      <input 
                        type="number" 
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
                    <label className="block text-xs font-bold text-slate-600 mb-1.5">المدة (بالأشهر)</label>
                    <div className="relative flex items-center">
                      <button 
                        onClick={() => updateParam('durationMonths', Math.max(1, params.durationMonths - 1))}
                        className="w-8 h-full absolute right-0 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-600 rounded-r-xl border-l border-slate-200 font-bold text-base transition-colors flex items-center justify-center"
                        title="إنقاص شهر"
                      >-</button>
                      <input
                        type="number"
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
    </div>
  );
};

export default App;