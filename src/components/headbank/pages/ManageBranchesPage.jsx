import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllBranches, addBranch, deactivateBranch } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";
import useAuthStore from "../../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Building2, MapPin, Phone } from "lucide-react";

export default function ManageBranchesPage() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { register, handleSubmit, reset } = useForm();
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadBranches = () => {
        getAllBranches().then(res => setBranches(res.data?.data || [])).catch(console.error);
    };

    useEffect(() => { loadBranches(); }, []);

    const onAdd = async (data) => {
        try {
            await addBranch(data);
            alert("Branch Added!");
            setIsModalOpen(false);
            reset();
            loadBranches();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const onDelete = async (id) => {
        if(!confirm("Deactivate this branch?")) return;
        try {
            await deactivateBranch(id);
            alert("Branch Deactivated");
            loadBranches();
        } catch (err) {
            alert("Failed to deactivate");
        }
    }

    return (
        // LAYER 2: WORKSPACE BOX (Solid Emerald 200/800)
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">

            <div className="flex items-center justify-between mb-8">
                <Button variant="ghost" onClick={() => navigate('/headbank')} className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Manage Branches</h2>
                <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-none">
                    <Plus className="mr-2 h-4 w-4" /> Add Branch
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(b => (
                    // LAYER 3: CONTENT CARDS (Solid White / Emerald 900)
                    <Card key={b.id} className="bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-700 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="pb-3">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-emerald-500" />
                                    {b.name}
                                </CardTitle>
                                <Badge className={b.isActive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-800 dark:text-emerald-200 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}>
                                    {b.isActive ? "ACTIVE" : "INACTIVE"}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm text-emerald-700 dark:text-emerald-300">
                            <div className="flex justify-between border-b border-emerald-50 dark:border-emerald-800 pb-2">
                                <span>Code:</span> <span className="font-mono font-bold">{b.branchCode}</span>
                            </div>
                            <div className="flex justify-between border-b border-emerald-50 dark:border-emerald-800 pb-2">
                                <span>IFSC:</span> <span className="font-mono font-bold">{b.ifscCode}</span>
                            </div>
                            <div className="flex items-start gap-2 pt-1">
                                <MapPin className="h-4 w-4 shrink-0 opacity-70" />
                                <span className="line-clamp-2">{b.address}</span>
                            </div>
                            {b.contactNumber && (
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 shrink-0 opacity-70" />
                                    <span>{b.contactNumber}</span>
                                </div>
                            )}
                        </CardContent>
                        {b.isActive && (
                            <CardFooter>
                                <Button
                                    onClick={() => onDelete(b.id)}
                                    variant="outline"
                                    className="w-full border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950"
                                >
                                    Deactivate Branch
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Branch">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
                    <Input {...register("name")} placeholder="Branch Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <div className="grid grid-cols-2 gap-4">
                        <Input {...register("branchCode")} placeholder="Code (e.g. BR005)" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        <Input {...register("ifscCode")} placeholder="IFSC Code" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    </div>
                    <Input {...register("address")} placeholder="Full Address" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <Input {...register("contactNumber")} placeholder="Contact Number" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" />
                    <Input type="number" {...register("headBankId")} placeholder="Head Bank ID" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />

                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                        Create Branch
                    </Button>
                </form>
            </Modal>
        </div>
    );
}