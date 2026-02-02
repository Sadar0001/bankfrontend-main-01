import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { addBranchManager, getAllBranches, deactivateBranchManager } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";

export default function ManageManagersPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [branches, setBranches] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Note: The provided Backend Controller doesn't have a "GetAllManagers" endpoint yet.
    // So for now, we will just allow Adding Managers.
    // If you add a "getManagers" endpoint later, you can list them here.

    useEffect(() => {
        // Load branches so we can assign a manager to a branch
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
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/headbank')} className="text-blue-400 mb-6">← Back</button>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Branch Managers</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-green-600 px-6 py-2 rounded font-bold hover:bg-green-700">
                    + Add Manager
                </button>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 text-center">
                <p className="text-gray-400 text-lg">
                    To view the list of existing managers, a backend update is required to expose the `GetAllManagers` endpoint.
                </p>
                <p className="text-gray-500 mt-2">
                    You can currently use the <b>+ Add Manager</b> button to register new staff.
                </p>
            </div>

            {/* ADD MANAGER MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Branch Manager">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4 text-gray-800">
                    <div className="grid grid-cols-2 gap-4">
                        <input {...register("firstName")} placeholder="First Name" className="w-full p-2 rounded" required />
                        <input {...register("lastName")} placeholder="Last Name" className="w-full p-2 rounded" required />
                    </div>

                    <input {...register("username")} placeholder="Username" className="w-full p-2 rounded" required />
                    <input {...register("email")} type="email" placeholder="Email" className="w-full p-2 rounded" required />
                    <input {...register("phone")} placeholder="Phone" className="w-full p-2 rounded" required />
                    <input {...register("password")} type="password" placeholder="Password" className="w-full p-2 rounded" required />

                    <div>
                        <label className="block text-sm text-gray-400 mb-1">Assign to Branch</label>
                        <select {...register("branchId")} className="w-full p-2 rounded" required>
                            <option value="">-- Select Branch --</option>
                            {branches.map(b => (
                                <option key={b.id} value={b.id}>{b.name} ({b.branchCode})</option>
                            ))}
                        </select>
                    </div>

                    <button className="w-full bg-green-600 text-white py-3 rounded font-bold mt-4">Register Manager</button>
                </form>
            </Modal>
        </div>
    );
}