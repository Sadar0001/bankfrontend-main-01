import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllBranches, addBranch, deactivateBranch } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";
import useAuthStore from "../../../store/authStore";

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
            // Need to pass headBankId from somewhere. Assuming user context has it or derived.
            // For now, prompt asking or hardcode if user object doesn't have it explicitly.
            // Ideally, the backend validates the token, but DTO needs the ID.
            // Let's assume we fetch user profile or pass '1' for test if context missing.
            
            // NOTE: In your controller logic:
            // if (!branchDTO.getHeadBankId().equals(details.getHeadBankId())) exception
            // So we MUST send the correct HeadBankID. 
            // In a real app, this ID comes from user profile.
            // For this UI, I'll add an input field for HeadBankID to be safe.
            
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
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/headbank')} className="text-blue-400 mb-6">← Back</button>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Manage Branches</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 px-6 py-2 rounded font-bold">+ Add Branch</button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map(b => (
                    <div key={b.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-bold text-xl">{b.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded ${b.isActive ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {b.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>
                        <p className="text-sm text-gray-400">Code: {b.branchCode}</p>
                        <p className="text-sm text-gray-400">IFSC: {b.ifscCode}</p>
                        <p className="text-sm text-gray-500 mt-2">{b.address}</p>
                        {b.isActive && (
                            <button onClick={() => onDelete(b.id)} className="mt-4 w-full border border-red-600 text-red-400 py-1 rounded hover:bg-red-900/20">
                                Deactivate
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ADD MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Branch">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4 text-gray-800">
                    <input {...register("name")} placeholder="Branch Name" className="w-full p-2 rounded" required />
                    <input {...register("branchCode")} placeholder="Branch Code (e.g. BR005)" className="w-full p-2 rounded" required />
                    <input {...register("ifscCode")} placeholder="IFSC Code" className="w-full p-2 rounded" required />
                    <input {...register("address")} placeholder="Address" className="w-full p-2 rounded" required />
                    <input {...register("contactNumber")} placeholder="Phone" className="w-full p-2 rounded" />
                    <input type="number" {...register("headBankId")} placeholder="Head Bank ID" className="w-full p-2 rounded" required />
                    <button className="w-full bg-green-600 text-white py-2 rounded font-bold">Create Branch</button>
                </form>
            </Modal>
        </div>
    );
}
