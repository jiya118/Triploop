import { useState } from 'react';
import { CheckCircle2, Circle, Plus, Trash2, Smartphone, FileText, Shirt, Briefcase, MoreHorizontal } from 'lucide-react';

const PackingChecklist = () => {
  // Aligned with Table 8: packing_items
  const [items, setItems] = useState([
    { id: 1, name: 'Passport & Visa', category: 'documents', is_packed: true },
    { id: 2, name: 'Power Bank', category: 'electronics', is_packed: false },
    { id: 3, name: 'Cotton T-shirts', category: 'clothing', is_packed: false },
    { id: 4, name: 'Sunscreen', category: 'toiletries', is_packed: true },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('other');

  const categories = [
    { id: 'clothing', icon: Shirt, label: 'Clothing' },
    { id: 'electronics', icon: Smartphone, label: 'Electronics' },
    { id: 'documents', icon: FileText, label: 'Documents' },
    { id: 'other', icon: Briefcase, label: 'Other' }
  ];

  const toggleItem = (id) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, is_packed: !item.is_packed } : item
    ));
  };

  const addItem = (e) => {
    e.preventDefault();
    const name = newItemName.trim();
    if (!name) return;

    setItems([
      ...items,
      {
        id: Date.now(),
        name,
        category: newItemCategory,
        is_packed: false
      }
    ]);
    setNewItemName('');
  };

  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const resetChecklist = () => {
    setItems(items.map((item) => ({ ...item, is_packed: false })));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-8 py-10 mb-8 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Packing List</h1>
            <p className="text-slate-500 font-medium mt-1 italic">Don't leave the essentials behind.</p>
          </div>
          <div className="bg-blue-50 px-6 py-3 rounded-2xl border border-blue-100">
            <span className="text-blue-600 font-black text-lg">
              {items.filter(i => i.is_packed).length} / {items.length}
            </span>
            <span className="ml-2 text-blue-400 font-bold text-sm">Items Packed</span>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-6 space-y-10">
        {/* Add Item Input */}
        <form onSubmit={addItem} className="bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-2">
          <input 
            type="text" 
            placeholder="Add new item (e.g. Universal Adapter)" 
            className="flex-1 bg-transparent px-6 py-3 outline-none font-medium text-slate-700"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
          />
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            className="bg-slate-50 px-4 py-3 rounded-[1.5rem] font-bold text-slate-600 outline-none border border-slate-100"
          >
            <option value="clothing">Clothing</option>
            <option value="electronics">Electronics</option>
            <option value="documents">Documents</option>
            <option value="toiletries">Toiletries</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-[1.5rem] font-black hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-100">
            <Plus size={20} /> Add
          </button>
        </form>

        {/* Category Sections - Aligned with packing_category ENUM */}
        {categories.map((cat) => {
          const catItems = items.filter(i => i.category === cat.id || (cat.id === 'other' && !['clothing', 'electronics', 'documents'].includes(i.category)));
          if (catItems.length === 0 && cat.id !== 'other') return null;

          return (
            <section key={cat.id} className="animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center gap-2 mb-4 ml-2 text-slate-400">
                <cat.icon size={18} />
                <h3 className="text-xs font-black uppercase tracking-widest">{cat.label}</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {catItems.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => toggleItem(item.id)}
                    className={`group cursor-pointer flex items-center justify-between p-5 rounded-3xl border transition-all duration-300 
                      ${item.is_packed ? 'bg-white border-slate-100 opacity-60' : 'bg-white border-white shadow-sm hover:shadow-md hover:border-blue-100'}`}
                  >
                    <div className="flex items-center gap-4">
                      {item.is_packed ? (
                        <CheckCircle2 className="text-green-500" size={24} />
                      ) : (
                        <Circle className="text-slate-200 group-hover:text-blue-400" size={24} />
                      )}
                      <span className={`font-bold transition-all ${item.is_packed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                        {item.name}
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        {/* Reset Action - Screen 10 requirement */}
        <div className="pt-8 flex justify-center">
          <button onClick={resetChecklist} className="text-xs font-black text-slate-400 hover:text-blue-600 flex items-center gap-2 transition uppercase tracking-widest">
            <MoreHorizontal size={16} /> Reset Checklist for Next Trip
          </button>
        </div>
      </main>
    </div>
  );
};

export default PackingChecklist;
