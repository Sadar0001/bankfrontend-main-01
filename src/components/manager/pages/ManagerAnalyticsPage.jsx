import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBranchEarnings, getBranchTransactions } from '../../../services/manager-api-service';
import UniversalCard from '../../customer/UniversalCard';

export default function ManagerAnalyticsPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Default: Last 30 days
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    const [earnings, setEarnings] = useState(null);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch both in parallel
            const [earningRes, txnRes] = await Promise.all([
                getBranchEarnings(startDate + "T00:00:00", endDate + "T23:59:59"),
                getBranchTransactions(startDate + "T00:00:00", endDate + "T23:59:59")
            ]);
            setEarnings(earningRes.data);
            setTransactions(txnRes.data);
        } catch (err) {
            console.error("Failed to fetch analytics", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/manager')} className="text-blue-400 mb-6 flex items-center gap-2">
                ← Back to Dashboard
            </button>

            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Reports & Analytics</h1>

                {/* Date Filter */}
                <div className="flex gap-2 bg-gray-800 p-2 rounded-lg border border-gray-700">
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="bg-transparent text-white outline-none text-sm"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="bg-transparent text-white outline-none text-sm"
                    />
                </div>
            </div>

            {/* 1. Earnings Overview (Using your Universal Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <UniversalCard
                    variant="gradient"
                    title="TOTAL PROFIT"
                    mainText={`₹ ${(earnings?.totalRevenue || 0).toLocaleString()}`}
                    subText="Net earnings from charges"
                    icon="💰"
                />
                <UniversalCard
                    variant="default"
                    title="TRANSACTION VOLUME"
                    mainText={transactions.length}
                    subText="Total operations performed"
                />
                <UniversalCard
                    variant="default"
                    title="OPERATIONAL COST"
                    mainText={`₹ ${(earnings?.totalExpenses || 0).toLocaleString()}`} // Assuming backend sends this, or 0
                    subText="Branch operational costs"
                />
            </div>

            {/* 2. Transaction Master Log */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold">Transaction Master Log</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-800 text-gray-400 uppercase">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Ref ID</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">From Account</th>
                            <th className="p-4">To Account</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800 text-gray-300">
                        {loading ? (
                            <tr><td colSpan="6" className="p-8 text-center">Loading Data...</td></tr>
                        ) : transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-800/50">
                                    <td className="p-4">{new Date(txn.transactionDate).toLocaleDateString()}</td>
                                    <td className="p-4 font-mono text-xs">{txn.transactionReference}</td>
                                    <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                                txn.transactionType === 'DEPOSIT' ? 'bg-green-900/30 text-green-400 border-green-800' :
                                                    txn.transactionType === 'WITHDRAWAL' ? 'bg-red-900/30 text-red-400 border-red-800' :
                                                        'bg-blue-900/30 text-blue-400 border-blue-800'
                                            }`}>
                                                {txn.transactionType}
                                            </span>
                                    </td>
                                    <td className="p-4 text-gray-500">{txn.fromAccount?.accountNumber || 'CASH'}</td>
                                    <td className="p-4 text-gray-500">{txn.toAccount?.accountNumber || 'CASH'}</td>
                                    <td className="p-4 text-right font-bold text-white">₹ {txn.amount.toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="6" className="p-8 text-center text-gray-500">No transactions found in this range.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}