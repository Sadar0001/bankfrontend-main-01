import { useEffect, useState } from "react";
import Modal from "../../Modal";

export default function RequestApprovalTable({ title, fetchData, onApprove, onReject }) {
    const [requests, setRequests] = useState([]);
    const [selectedReq, setSelectedReq] = useState(null);
    const [rejectReason, setRejectReason] = useState("");
    const [loading, setLoading] = useState(false);

    const loadData = () => {
        setLoading(true);
        fetchData()
            .then(res => setRequests(res.data?.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { loadData(); }, []);

    const handleApprove = async (id) => {
        if(!confirm("Confirm Approval?")) return;
        try {
            await onApprove(id);
            alert("Approved Successfully");
            loadData();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || "Error"));
        }
    };

    const handleReject = async () => {
        if (!rejectReason) return alert("Reason is required");
        try {
            await onReject(selectedReq.id, rejectReason);
            alert("Rejected Successfully");
            setSelectedReq(null);
            setRejectReason("");
            loadData();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || "Error"));
        }
    };

    // Helper to extract specific details based on request type
    const getDetail = (req) => {
        if (req.accountType) return `Type: ${req.accountType}`;
        if (req.cardType) return `Card: ${req.cardType}`;
        if (req.numberOfLeaves) return `Leaves: ${req.numberOfLeaves}`;
        return "-";
    };

    return (
        <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-800 border-b border-gray-700">
                <h3 className="text-lg font-bold text-white">{title}</h3>
            </div>

            {loading ? <div className="p-8 text-center text-gray-400">Loading...</div> : (
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-gray-800/50 text-xs uppercase text-gray-500">
                    <tr>
                        <th className="p-4">Req ID</th>
                        <th className="p-4">Customer / Account</th>
                        <th className="p-4">Details</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {requests.length > 0 ? requests.map(req => (
                        <tr key={req.id} className="hover:bg-gray-800/50">
                            <td className="p-4 font-mono">{req.id}</td>
                            <td className="p-4">
                                {req.requestedBy?.customerId || req.customer?.customerId}
                                <div className="text-xs text-gray-500">
                                    {req.account?.accountNumber ? `Acc: ${req.account.accountNumber}` : 'New Account'}
                                </div>
                            </td>
                            <td className="p-4 text-white font-medium">{getDetail(req)}</td>
                            <td className="p-4">
                                    <span className="px-2 py-1 rounded text-xs border border-yellow-600 text-yellow-400 bg-yellow-900/20">
                                        {req.status}
                                    </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <button
                                    onClick={() => setSelectedReq(req)}
                                    className="px-3 py-1 text-red-400 hover:bg-red-900/30 rounded border border-red-800"
                                >
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleApprove(req.id)}
                                    className="px-3 py-1 text-green-400 hover:bg-green-900/30 rounded border border-green-800"
                                >
                                    Approve
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="p-8 text-center">No pending requests</td></tr>
                    )}
                    </tbody>
                </table>
            )}

            {/* REJECT MODAL */}
            <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title="Reject Request">
                <div className="space-y-4">
                    <p className="text-gray-300">Please provide a reason for rejection:</p>
                    <textarea
                        className="w-full bg-gray-800 border border-gray-600 rounded p-3 text-white"
                        rows="3"
                        placeholder="e.g. Invalid Documents"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <button
                        onClick={handleReject}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded"
                    >
                        Confirm Rejection
                    </button>
                </div>
            </Modal>
        </div>
    );
}