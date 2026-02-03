import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getBranchCustomers, updateCustomer } from "../../../services/teller-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

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
        // SOLID WORKSPACE
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/teller')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
            </Button>
            <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50 mb-6">Branch Customers</h2>

            <div className="bg-white dark:bg-emerald-900 rounded-xl border border-emerald-300 dark:border-emerald-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 text-xs font-bold uppercase">
                    <tr>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Customer ID</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Name</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Email</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700">Phone</th>
                        <th className="p-4 border-b border-emerald-300 dark:border-emerald-700 text-right">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800">
                    {customers.map(c => (
                        <tr key={c.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-800/50 transition-colors">
                            <td className="p-4 font-mono text-emerald-900 dark:text-emerald-100 font-medium">{c.customerId}</td>
                            <td className="p-4 font-bold text-emerald-950 dark:text-white">{c.firstName} {c.lastName}</td>
                            <td className="p-4 text-emerald-700 dark:text-emerald-300">{c.email}</td>
                            <td className="p-4 text-emerald-700 dark:text-emerald-300">{c.phone}</td>
                            <td className="p-4 text-right">
                                <Button
                                    size="sm"
                                    onClick={() => openEditModal(c)}
                                    className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-800 dark:text-emerald-100 dark:hover:bg-emerald-700 border border-emerald-300 dark:border-emerald-600 font-bold"
                                >
                                    Edit Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <Modal isOpen={!!selectedCust} onClose={() => setSelectedCust(null)} title="Update Customer Details">
                <form onSubmit={handleSubmit(onUpdate)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-emerald-900 dark:text-emerald-100">First Name</Label>
                            <Input {...register("firstName")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" />
                        </div>
                        <div>
                            <Label className="text-emerald-900 dark:text-emerald-100">Last Name</Label>
                            <Input {...register("lastName")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" />
                        </div>
                    </div>
                    <div>
                        <Label className="text-emerald-900 dark:text-emerald-100">Email</Label>
                        <Input {...register("email")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" />
                    </div>
                    <div>
                        <Label className="text-emerald-900 dark:text-emerald-100">Phone</Label>
                        <Input {...register("phone")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" />
                    </div>
                    <div>
                        <Label className="text-emerald-900 dark:text-emerald-100">Address</Label>
                        <Textarea {...register("address")} rows="2" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700" />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11">
                        Save Changes
                    </Button>
                </form>
            </Modal>
        </div>
    );
}