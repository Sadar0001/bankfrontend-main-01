import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAccounts, freezeAccount, unfreezeAccount, closeAccount } from "../../../services/manager-api-service";
import Modal from "../../Modal";

export default function ManagerAccountsPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);

    // Modal Logic
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [actionType, setActionType] = useState(""); // FREEZE, UNFREEZE, CLOSE
    const [confirmText, setConfirmText] = useState("");

    const loadAccounts = () => {
        getAllAccounts().then(res => {
            // ✅ FIX: Extract inner data array
            // If res.data.data exists (standard response), use it.
            // If res.data is the array (direct list), use it.
            const list = res.data?.data || (Array.isArray(res.data) ? res.data : []);
            setAccounts(list);
        }).catch(console.error);
    };

    useEffect(() => { loadAccounts(); }, []);

    const openActionModal = (acc, type) => {
        setSelectedAccount(acc);
        setActionType(type);
        setConfirmText("");
    };

    const handleExecuteAction = async () => {
        // Validation words: "FREEZE", "UNFREEZE", "CLOSE"
        if(confirmText !== actionType) return;

        try {
            if(actionType === 'FREEZE') await freezeAccount(selectedAccount.id);
            if(actionType === 'UNFREEZE') await unfreezeAccount(selectedAccount.id);
            if(actionType === 'CLOSE') await closeAccount(selectedAccount.id);

            alert(`Account ${actionType}D Successfully`);
            setSelectedAccount(null);
            loadAccounts();
        } catch (error) {
            alert("Action Failed");
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#121212]">
            <button onClick={() => navigate('/manager')} className="text-blue-400 mb-6">← Back</button>
            <h2 className="text-3xl font-bold mb-6">All Accounts</h2>

            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Account No</th>
                        <th className="p-4">Type</th>
                        <th className="p-4">Balance</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {/* Ensure 'accounts' is an array before mapping */}
                    {Array.isArray(accounts) && accounts.length > 0 ? (
                        accounts.map(acc => (
                            <tr key={acc.id} className="hover:bg-gray-800/50">
                                <td className="p-4 font-mono">{acc.accountNumber}</td>
                                <td className="p-4">{acc.accountType}</td>
                                <td className="p-4 font-bold text-green-400">₹ {acc.currentBalance?.toLocaleString()}</td>
                                <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs border ${acc.status === 'ACTIVE' ? 'border-green-600 text-green-400' : 'border-red-600 text-red-400'}`}>
                                            {acc.status}
                                        </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    {acc.status === 'ACTIVE' && (
                                        <button onClick={() => openActionModal(acc, 'FREEZE')} className="text-yellow-400 hover:underline text-sm">Freeze</button>
                                    )}
                                    {acc.status === 'FROZEN' && (
                                        <button onClick={() => openActionModal(acc, 'UNFREEZE')} className="text-green-400 hover:underline text-sm">Unfreeze</button>
                                    )}
                                    <button onClick={() => openActionModal(acc, 'CLOSE')} className="text-red-500 hover:underline text-sm">Close</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5" className="p-8 text-center text-gray-500">
                                No Accounts Found
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* CONFIRMATION MODAL */}
            <Modal isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} title={`Confirm ${actionType}`}>
                <div className="space-y-4">
                    <p>You are about to <strong>{actionType}</strong> account <strong>{selectedAccount?.accountNumber}</strong>.</p>
                    <p className="text-xs text-gray-400">Please type <strong>{actionType}</strong> to confirm.</p>

                    <input
                        type="text"
                        className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white"
                        placeholder={`Type ${actionType}`}
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                    />

                    <button
                        onClick={handleExecuteAction}
                        disabled={confirmText !== actionType}
                        className="w-full bg-blue-600 disabled:bg-gray-700 py-2 rounded font-bold text-white"
                    >
                        Confirm Action
                    </button>
                </div>
            </Modal>
        </div>
    );
}