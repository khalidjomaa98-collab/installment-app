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

  return (
    <div className="min-h-screen bg-slate-50 font-[Cairo] selection:bg-emerald-100 selection:text-emerald-900 pb-12">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 mb-6 sticky top-0 z-40 bg-opacity-95 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 flex items-center justify-center">
                <svg className="w-9 h-9 text-emerald-600 drop-shadow-md" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="2" y="2" width="36" height="36" rx="10" className="fill-white stroke-slate-100" strokeWidth="1"/>
                    <path d="M20 40C31.0457 40 40 31.0457 40 20C40 8.9543 31.0457 0 20 0C8.9543 0 0 8.9543 0 20C0 31.0457 8.9543 40 20 40Z" className="fill-emerald-600"/>
                    <path d="M12 20.5L17 25.5L28 14.5" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M28 25.5V14.5H17" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
                </svg>
            </div>
            <div>
                <h1 className="text-xl font-bold text-slate-800 tracking-tight">الجندي <span className="text-emerald-600">لخدمات التقسيط</span></h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT COLUMN: RESULTS (TABS) */}
          <div className="lg:w-2/3 order-2 lg:order-1">
             <div className="">
                <WarningMessages params={params} />
             </div>

             {result && (
               <div className="bg-white rounded-2xl shadow-sm border border-slate-200 min-h-[600px] flex flex-col">
                 
                 {/* Tabs Header */}
                 <div className="flex border-b border-slate-100 px-4 pt-4 gap-1 overflow-x-auto no-scrollbar">
                    <button 
                        onClick={() => setActiveTab('summary')}
                        className={`pb-3 px-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                            activeTab === 'summary' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        نظرة عامة
                        {activeTab === 'summary' && <span className="absolute bottom-0 right-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('schedule')}
                        className={`pb-3 px-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                            activeTab === 'schedule' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        جدول الأقساط
                        {activeTab === 'schedule' && <span className="absolute bottom-0 right-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('chart')}
                        className={`pb-3 px-4 text-sm font-bold transition-all relative whitespace-nowrap ${
                            activeTab === 'chart' ? 'text-emerald-600' : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        الرسم البياني
                        {activeTab === 'chart' && <span className="absolute bottom-0 right-0 w-full h-0.5 bg-emerald-600 rounded-t-full"></span>}
                    </button>
                 </div>

                 {/* Tab Content */}
                 <div className="p-6 flex-1 bg-slate-50/50">
                    <div className={activeTab === 'summary' ? 'block' : 'hidden'}>
                        <ResultsSummary result={result} />
                    </div>
                    
                    <div className={activeTab === 'schedule' ? 'block' : 'hidden'}>
                        <ScheduleTable schedule={result.schedule} />
                    </div>

                    <div className={activeTab === 'chart' ? 'block' : 'hidden'}>
                        <InstallmentChart result={result} />
                    </div>
                 </div>

               </div>
             )}
          </div>

          {/* RIGHT COLUMN: INPUTS (COMPACT GRID) */}
          <div className="lg:w-1/3 order-1 lg:order-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
                <span className="w-1 h-5 bg-emerald-500 rounded-full"></span>
                <h2 className="text-lg font-bold text-slate-800">بيانات العملية</h2>
              </div>

              <div className="space-y-4">
                
                {/* Row 1: Amount & Down Payment */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">إجمالي السلعة</label>
                        <div className="relative">
                            <input
                            type="number"
                            min="0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-bold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            value={params.totalAmount === 0 ? '' : params.totalAmount}
                            onChange={(e) => updateParam('totalAmount', Math.max(0, parseFloat(e.target.value) || 0))}
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">ج.م</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">المقدم (كاش)</label>
                        <div className="relative">
                            <input
                            type="number"
                            min="0"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 font-bold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                            value={params.downPayment === 0 ? '' : params.downPayment}
                            onChange={(e) => updateParam('downPayment', Math.max(0, parseFloat(e.target.value) || 0))}
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">ج.م</span>
                        </div>
                    </div>
                </div>

                {/* Row 2: Admin Fees */}
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center cursor-pointer select-none">
                      <input 
                            type="checkbox" 
                            checked={params.addAdminFees}
                            onChange={(e) => updateParam('addAdminFees', e.target.checked)}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                        />
                      <span className="mr-2 text-xs font-bold text-slate-700">مصاريف إدارية</span>
                    </label>
                  </div>

                  {params.addAdminFees && (
                    <div className="grid grid-cols-2 gap-2 animate-fadeIn">
                        <div className="flex bg-white rounded-md border border-slate-200">
                            <button
                            onClick={() => updateParam('adminFeesType', 'fixed')}
                            className={`flex-1 text-[10px] font-bold rounded-md py-1 ${params.adminFeesType === 'fixed' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                            >
                            ثابت
                            </button>
                            <button
                            onClick={() => updateParam('adminFeesType', 'percentage')}
                            className={`flex-1 text-[10px] font-bold rounded-md py-1 ${params.adminFeesType === 'percentage' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                            >
                            نسبة
                            </button>
                        </div>
                        <div className="relative">
                            <input
                            type="number"
                            min="0"
                            className="w-full bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 text-sm focus:border-emerald-500 outline-none"
                            value={params.adminFeesValue === 0 ? '' : params.adminFeesValue}
                            onChange={(e) => updateParam('adminFeesValue', Math.max(0, parseFloat(e.target.value) || 0))}
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]">
                            {params.adminFeesType === 'percentage' ? '%' : 'ج.م'}
                            </span>
                        </div>
                    </div>
                  )}
                </div>

                {/* Row 3: Interest Type Toggle */}
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button
                    onClick={() => updateParam('interestType', 'monthly')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                        params.interestType === 'monthly' 
                        ? 'bg-white text-emerald-600 shadow-sm' 
                        : 'text-slate-500'
                    }`}
                    >
                    فائدة شهرية
                    </button>
                    <button
                    onClick={() => updateParam('interestType', 'fixed')}
                    className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${
                        params.interestType === 'fixed' 
                        ? 'bg-white text-emerald-600 shadow-sm' 
                        : 'text-slate-500'
                    }`}
                    >
                    فائدة ثابتة
                    </button>
                </div>

                {/* Row 4: Interest Rate & Duration */}
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">نسبة الفائدة</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                min="0"
                                step="0.1"
                                className="w-full bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 text-emerald-800 font-bold focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none text-sm"
                                value={params.interestRate}
                                onChange={(e) => updateParam('interestRate', Math.max(0, parseFloat(e.target.value) || 0))}
                            />
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-emerald-600 text-[10px]">%</span>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1.5">المدة (أشهر)</label>
                        <div className="relative flex items-center">
                            <button 
                                onClick={() => updateParam('durationMonths', Math.max(1, params.durationMonths - 1))}
                                className="w-8 h-full absolute right-0 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-r-lg border-l border-slate-200 font-bold"
                            >-</button>
                            <input
                                type="number"
                                min="1"
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-8 py-2 text-center text-slate-800 font-bold focus:ring-1 focus:ring-emerald-500 outline-none text-sm"
                                value={params.durationMonths}
                                onChange={(e) => updateParam('durationMonths', Math.max(1, parseFloat(e.target.value) || 1))}
                            />
                            <button 
                                onClick={() => updateParam('durationMonths', params.durationMonths + 1)}
                                className="w-8 h-full absolute left-0 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-l-lg border-r border-slate-200 font-bold"
                            >+</button>
                        </div>
                    </div>
                </div>

                {/* Helper text */}
                <p className="text-[10px] text-slate-400 text-center pt-2 border-t border-slate-50">
                    {params.interestType === 'monthly' 
                        ? `إجمالي الفائدة: ${((params.interestRate * params.durationMonths)).toFixed(1)}% خلال المدة`
                        : `إجمالي الفائدة: ${params.interestRate}% مقطوعة تضاف للأصل`
                    }
                </p>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;