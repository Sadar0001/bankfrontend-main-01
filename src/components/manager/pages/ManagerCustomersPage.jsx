import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCustomers, getCustomerDetails, freezeAllCustomerAccounts } from "../../../services/manager-api-service";
import Modal from "../../Modal";

export default function ManagerCustomersPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]); // Initialize as empty array

    // Modal State
    const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
    const [confirmText, setConfirmText] = useState("");

    useEffect(() => {
        // ✅ FIX: Extract .data.data
        getAllCustomers().then(res => {
            // FIX: Add ?.data
            setCustomers(res.data?.data || []);
        }).catch(console.error);
    }, []);

    const openDetails = async (customerId) => {
        try {
            const res = await getCustomerDetails(customerId);
            // ✅ FIX: Extract .data.data for details too
            setSelectedCustomerDetails(res.data?.data || res.data);
            setConfirmText("");
        } catch (error) {
            alert("Failed to load details");
        }
    };

    const handleFreezeAll = async () => {
        if(confirmText !== "FREEZE ALL") return;
        try {
            // Check if structure matches
            const custId = selectedCustomerDetails.customer?.id || selectedCustomerDetails.id;
            await freezeAllCustomerAccounts(custId);
            alert("All accounts frozen.");
            setSelectedCustomerDetails(null);
        } catch (error) {
            alert("Failed to freeze accounts");
        }
    };

    return (
        <div className="p-8 text-white min-h-screen bg-[#121212]">
            <button onClick={() => navigate('/manager')} className="text-blue-400 mb-6">← Back</button>
            <h2 className="text-3xl font-bold mb-6">All Customers</h2>

            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-700">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {customers.length > 0 ? customers.map(c => (
                        <tr key={c.id} className="hover:bg-gray-800/50">
                            <td className="p-4 text-gray-400">{c.id}</td>
                            <td className="p-4 font-bold">{c.firstName} {c.lastName}</td>
                            <td className="p-4">{c.email}</td>
                            <td className="p-4 text-right">
                                <button onClick={() => openDetails(c.id)} className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700">Show Details</button>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan="4" className="p-8 text-center text-gray-500">No Customers Found</td></tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* DETAILS & FREEZE MODAL */}
            <Modal isOpen={!!selectedCustomerDetails} onClose={() => setSelectedCustomerDetails(null)} title="Customer Details">
                {selectedCustomerDetails && (
                    <div className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded text-sm">
                            {/* Optional Chaining (?.) prevents crash if data is missing */}
                            <p><strong>Name:</strong> {selectedCustomerDetails.customer?.firstName} {selectedCustomerDetails.customer?.lastName}</p>
                            <p><strong>Email:</strong> {selectedCustomerDetails.customer?.email}</p>
                            <p><strong>Phone:</strong> {selectedCustomerDetails.customer?.phone}</p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-2">Accounts Overview:</h4>
                            {selectedCustomerDetails.accounts?.map(acc => (
                                <div key={acc.id} className="flex justify-between text-xs bg-gray-800 p-2 mb-1 rounded border border-gray-700">
                                    <span>{acc.accountType} ({acc.accountNumber})</span>
                                    <span className={acc.status === 'FROZEN' ? 'text-red-400' : 'text-green-400'}>{acc.status}</span>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-700 pt-4">
                            <label className="block text-red-400 text-xs mb-2">Type <strong>FREEZE ALL</strong> to lock all accounts:</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={confirmText}
                                    onChange={(e) => setConfirmText(e.target.value)}
                                    className="flex-1 bg-gray-900 border border-gray-600 rounded p-2 text-white"
                                    placeholder="FREEZE ALL"
                                />
                                <button
                                    onClick={handleFreezeAll}
                                    disabled={confirmText !== "FREEZE ALL"}
                                    className="bg-red-600 disabled:bg-gray-700 px-4 py-2 rounded font-bold"
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}