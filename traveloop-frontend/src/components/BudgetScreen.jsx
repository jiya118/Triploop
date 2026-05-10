import { useState } from 'react';
import { PieChart, TrendingDown, AlertCircle, ArrowLeft, Plus, IndianRupee, Utensils, Plane, Ticket } from 'lucide-react';
import { formatRupees } from '../utils/currency';

const BudgetScreen = ({ goTo, currentTrip }) => {
  const [showHistory, setShowHistory] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenses, setExpenses] = useState([
    { id: 1, category: 'Transport', title: 'Flight booking', amount: 80000, date: '2026-06-18' },
    { id: 2, category: 'Stay', title: 'Paris hotel advance', amount: 65000, date: '2026-06-19' },
    { id: 3, category: 'Activities', title: 'Museum passes', amount: 30000, date: '2026-06-20' },
    { id: 4, category: 'Meals', title: 'Food estimate', amount: 10000, date: '2026-06-20' },
  ]);
  const [expenseDraft, setExpenseDraft] = useState({ title: '', category: 'Activities', amount: '', date: new Date().toISOString().slice(0, 10) });

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseDraft.title.trim() || Number(expenseDraft.amount) <= 0) return;
    setExpenses([
      {
        id: Date.now(),
        title: expenseDraft.title.trim(),
        category: expenseDraft.category,
        amount: Number(expenseDraft.amount),
        date: expenseDraft.date
      },
      ...expenses
    ]);
    setExpenseDraft({ title: '', category: 'Activities', amount: '', date: new Date().toISOString().slice(0, 10) });
    setShowExpenseForm(false);
  };

  // Aligned with Table 7: budgets and budget_summary view
  const categoryTotals = expenses.reduce((totals, expense) => {
    totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    return totals;
  }, {});
  const budgetData = {
    total_spent: expenses.reduce((sum, expense) => sum + expense.amount, 0),
    budget_cap: currentTrip?.total_budget || 240000,
    categories: [
      { name: 'Transport', spent: categoryTotals.Transport || 0, color: 'bg-blue-500', icon: Plane },
      { name: 'Stay', spent: categoryTotals.Stay || 0, color: 'bg-indigo-500', icon: Ticket },
      { name: 'Activities', spent: categoryTotals.Activities || 0, color: 'bg-orange-500', icon: Ticket },
      { name: 'Meals', spent: categoryTotals.Meals || 0, color: 'bg-green-500', icon: Utensils },
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
            <button onClick={() => goTo('VIEW')} className="p-2 hover:bg-slate-100 rounded-full transition" aria-label="Back to itinerary"><ArrowLeft size={20}/></button>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Trip Budget</h1>
          </div>
          <button onClick={() => setShowExpenseForm(true)} className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700" aria-label="Add expense"><Plus size={20}/></button>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Main Progress Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 text-center relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Total Spent</p>
            <h2 className="text-6xl font-black text-slate-900 mb-6">{formatRupees(budgetData.total_spent)}</h2>
            
            {/* Progress Bar */}
            <div className="w-full h-4 bg-slate-100 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full transition-all duration-1000 ${spentPercentage > 90 ? 'bg-red-500' : 'bg-blue-600'}`}
                style={{ width: `${spentPercentage}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between text-sm font-bold">
              <span className="text-slate-400">Limit: {formatRupees(budgetData.budget_cap)}</span>
              <span className={remaining < 20000 ? 'text-red-500' : 'text-green-600'}>
                {formatRupees(remaining)} Left
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
                  <span className="font-black text-slate-900">{formatRupees(cat.spent)}</span>
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
                    Your transport costs are 15% higher than the average for Paris.
                  </p>
                </div>
                <div className="flex gap-3 bg-white/10 p-4 rounded-2xl border border-white/5">
                  <IndianRupee className="text-green-400 shrink-0" size={20} />
                  <p className="text-xs font-medium text-slate-300">
                    You're saving well on activities this week! Keep it up.
                  </p>
                </div>
              </div>
            </div>
            <button onClick={() => setShowHistory(!showHistory)} className="w-full py-4 mt-6 bg-white text-slate-900 font-black rounded-2xl hover:bg-slate-100 transition shadow-lg">
              Detailed History
            </button>
          </div>
        </div>

        {showHistory && (
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-800 mb-6">Detailed History</h3>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-5 py-4">
                  <div>
                    <p className="font-black text-slate-800">{expense.title}</p>
                    <p className="text-xs font-bold text-slate-400">{expense.category} • {expense.date}</p>
                  </div>
                  <span className="font-black text-slate-900">{formatRupees(expense.amount)}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {showExpenseForm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6">
          <form onSubmit={addExpense} className="w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl space-y-4">
            <h2 className="text-2xl font-black text-slate-900">Add Expense</h2>
            <input
              value={expenseDraft.title}
              onChange={(e) => setExpenseDraft({ ...expenseDraft, title: e.target.value })}
              placeholder="Expense title"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="grid grid-cols-2 gap-3">
              <select
                value={expenseDraft.category}
                onChange={(e) => setExpenseDraft({ ...expenseDraft, category: e.target.value })}
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none"
              >
                <option>Transport</option>
                <option>Stay</option>
                <option>Activities</option>
                <option>Meals</option>
              </select>
              <input
                type="number"
                min="1"
                value={expenseDraft.amount}
                onChange={(e) => setExpenseDraft({ ...expenseDraft, amount: e.target.value })}
                placeholder="Amount in ₹"
                className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <input
              type="date"
              value={expenseDraft.date}
              onChange={(e) => setExpenseDraft({ ...expenseDraft, date: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400"
            />
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setShowExpenseForm(false)} className="flex-1 py-3 rounded-2xl bg-slate-100 font-bold text-slate-500">Cancel</button>
              <button type="submit" className="flex-1 py-3 rounded-2xl bg-blue-600 font-black text-white">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default BudgetScreen;
