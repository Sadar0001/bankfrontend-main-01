import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addBranchManager, getAllBranches } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, UserPlus } from "lucide-react";

export default function ManageManagersPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        getAllBranches().then(res => setBranches(res.data?.data || [])).catch(console.error);
    }, []);

    const onAdd = async (data) => {
        try {
            await addBranchManager(data);
            alert("Branch Manager Created Successfully!");
            setIsModalOpen(false);
            reset();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">

            <div className="flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={() => navigate('/headbank')} className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Branch Managers</h2>
                <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Manager
                </Button>
            </div>

            <Card className="bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-700 text-center py-12">
                <CardContent>
                    <div className="bg-emerald-100 dark:bg-emerald-950 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserPlus className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100">Manager Registry</h3>
                    <p className="text-emerald-600 dark:text-emerald-300 mt-2 max-w-md mx-auto">
                        View functionality is currently limited. Please use the <b>+ Add Manager</b> button above to register new staff members to the system.
                    </p>
                </CardContent>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Branch Manager">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input {...register("firstName")} placeholder="First Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        <Input {...register("lastName")} placeholder="Last Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    </div>

                    <Input {...register("username")} placeholder="Username" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <Input {...register("email")} type="email" placeholder="Email" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <Input {...register("phone")} placeholder="Phone" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <Input {...register("password")} type="password" placeholder="Password" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Assign to Branch</label>
                        <select {...register("branchId")} className="w-full p-2.5 rounded-md bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-sm" required>
                            <option value="">-- Select Branch --</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name} ({b.branchCode})</option>
                            ))}
                        </select>
                    </div>

                    <Button className="w-full bg-emerald-600 text-white font-bold mt-4">Register Manager</Button>
                </form>
            </Modal>
        </div>
    );
}