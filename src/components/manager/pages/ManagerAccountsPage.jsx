import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAccounts, freezeAccount, unfreezeAccount, closeAccount } from "../../../services/manager-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Ban, Lock, Unlock } from "lucide-react";

export default function ManagerAccountsPage() {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [actionType, setActionType] = useState("");
    const [confirmText, setConfirmText] = useState("");

    const loadAccounts = () => {
        getAllAccounts().then(res => {
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
        if(confirmText !== actionType) return;
        try {
            if(actionType === 'FREEZE') await freezeAccount(selectedAccount.id);
            if(actionType === 'UNFREEZE') await unfreezeAccount(selectedAccount.id);
            if(actionType === 'CLOSE') await closeAccount(selectedAccount.id);
            alert(`Account ${actionType}D Successfully`);
            setSelectedAccount(null);
            loadAccounts();
        } catch (error) { alert("Action Failed"); }
    };

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-6">All Accounts</h2>

            <div className="bg-white dark:bg-emerald-900 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700 shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase">
                    <tr>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Account No</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Type</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Balance</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Status</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                    {Array.isArray(accounts) && accounts.length > 0 ? (
                        accounts.map(acc => (
                            <tr key={acc.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/50 text-emerald-900 dark:text-emerald-100 font-medium">
                                <td className="p-4 font-mono">{acc.accountNumber}</td>
                                <td className="p-4">{acc.accountType}</td>
                                <td className="p-4 font-bold text-emerald-700 dark:text-emerald-300">₹ {acc.currentBalance?.toLocaleString()}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${acc.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 border-emerald-300' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                        {acc.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right flex justify-end gap-2">
                                    {acc.status === 'ACTIVE' && (
                                        <Button size="sm" variant="outline" onClick={() => openActionModal(acc, 'FREEZE')} className="h-8 border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                                            <Lock className="h-3 w-3 mr-1" /> Freeze
                                        </Button>
                                    )}
                                    {acc.status === 'FROZEN' && (
                                        <Button size="sm" variant="outline" onClick={() => openActionModal(acc, 'UNFREEZE')} className="h-8 border-emerald-300 text-emerald-700 hover:bg-emerald-50">
                                            <Unlock className="h-3 w-3 mr-1" /> Unfreeze
                                        </Button>
                                    )}
                                    <Button size="sm" variant="destructive" onClick={() => openActionModal(acc, 'CLOSE')} className="h-8">
                                        <Ban className="h-3 w-3 mr-1" /> Close
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="5" className="p-8 text-center text-emerald-500">No Accounts Found</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!selectedAccount} onClose={() => setSelectedAccount(null)} title={`Confirm ${actionType}`}>
                <div className="space-y-4">
                    <p className="text-emerald-800 dark:text-emerald-200">
                        You are about to <strong>{actionType}</strong> account <strong>{selectedAccount?.accountNumber}</strong>.
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
                        Please type <span className="uppercase text-red-600">{actionType}</span> to confirm.
                    </p>
                    <Input
                        type="text"
                        className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-white"
                        placeholder={`Type ${actionType}`}
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                    />
                    <Button
                        onClick={handleExecuteAction}
                        disabled={confirmText !== actionType}
                        className="w-full bg-emerald-600 disabled:bg-emerald-400 hover:bg-emerald-700 text-white font-bold"
                    >
                        Confirm Action
                    </Button>
                </div>
            </Modal>
        </div>
    );
}