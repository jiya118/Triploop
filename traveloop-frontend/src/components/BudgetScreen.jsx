import React from 'react';
import { PieChart, BarChart3, TrendingDown, AlertCircle, ArrowLeft, Plus, DollarSign, Utensils, Plane, Ticket } from 'lucide-react';

const BudgetScreen = () => {
  // Aligned with Table 7: budgets and budget_summary view
  const budgetData = {
    total_spent: 1850,
    budget_cap: 2400,
    categories: [
      { name: 'Transport', spent: 800, color: 'bg-blue-500', icon: Plane },
      { name: 'Stay', spent: 650, color: 'bg-indigo-500', icon: Ticket },
      { name: 'Activities', spent: 300, color: 'bg-orange-500', icon: Ticket },
      { name: 'Meals', spent: 100, color: 'bg-green-500', icon: Utensils },
    ]
  };

  const remaining = budgetData.budget_cap - budgetData.total_spent;
  const spentPercentage = (budgetData.total_spent / budgetData.budget_cap) * 100;

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-slate-100 rounded-full transition"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trip Budget</h1>
          </div>
          <button className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100"><Plus size={20}/></button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Main Progress Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent</p>
            <h2 className="text-6xl font-black text-slate-900 mb-6">${budgetData.total_spent}</h2>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${spentPercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${spentPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">Limit: ${budgetData.budget_cap}</span>
              <span className={remaining < 200 ? 'text-red-500' : 'text-green-600'}>
                ${remaining} Left
              </span>
            </div>
          </div>
          {/* Subtle background decoration */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
        </div>

        {/* Category Breakdown - Aligned with expense_type ENUM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-6">
              <PieChart className="text-blue-600" size={20} />
              <h3 className="font-black text-slate-800">Category Breakdown</h3>
            </div>
            <div className="space-y-6">
              {budgetData.categories.map((cat) => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl text-white ${cat.color}`}>
                      <cat.icon size={16} />
                    </div>
                    <span className="font-bold text-slate-700">{cat.name}</span>
                  </div>
                  <span className="font-black text-slate-900">${cat.spent}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights / Alerts - Screen 9 requirement */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <TrendingDown className="text-green-400" size={20} />
                <h3 className="font-black">Budget Insights</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <AlertCircle className="text-orange-400 shrink-0" size={20} />
                  <p className="text-xs font-medium text-slate-300">
                    Your transport costs are 15% higher than the average for {itineraryData.stops[0].city}.
                  </p>
                </div>
                <div className="flex gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <DollarSign className="text-green-400 shrink-0" size={20} />
                  <p className="text-xs font-medium text-slate-300">
                    You're saving well on activities this week! Keep it up.
                  </p>
                </div>
              </div>
            </div>
            <button className="w-full py-4 mt-6 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition shadow-lg">
              Detailed History
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BudgetScreen;