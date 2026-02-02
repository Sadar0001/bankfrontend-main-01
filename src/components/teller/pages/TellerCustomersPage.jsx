import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getBranchCustomers, updateCustomer } from "../../../services/teller-api-service";
import Modal from "../../Modal";

export default function TellerCustomersPage() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [selectedCust, setSelectedCust] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const loadCustomers = () => {
        getBranchCustomers().then(res => {
            setCustomers(res.data?.data || []);
        }).catch(console.error);
    };

    useEffect(() => { loadCustomers(); }, []);

    const openEditModal = (cust) => {
        setSelectedCust(cust);
        // Pre-fill form
        setValue("firstName", cust.firstName);
        setValue("lastName", cust.lastName);
        setValue("email", cust.email);
        setValue("phone", cust.phone);
        setValue("address", cust.address);
    };

    const onUpdate = async (data) => {
        try {
            await updateCustomer(selectedCust.id, data);
            alert("Customer Updated!");
            setSelectedCust(null);
            loadCustomers();
        } catch (err) {
            alert("Update Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/teller')} className="text-blue-400 mb-6">← Back to Dashboard</button>
            <h2 className="text-3xl font-bold mb-6">Branch Customers</h2>

            <div className="bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                    <tr>
                        <th className="p-4">Customer ID</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Phone</th>
                        <th className="p-4 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                    {customers.map(c => (
                        <tr key={c.id} className="hover:bg-gray-800/50">
                            <td className="p-4 font-mono">{c.customerId}</td>
                            <td className="p-4 font-bold">{c.firstName} {c.lastName}</td>
                            <td className="p-4 text-gray-400">{c.email}</td>
                            <td className="p-4 text-gray-400">{c.phone}</td>
                            <td className="p-4 text-right">
                                <button
                                    onClick={() => openEditModal(c)}
                                    className="bg-blue-600/20 text-blue-400 border border-blue-600 px-4 py-1 rounded hover:bg-blue-600 hover:text-white transition"
                                >
                                    Edit Details
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* EDIT MODAL */}
            <Modal isOpen={!!selectedCust} onClose={() => setSelectedCust(null)} title="Update Customer Details">
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">First Name</label>
                            <input {...register("firstName")} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Last Name</label>
                            <input {...register("lastName")} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Email</label>
                        <input {...register("email")} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Phone</label>
                        <input {...register("phone")} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Address</label>
                        <textarea {...register("address")} rows="2" className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded">
                        Save Changes
                    </button>
                </form>
            </Modal>
        </div>
    );
}