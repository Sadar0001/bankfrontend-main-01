import { useEffect, useState } from "react";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

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

    const getDetail = (req) => {
        if (req.accountType) return `Type: ${req.accountType}`;
        if (req.cardType) return `Card: ${req.cardType}`;
        if (req.numberOfLeaves) return `Leaves: ${req.numberOfLeaves}`;
        return "-";
    };

    return (
        <div className="bg-white dark:bg-emerald-900 rounded-xl border border-emerald-300 dark:border-emerald-700 overflow-hidden shadow-sm">
            <div className="p-4 bg-emerald-100 dark:bg-emerald-950 border-b border-emerald-200 dark:border-emerald-800">
                <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-100">{title}</h3>
            </div>

            {loading ? <div className="p-8 text-center text-emerald-600 font-medium">Loading...</div> : (
                <table className="w-full text-left text-sm">
                    <thead className="bg-emerald-50 dark:bg-emerald-900/50 text-xs uppercase text-emerald-700 dark:text-emerald-300 font-bold">
                    <tr>
                        <th className="p-4 border-b border-emerald-200 dark:border-emerald-700">Req ID</th>
                        <th className="p-4 border-b border-emerald-200 dark:border-emerald-700">Customer / Account</th>
                        <th className="p-4 border-b border-emerald-200 dark:border-emerald-700">Details</th>
                        <th className="p-4 border-b border-emerald-200 dark:border-emerald-700">Status</th>
                        <th className="p-4 border-b border-emerald-200 dark:border-emerald-700 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-100 dark:divide-emerald-800">
                    {requests.length > 0 ? requests.map(req => (
                        <tr key={req.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <td className="p-4 font-mono text-emerald-900 dark:text-emerald-100">{req.id}</td>
                            <td className="p-4 text-emerald-900 dark:text-emerald-100">
                                {req.requestedBy?.customerId || req.customer?.customerId}
                                <div className="text-xs text-emerald-500 font-medium">
                                    {req.account?.accountNumber ? `Acc: ${req.account.accountNumber}` : 'New Account'}
                                </div>
                            </td>
                            <td className="p-4 text-emerald-800 dark:text-emerald-200 font-medium">{getDetail(req)}</td>
                            <td className="p-4">
                                <Badge variant="outline" className="border-yellow-400 text-yellow-700 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400">
                                    {req.status}
                                </Badge>
                            </td>
                            <td className="p-4 text-right space-x-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setSelectedReq(req)}
                                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950 font-bold"
                                >
                                    Reject
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => handleApprove(req.id)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                >
                                    Approve
                                </Button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="5" className="p-8 text-center text-emerald-500 font-medium">No pending requests</td></tr>
                    )}
                    </tbody>
                </table>
            )}

            <Modal isOpen={!!selectedReq} onClose={() => setSelectedReq(null)} title="Reject Request">
                <div className="space-y-4">
                    <p className="text-emerald-800 dark:text-emerald-200 font-medium">Please provide a reason for rejection:</p>
                    <Textarea
                        className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100 focus:ring-emerald-500"
                        rows="3"
                        placeholder="e.g. Invalid Documents"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <Button
                        onClick={handleReject}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                        Confirm Rejection
                    </Button>
                </div>
            </Modal>
        </div>
    );
}