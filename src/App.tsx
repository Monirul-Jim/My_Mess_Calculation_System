
import { useState, useMemo, useRef } from "react";
import {
  PlusCircle,
  Trash2,
  Calculator,
  Users,
  Settings,
  FileText,
  Download,
} from "lucide-react";
// 1. Import the hook
import { useReactToPrint } from "react-to-print";

// Types
interface Member {
  id: string;
  name: string;
  bazar: number;
  totalMeals: number;
  houseRent: number;
}

interface Utility {
  id: string;
  name: string;
  amount: number;
}

const App = () => {
  const reportRef = useRef<HTMLDivElement>(null);

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Asif", bazar: 2537, totalMeals: 43, houseRent: 3250 },
    { id: "2", name: "Noman", bazar: 1520, totalMeals: 40.5, houseRent: 3250 },
    { id: "3", name: "Omar", bazar: 1590, totalMeals: 43.5, houseRent: 2000 },
    { id: "4", name: "Monir", bazar: 2200, totalMeals: 11, houseRent: 2500 },
    { id: "5", name: "Mithu", bazar: 1278, totalMeals: 48.5, houseRent: 2500 },
    { id: "6", name: "Fahim", bazar: 1710, totalMeals: 28, houseRent: 2500 },
  ]);

  const [utilities, setUtilities] = useState<Utility[]>([
    { id: "1", name: "Khala Bill", amount: 3600 },
    { id: "2", name: "Electricity", amount: 1200 },
    { id: "3", name: "Gass", amount: 4800 },
    { id: "4", name: "Net", amount: 1000 },
    { id: "5", name: "Water", amount: 1000 },
    { id: "6", name: "Waste", amount: 200 },
  ]);

  // Calculations
  const totalBazar = useMemo(
    () => members.reduce((sum, m) => sum + m.bazar, 0),
    [members]
  );
  const totalMeals = useMemo(
    () => members.reduce((sum, m) => sum + m.totalMeals, 0),
    [members]
  );
  const mealRate = useMemo(
    () => (totalMeals > 0 ? totalBazar / totalMeals : 0),
    [totalBazar, totalMeals]
  );
  const totalHouseRent = useMemo(
    () => members.reduce((sum, m) => sum + m.houseRent, 0),
    [members]
  );
  const totalUtility = useMemo(
    () => utilities.reduce((sum, u) => sum + u.amount, 0),
    [utilities]
  );
  const utilityPerPerson = useMemo(
    () => (members.length > 0 ? totalUtility / members.length : 0),
    [totalUtility, members.length]
  );

  // 2. Setup the Print Hook
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Mess-Expense-Report",
  });

  // Handlers
  const addMember = () =>
    setMembers([
      ...members,
      {
        id: Date.now().toString(),
        name: "",
        bazar: 0,
        totalMeals: 0,
        houseRent: 0,
      },
    ]);

  const updateMember = (
    id: string,
    field: keyof Member,
    value: string | number
  ) =>
    setMembers(
      members.map((m) => (m.id === id ? { ...m, [field]: value } : m))
    );

  const removeMember = (id: string) =>
    setMembers(members.filter((m) => m.id !== id));

  const addUtility = () =>
    setUtilities([
      ...utilities,
      { id: Date.now().toString(), name: "", amount: 0 },
    ]);

  const updateUtility = (
    id: string,
    field: keyof Utility,
    value: string | number
  ) =>
    setUtilities(
      utilities.map((u) => (u.id === id ? { ...u, [field]: value } : u))
    );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-extrabold text-indigo-900">
              Mess Expense Tracker
            </h1>
            <p className="text-slate-500 mt-1 uppercase tracking-widest text-[10px] font-bold">
              Customized Rent & Meal Management
            </p>
          </div>
          <button
            // 3. Update the onClick to use handlePrint
            onClick={() => handlePrint()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-xl hover:bg-emerald-700 transition font-bold shadow-lg"
          >
            <Download size={20} /> Download PDF Report
          </button>
        </header>

        <div
          ref={reportRef}
          id="pdf-report-content"
          className="bg-slate-50 p-2"
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Input Section */}
            <div className="lg:col-span-3 space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold flex items-center gap-2 text-slate-700">
                    <Users className="text-indigo-600" size={24} /> Member
                    Inputs
                  </h2>
                  <button
                    onClick={addMember}
                    className="no-print flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition font-medium shadow-sm"
                  >
                    <PlusCircle size={18} /> Add Member
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="text-slate-500 uppercase text-[10px] tracking-wider font-black border-b">
                      <tr>
                        <th className="pb-4 pl-2">Name</th>
                        <th className="pb-4">Bazar (Tk)</th>
                        <th className="pb-4">Meals</th>
                        <th className="pb-4 text-indigo-600">Rent (Tk)</th>
                        <th className="pb-4 text-right pr-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {members.map((m) => (
                        <tr key={m.id} className="group">
                          <td className="py-3 pl-2">
                            <input
                              type="text"
                              value={m.name}
                              onChange={(e) =>
                                updateMember(m.id, "name", e.target.value)
                              }
                              className="w-full bg-transparent border-none focus:ring-2 focus:ring-indigo-100 rounded-lg p-1 font-semibold"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={m.bazar}
                              onChange={(e) =>
                                updateMember(
                                  m.id,
                                  "bazar",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24 bg-transparent border-none focus:ring-2 focus:ring-indigo-100 rounded-lg p-1"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={m.totalMeals}
                              onChange={(e) =>
                                updateMember(
                                  m.id,
                                  "totalMeals",
                                  Number(e.target.value)
                                )
                              }
                              className="w-20 bg-transparent border-none focus:ring-2 focus:ring-indigo-100 rounded-lg p-1"
                            />
                          </td>
                          <td className="py-3">
                            <input
                              type="number"
                              value={m.houseRent}
                              onChange={(e) =>
                                updateMember(
                                  m.id,
                                  "houseRent",
                                  Number(e.target.value)
                                )
                              }
                              className="w-24 bg-indigo-50 border-none focus:ring-2 focus:ring-indigo-200 rounded-lg p-1 font-bold text-indigo-700"
                            />
                          </td>
                          <td className="py-3 text-right pr-2">
                            <button
                              onClick={() => removeMember(m.id)}
                              className="text-slate-300 hover:text-red-500 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Detailed Monthly Bill with Cost Without Rent */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-slate-700">
                  <FileText className="text-emerald-600" size={24} /> Detailed
                  Monthly Bill
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-bold">
                      <tr>
                        <th className="p-4 rounded-l-lg text-left">Member</th>
                        <th className="p-4 text-center">Meal Cost</th>
                        <th className="p-4 text-center">Utility</th>
                        <th className="p-4 text-center text-blue-600">
                          Cost (No Rent)
                        </th>
                        <th className="p-4 text-center">Rent</th>
                        <th className="p-4 text-center">Total Cost</th>
                        <th className="p-4 rounded-r-lg text-right">Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {members.map((m) => {
                        const mealCost = m.totalMeals * mealRate;
                        const costWithoutRent = mealCost + utilityPerPerson;
                        const grandTotal = costWithoutRent + m.houseRent;
                        const balance = m.bazar - grandTotal;
                        return (
                          <tr
                            key={m.id}
                            className="hover:bg-slate-50 transition"
                          >
                            <td className="p-4 font-bold text-slate-800">
                              {m.name || "Guest"}
                            </td>
                            <td className="p-4 text-center font-mono">
                              {mealCost.toFixed(2)}
                            </td>
                            <td className="p-4 text-center font-mono">
                              {utilityPerPerson.toFixed(2)}
                            </td>
                            <td className="p-4 text-center font-mono font-bold text-blue-600 bg-blue-50/30">
                              {costWithoutRent.toFixed(2)}
                            </td>
                            <td className="p-4 text-center font-mono font-bold text-indigo-600">
                              {m.houseRent.toFixed(2)}
                            </td>
                            <td className="p-4 text-center font-black text-slate-900">
                              {grandTotal.toFixed(2)}
                            </td>
                            <td
                              className={`p-4 text-right font-black ${
                                balance >= 0 ? "text-green-600" : "text-red-600"
                              }`}
                            >
                              {balance >= 0
                                ? `+${balance.toFixed(2)}`
                                : balance.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar Section */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Calculator className="text-indigo-400" /> Summary
                </h2>
                <div className="space-y-4 border-t border-slate-800 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Meal Rate</span>
                    <span className="text-xl font-mono text-yellow-400">
                      ৳{mealRate.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Bazar</span>
                    <span>৳{totalBazar}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Rent</span>
                    <span>৳{totalHouseRent}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Utility</span>
                    <span>৳{totalUtility}</span>
                  </div>
                </div>
              </div>

              {/* Shared Bills Section */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold flex items-center gap-2 text-slate-700">
                    <Settings className="text-slate-500" size={20} /> Shared
                    Bills
                  </h2>
                  <button
                    onClick={addUtility}
                    className="text-indigo-600 hover:bg-indigo-50 p-1 rounded-full transition"
                  >
                    <PlusCircle size={22} />
                  </button>
                </div>
                <div className="space-y-3">
                  {utilities.map((u) => (
                    <div key={u.id} className="flex gap-2 items-center">
                      <input
                        className="flex-1 bg-slate-50 border-none text-xs p-2 rounded-lg"
                        value={u.name}
                        onChange={(e) =>
                          updateUtility(u.id, "name", e.target.value)
                        }
                      />
                      <input
                        className="w-16 bg-slate-50 border-none text-xs p-2 rounded-lg font-bold"
                        type="number"
                        value={u.amount}
                        onChange={(e) =>
                          updateUtility(u.id, "amount", Number(e.target.value))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 4. Add print-specific styles to handle the layout during printing */}
      <style>{`
        @media print {
          body { background-color: white !important; }
          .no-print { display: none !important; }
          #pdf-report-content { padding: 0 !important; margin: 0 !important; width: 100% !important; }
          .shadow-lg, .shadow-xl, .shadow-sm { box-shadow: none !important; border: 1px solid #e2e8f0 !important; }
        }
      `}</style>
    </div>
  );
};

export default App;