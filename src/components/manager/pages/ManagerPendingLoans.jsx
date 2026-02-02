import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingLoans, approveLoan, rejectLoan } from "../../../services/manager-api-service";
import Modal from "../../Modal";

export default function ManagerPendingLoans() {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [action, setAction] = useState(null); // 'APPROVE' | 'REJECT'

    // Inputs
    const [approveData, setApproveData] = useState({ amount: "", tenure: "" });
    const [rejectReason, setRejectReason] = useState("");

    const refreshLoans = () => {
        // ✅ FIX: Extract .data.data (The Array)
        getPendingLoans().then(res => {
            // FIX: Add ?.data
            setLoans(res.data?.data || []);
        }).catch(console.error);
    };

    useEffect(() => { refreshLoans(); }, []);

    const openModal = (loan, type) => {
        setSelectedLoan(loan);
        setAction(type);
        if(type === 'APPROVE') {
            setApproveData({ amount: loan.requestedAmount, tenure: loan.requestedTenureMonths });
        } else {
            setRejectReason("");
        }
    };

    const handleConfirm = async () => {
        try {
            if (action === 'APPROVE') {
                await approveLoan(selectedLoan.id, approveData.amount, approveData.tenure);
            } else {
                await rejectLoan(selectedLoan.id, rejectReason);
            }
            alert(`Loan ${action}D successfully`);
            setSelectedLoan(null);
            refreshLoans();
        } catch (err) {
            alert("Operation Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-8 text-white">
            <button onClick={() => navigate('/manager')} className="text-blue-400 mb-6">← Back</button>
            <h2 className="text-3xl font-bold mb-6">Loan Applications</h2>

            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                {loans.map((loan, index) => (
                    <div key={loan.id} className={`p-6 flex justify-between items-center ${index !== loans.length -1 ? 'border-b border-gray-800' : ''}`}>
                        <div>
                            <p className="text-lg font-bold text-blue-300">REQ ID: {loan.id}</p>
                            <p className="text-2xl font-bold">₹ {loan.requestedAmount.toLocaleString()}</p>
                            <p className="text-sm text-gray-400">Customer ID: {loan.customerId} | Tenure: {loan.requestedTenureMonths}m</p>
                            <p className="text-sm text-gray-500 mt-1">"{loan.purpose}"</p>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => openModal(loan, 'REJECT')} className="px-4 py-2 border border-red-600 text-red-400 rounded hover:bg-red-900/30">Reject</button>
                            <button onClick={() => openModal(loan, 'APPROVE')} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Approve</button>
                        </div>
                    </div>
                ))}
                {loans.length === 0 && <div className="p-10 text-center text-gray-500">No pending loan applications.</div>}
            </div>

            {/* ACTION MODAL */}
            <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title={action === 'APPROVE' ? "Approve Loan" : "Reject Loan"}>
                <div className="space-y-4">
                    {action === 'APPROVE' ? (
                        <>
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Approved Amount</label>
                                <input type="number" value={approveData.amount} onChange={e => setApproveData({...approveData, amount: e.target.value})} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600"/>
                            </div>
                            <div>
                                <label className="block text-gray-400 text-xs mb-1">Approved Tenure (Months)</label>
                                <input type="number" value={approveData.tenure} onChange={e => setApproveData({...approveData, tenure: e.target.value})} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600"/>
                            </div>
                        </>
                    ) : (
                        <div>
                            <label className="block text-gray-400 text-xs mb-1">Rejection Reason</label>
                            <textarea rows="3" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full bg-gray-800 p-2 rounded text-white border border-gray-600" placeholder="Why is this rejected?"/>
                        </div>
                    )}
                    <button onClick={handleConfirm} className={`w-full py-3 rounded font-bold mt-4 ${action === 'APPROVE' ? 'bg-green-600' : 'bg-red-600'}`}>
                        Confirm {action}
                    </button>
                </div>
            </Modal>
        </div>
    );
}