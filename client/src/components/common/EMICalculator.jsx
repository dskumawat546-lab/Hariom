import React, { useState } from 'react';
import { Calculator, IndianRupee, Percent, Clock, CheckCircle2 } from 'lucide-react';

export default function EMICalculator({ defaultAmount = 5000000 }) {
  const [loanAmount, setLoanAmount] = useState(defaultAmount);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);

  // EMI Formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const calculateEMI = () => {
    const P = Number(loanAmount);
    const r = (Number(interestRate) / 12) / 100;
    const n = Number(tenureYears) * 12;

    if (P <= 0 || r <= 0 || n <= 0) return 0;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const monthlyEMI = calculateEMI();
  const totalPayment = monthlyEMI * tenureYears * 12;
  const totalInterest = Math.max(0, totalPayment - loanAmount);
  const principalRatio = totalPayment > 0 ? (loanAmount / totalPayment) * 100 : 50;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700/60 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-900">
          <Calculator className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <h3 className="text-xl md:text-2xl font-bold font-heading text-white">
            Home Loan EMI Calculator
          </h3>
          <p className="text-xs md:text-sm text-slate-400">
            अपने बजट के अनुसार मासिक किस्त (EMI) की गणना करें
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sliders Area */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-amber-400" />
                Loan Amount (ऋण राशि)
              </label>
              <span className="text-base font-bold text-amber-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                ₹{(loanAmount / 100000).toFixed(1)} Lakhs
              </span>
            </div>
            <input
              type="range"
              min="1000000"
              max="20000000"
              step="100000"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>₹10 Lakhs</span>
              <span>₹1 Crore</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Interest Rate */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-amber-400" />
                Interest Rate (ब्याज दर p.a.)
              </label>
              <span className="text-base font-bold text-amber-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                {interestRate}%
              </span>
            </div>
            <input
              type="range"
              min="6.5"
              max="14.0"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>6.5%</span>
              <span>8.5% (Typical Bank)</span>
              <span>14.0%</span>
            </div>
          </div>

          {/* Tenure */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                Tenure (अवधि - वर्ष)
              </label>
              <span className="text-base font-bold text-amber-400 bg-slate-800/80 px-3 py-1 rounded-lg border border-slate-700">
                {tenureYears} Years ({tenureYears * 12} Months)
              </span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>5 Years</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-5 bg-slate-800/90 rounded-2xl p-6 border border-slate-700 text-center relative">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
            Monthly EMI (मासिक किस्त)
          </span>
          <div className="text-3xl md:text-4xl font-extrabold text-amber-400 my-2 font-heading">
            ₹{monthlyEMI.toLocaleString('en-IN')}
            <span className="text-sm font-normal text-slate-300"> / month</span>
          </div>

          {/* Breakdown Bars */}
          <div className="mt-6 space-y-3 text-left">
            <div>
              <div className="flex justify-between text-xs text-slate-300 mb-1">
                <span>Principal (मूलधन):</span>
                <span className="font-bold text-white">₹{(loanAmount / 100000).toFixed(1)} Lakhs</span>
              </div>
              <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden flex">
                <div className="bg-amber-500 h-full" style={{ width: `${principalRatio}%` }}></div>
                <div className="bg-cyan-500 h-full" style={{ width: `${100 - principalRatio}%` }}></div>
              </div>
            </div>

            <div className="flex justify-between text-xs text-slate-300 pt-2 border-t border-slate-700/60">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block"></span>
                Total Interest (कुल ब्याज):
              </span>
              <span className="font-semibold text-cyan-400">₹{(totalInterest / 100000).toFixed(1)} Lakhs</span>
            </div>

            <div className="flex justify-between text-xs text-slate-300 pt-1">
              <span>Total Payable Amount:</span>
              <span className="font-bold text-white">₹{(totalPayment / 100000).toFixed(1)} Lakhs</span>
            </div>
          </div>

          <div className="mt-5 text-[11px] text-slate-400 flex items-center justify-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Leading Banks Pre-Approved (SBI, HDFC, ICICI, PNB)
          </div>
        </div>
      </div>
    </div>
  );
}
