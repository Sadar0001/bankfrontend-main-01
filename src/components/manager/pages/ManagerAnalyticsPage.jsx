import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranchEarnings, getBranchTransactions } from '../../../services/manager-api-service';
import UniversalCard from '../../customer/UniversalCard';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ManagerAnalyticsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [earnings, setEarnings] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => { fetchData(); }, [startDate, endDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [earningRes, txnRes] = await Promise.all([
                getBranchEarnings(startDate + "T00:00:00", endDate + "T23:59:59"),
                getBranchTransactions(startDate + "T00:00:00", endDate + "T23:59:59")
            ]);
            setEarnings(earningRes.data);
            setTransactions(txnRes.data);
        } catch (err) { console.error("Failed to fetch analytics", err); } finally { setLoading(false); }
    };

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Reports & Analytics</h1>
                <div className="flex gap-2 bg-emerald-100 dark:bg-emerald-900 p-2 rounded-lg border border-emerald-300 dark:border-emerald-700">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-transparent text-emerald-900 dark:text-emerald-100 font-bold outline-none text-sm" />
                    <span className="text-emerald-500 font-bold">-</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-transparent text-emerald-900 dark:text-emerald-100 font-bold outline-none text-sm" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <UniversalCard variant="gradient" title="TOTAL PROFIT" mainText={`₹ ${(earnings?.totalRevenue || 0).toLocaleString()}`} subText="Net Earnings" icon="💰" />
                <UniversalCard variant="default" title="TRANSACTION VOL" mainText={transactions.length} subText="Total Ops" />
                <UniversalCard variant="default" title="OP COST" mainText={`₹ ${(earnings?.totalExpenses || 0).toLocaleString()}`} subText="Operational Costs" />
            </div>

            <div className="bg-white dark:bg-emerald-900 rounded-xl border border-emerald-300 dark:border-emerald-700 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950">
                    <h2 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Transaction Master Log</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200 uppercase font-bold text-xs">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Ref ID</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">From</th>
                            <th className="p-4">To</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-200 dark:divide-emerald-700">
                        {loading ? <tr><td colSpan="6" className="p-8 text-center text-emerald-500">Loading...</td></tr> : transactions.map((txn) => (
                            <tr key={txn.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 font-medium">
                                <td className="p-4">{new Date(txn.transactionDate).toLocaleDateString()}</td>
                                <td className="p-4 font-mono text-xs">{txn.transactionReference}</td>
                                <td className="p-4"><span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-700 text-emerald-800 dark:text-emerald-100 rounded text-xs font-bold">{txn.transactionType}</span></td>
                                <td className="p-4 text-emerald-600 dark:text-emerald-400 text-xs">{txn.fromAccount?.accountNumber || 'CASH'}</td>
                                <td className="p-4 text-emerald-600 dark:text-emerald-400 text-xs">{txn.toAccount?.accountNumber || 'CASH'}</td>
                                <td className="p-4 text-right font-bold">₹ {txn.amount.toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}