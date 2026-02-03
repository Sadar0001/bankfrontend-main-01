import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingLoans, approveLoan, rejectLoan } from "../../../services/manager-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, X } from "lucide-react";

export default function ManagerPendingLoans() {
    const navigate = useNavigate();
    const [loans, setLoans] = useState([]);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [action, setAction] = useState(null);
    const [approveData, setApproveData] = useState({ amount: "", tenure: "" });
    const [rejectReason, setRejectReason] = useState("");

    const refreshLoans = () => {
        getPendingLoans().then(res => setLoans(res.data?.data || [])).catch(console.error);
    };

    useEffect(() => { refreshLoans(); }, []);

    const openModal = (loan, type) => {
        setSelectedLoan(loan);
        setAction(type);
        if(type === 'APPROVE') setApproveData({ amount: loan.requestedAmount, tenure: loan.requestedTenureMonths });
        else setRejectReason("");
    };

    const handleConfirm = async () => {
        try {
            if (action === 'APPROVE') await approveLoan(selectedLoan.id, approveData.amount, approveData.tenure);
            else await rejectLoan(selectedLoan.id, rejectReason);
            alert(`Loan ${action}D`);
            setSelectedLoan(null);
            refreshLoans();
        } catch (err) { alert("Failed"); }
    };

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-6">Loan Applications</h2>

            <div className="bg-white dark:bg-emerald-900 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700">
                {loans.map((loan, index) => (
                    <div key={loan.id} className={`p-6 flex justify-between items-center ${index !== loans.length -1 ? 'border-b border-emerald-200 dark:border-emerald-800' : ''}`}>
                        <div>
                            <p className="text-lg font-bold text-emerald-700 dark:text-emerald-300">REQ ID: {loan.id}</p>
                            <p className="text-2xl font-extrabold text-emerald-900 dark:text-emerald-100">₹ {loan.requestedAmount.toLocaleString()}</p>
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Customer: {loan.customerId} | Tenure: {loan.requestedTenureMonths}m</p>
                            <p className="text-sm text-emerald-500 italic mt-1">"{loan.purpose}"</p>
                        </div>
                        <div className="flex gap-3">
                            <Button size="sm" variant="outline" onClick={() => openModal(loan, 'REJECT')} className="border-red-200 text-red-600 hover:bg-red-50 font-bold">
                                <X className="mr-1 h-4 w-4"/> Reject
                            </Button>
                            <Button size="sm" onClick={() => openModal(loan, 'APPROVE')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                                <Check className="mr-1 h-4 w-4"/> Approve
                            </Button>
                        </div>
                    </div>
                ))}
                {loans.length === 0 && <div className="p-10 text-center text-emerald-500 font-bold">No Pending Applications</div>}
            </div>

            <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title={`${action === 'APPROVE' ? "Approve" : "Reject"} Loan`}>
                <div className="space-y-4">
                    {action === 'APPROVE' ? (
                        <>
                            <Input type="number" value={approveData.amount} onChange={e => setApproveData({...approveData, amount: e.target.value})} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" placeholder="Approved Amount" />
                            <Input type="number" value={approveData.tenure} onChange={e => setApproveData({...approveData, tenure: e.target.value})} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" placeholder="Approved Tenure" />
                        </>
                    ) : (
                        <textarea rows="3" value={rejectReason} onChange={e => setRejectReason(e.target.value)} className="w-full bg-emerald-50 dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded p-2 text-emerald-900 dark:text-emerald-100" placeholder="Reason for rejection..." />
                    )}
                    <Button onClick={handleConfirm} className={`w-full font-bold ${action === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'}`}>
                        Confirm {action}
                    </Button>
                </div>
            </Modal>
        </div>
    );
}