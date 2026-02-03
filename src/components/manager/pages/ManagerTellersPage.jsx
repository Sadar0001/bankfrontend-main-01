import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getTellers, addTeller, deactivateTeller } from "../../../services/manager-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, UserPlus, Trash2 } from "lucide-react";

export default function ManagerTellersPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [tellers, setTellers] = useState([]);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [deleteTellerId, setDeleteTellerId] = useState(null);
    const [confirmText, setConfirmText] = useState("");

    const loadTellers = () => {
        getTellers().then(res => setTellers(res.data?.data || [])).catch(console.error);
    };

    useEffect(() => { loadTellers(); }, []);

    const onAddSubmit = async (data) => {
        try {
            await addTeller(data);
            alert("Teller Added!");
            setAddModalOpen(false);
            reset();
            loadTellers();
        } catch (err) { alert("Failed to add"); }
    };

    const handleDelete = async () => {
        if(confirmText !== "CONFIRM") return;
        try {
            await deactivateTeller(deleteTellerId);
            setDeleteTellerId(null);
            setConfirmText("");
            loadTellers();
        } catch(err) { alert("Error deleting"); }
    }

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">
            <Button variant="ghost" onClick={() => navigate('/manager')} className="mb-6 text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700 font-bold">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Teller Staff</h2>
                <Button onClick={() => setAddModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    <UserPlus className="mr-2 h-4 w-4"/> Add Teller
                </Button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {tellers.map(teller => (
                    <div key={teller.id} className="bg-white dark:bg-emerald-900 p-6 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-sm relative hover:shadow-md transition">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-xl text-emerald-900 dark:text-emerald-100">{teller.username}</h3>
                            <span className={`text-xs px-2 py-1 rounded font-bold ${teller.active ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                                {teller.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>
                        <p className="text-emerald-600 dark:text-emerald-400 font-medium">{teller.firstName} {teller.lastName}</p>
                        <p className="text-emerald-400 text-sm mt-1">ID: {teller.id}</p>

                        {teller.active && (
                            <Button onClick={() => setDeleteTellerId(teller.id)} variant="ghost" className="mt-4 w-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 font-bold h-9 text-xs">
                                <Trash2 className="mr-2 h-3 w-3" /> Deactivate
                            </Button>
                        )}
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Teller">
                <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input {...register("firstName")} placeholder="First Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" required />
                        <Input {...register("lastName")} placeholder="Last Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" required />
                    </div>
                    <Input {...register("username")} placeholder="Username" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" required />
                    <Input {...register("password")} type="password" placeholder="Password" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" required />
                    <Input type="number" {...register("branchId")} placeholder="Branch ID" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200" required />
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Create Teller</Button>
                </form>
            </Modal>

            <Modal isOpen={!!deleteTellerId} onClose={() => {setDeleteTellerId(null); setConfirmText("");}} title="Confirm Deactivation">
                <p className="text-emerald-800 dark:text-emerald-200 mb-4">Type <strong>CONFIRM</strong> to disable this teller account.</p>
                <Input value={confirmText} onChange={(e) => setConfirmText(e.target.value)} className="bg-emerald-50 dark:bg-emerald-900 border-red-300 mb-4" placeholder="CONFIRM" />
                <Button onClick={handleDelete} disabled={confirmText !== "CONFIRM"} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold">Deactivate</Button>
            </Modal>
        </div>
    );
}