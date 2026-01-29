import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api'; // Adjust path if needed

export default function AccountDetailsPage() {
    const { accountId } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Date filters for transaction history (Default: Current Month)
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // 1. Fetch Account Details
                const accRes = await api.get(`/customer/accounts/${accountId}`);
                setAccount(accRes.data.data);

                // 2. Fetch Transactions
                const txnRes = await api.get(`/customer/accounts/${accountId}/transactions`, {
                    params: { startDate, endDate }
                });
                setTransactions(txnRes.data.data);
            } catch (err) {
                console.error("Error fetching account details", err);
                setError("Failed to load account details.");
            } finally {
                setLoading(false);
            }
        };

        if (accountId) fetchData();
    }, [accountId, startDate, endDate]);

    if (loading) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading...</div>;
    if (error) return <div className="min-h-screen bg-[#121212] text-red-500 flex items-center justify-center">{error}</div>;

    return (
        <div className="min-h-screen bg-[#121212] p-8 text-white">
            <button onClick={() => navigate('/customer')} className="text-blue-400 mb-6 flex items-center gap-2">
                ← Back to Dashboard
            </button>

            {/* Account Info Card */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 rounded-xl border border-slate-700 shadow-xl mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{account?.accountType} ACCOUNT</h1>
                        <p className="text-gray-400 font-mono tracking-wider">{account?.accountNumber}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Available Balance</p>
                        <p className="text-4xl font-bold text-green-400">₹ {account?.currentBalance?.toLocaleString('en-IN')}</p>
                    </div>
                </div>
                <div className="mt-6 flex gap-6 text-sm text-gray-400">
                    <p>Status: <span className="text-white font-bold">{account?.status}</span></p>
                    <p>Branch ID: <span className="text-white font-bold">{account?.branchId || 'N/A'}</span></p>
                    <p>Opened: <span className="text-white font-bold">{new Date(account?.openedDate).toLocaleDateString()}</span></p>
                </div>
            </div>

            {/* Transactions Section */}
            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
                    <h2 className="text-xl font-bold">Transaction History</h2>
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
                        />
                        <span className="self-center">-</span>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800 text-gray-400 text-sm uppercase">
                        <tr>
                            <th className="p-4">Date</th>
                            <th className="p-4">Description</th>
                            <th className="p-4">Ref ID</th>
                            <th className="p-4">Type</th>
                            <th className="p-4 text-right">Amount</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {transactions.length > 0 ? (
                            transactions.map((txn) => (
                                <tr key={txn.id} className="hover:bg-gray-800/50 transition">
                                    <td className="p-4 text-gray-300">
                                        {new Date(txn.transactionDate).toLocaleDateString()}
                                        <div className="text-xs text-gray-500">{new Date(txn.transactionDate).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="p-4 font-medium">{txn.description || 'Transfer'}</td>
                                    <td className="p-4 text-xs font-mono text-gray-500">{txn.transactionReference}</td>
                                    <td className="p-4">
                                            <span className={`text-xs font-bold px-2 py-1 rounded 
                                                ${txn.transactionType === 'DEPOSIT' || txn.toAccount?.id === account.id ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                                                {txn.transactionType}
                                            </span>
                                    </td>
                                    <td className={`p-4 text-right font-bold ${txn.toAccount?.id === account.id ? 'text-green-400' : 'text-white'}`}>
                                        {txn.toAccount?.id === account.id ? '+' : '-'} ₹ {txn.amount.toLocaleString('en-IN')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="p-8 text-center text-gray-500">
                                    No transactions found for this period.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}