import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers, getCustomerDetails, freezeAllCustomerAccounts } from "../../../services/manager-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, User, Mail } from "lucide-react";

export default function ManagerCustomersPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
    const [confirmText, setConfirmText] = useState("");

    useEffect(() => {
        getAllCustomers().then(res => setCustomers(res.data?.data || [])).catch(console.error);
    }, []);

    const openDetails = async (id) => {
        try {
            const res = await getCustomerDetails(id);
            setSelectedCustomerDetails(res.data?.data || res.data);
            setConfirmText("");
        } catch (error) { alert("Failed to load details"); }
    };

    const handleFreezeAll = async () => {
        if(confirmText !== "FREEZE ALL") return;
        try {
            const custId = selectedCustomerDetails.customer?.id || selectedCustomerDetails.id;
            await freezeAllCustomerAccounts(custId);
            alert("All accounts frozen.");
            setSelectedCustomerDetails(null);
        } catch (error) { alert("Failed to freeze"); }
    };

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-6">All Customers</h2>

            <div className="bg-white dark:bg-emerald-900 rounded-xl overflow-hidden border border-emerald-300 dark:border-emerald-700">
                <table className="w-full text-left">
                    <thead className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                    {customers.map(c => (
                        <tr key={c.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/50 text-emerald-900 dark:text-emerald-100 font-medium">
                            <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400">{c.id}</td>
                            <td className="p-4 flex items-center gap-2"><User className="h-4 w-4 text-emerald-500"/> {c.firstName} {c.lastName}</td>
                            <td className="p-4"><div className="flex items-center gap-2"><Mail className="h-4 w-4 text-emerald-400"/> {c.email}</div></td>
                            <td className="p-4 text-right">
                                <Button size="sm" onClick={() => openDetails(c.id)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">View Details</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!selectedCustomerDetails} onClose={() => setSelectedCustomerDetails(null)} title="Customer Profile">
                {selectedCustomerDetails && (
                    <div className="space-y-6">
                        <div className="bg-emerald-50 dark:bg-emerald-900 p-4 rounded-lg border border-emerald-200 dark:border-emerald-700">
                            <p className="text-emerald-900 dark:text-emerald-100"><strong>Name:</strong> {selectedCustomerDetails.customer?.firstName} {selectedCustomerDetails.customer?.lastName}</p>
                            <p className="text-emerald-800 dark:text-emerald-200 text-sm"><strong>Email:</strong> {selectedCustomerDetails.customer?.email}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-emerald-900 dark:text-emerald-100 mb-2">Accounts</h4>
                            {selectedCustomerDetails.accounts?.map(acc => (
                                <div key={acc.id} className="flex justify-between text-sm bg-white dark:bg-emerald-950 p-3 mb-2 rounded border border-emerald-200 dark:border-emerald-800">
                                    <span className="font-mono text-emerald-800 dark:text-emerald-200">{acc.accountType} ({acc.accountNumber})</span>
                                    <span className={`font-bold ${acc.status === 'FROZEN' ? 'text-red-500' : 'text-emerald-500'}`}>{acc.status}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-emerald-200 dark:border-emerald-700 pt-4">
                            <label className="block text-red-600 text-xs font-bold mb-2">Emergency: Type FREEZE ALL</label>
                            <div className="flex gap-2">
                                <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="bg-white dark:bg-emerald-900 border-red-300" placeholder="FREEZE ALL" />
                                <Button onClick={handleFreezeAll} disabled={confirmText !== "FREEZE ALL"} variant="destructive" className="font-bold">Freeze All</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}