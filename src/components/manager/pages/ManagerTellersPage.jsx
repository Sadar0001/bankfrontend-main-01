import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getTellers, addTeller, deactivateTeller } from "../../../services/manager-api-service";
import Modal from "../../Modal";

export default function ManagerTellersPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [tellers, setTellers] = useState([]);

    // Modal States
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [deleteTellerId, setDeleteTellerId] = useState(null);
    const [confirmText, setConfirmText] = useState("");

    const loadTellers = () => {
        getTellers().then(res => {
            // ✅ FIX: Extract inner data array
            const list = res.data?.data || [];
            setTellers(list);
        }).catch(console.error);
    };

    useEffect(() => { loadTellers(); }, []);

    const onAddSubmit = async (data) => {
        try {
            await addTeller(data);
            alert("Teller Added!");
            setAddModalOpen(false);
            reset();
            loadTellers();
        } catch (err) {
            alert("Failed to add teller");
        }
    };

    const handleDelete = async () => {
        if(confirmText !== "CONFIRM") return;
        try {
            await deactivateTeller(deleteTellerId);
            setDeleteTellerId(null);
            setConfirmText("");
            loadTellers();
        } catch(err) {
            alert("Error deleting teller");
        }
    }

    return (
        <div className="p-8 text-white">
            <button onClick={() => navigate('/manager')} className="text-blue-400 mb-6">← Back</button>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Teller Management</h2>
                <button onClick={() => setAddModalOpen(true)} className="bg-blue-600 px-6 py-2 rounded font-bold hover:bg-blue-700">
                    + Add New Teller
                </button>
            </div>

            {/* CARDS GRID */}
            <div className="grid md:grid-cols-3 gap-6">
                {tellers.map(teller => (
                    <div key={teller.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg relative group">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-xl">{teller.username}</h3>
                            <span className={`text-xs px-2 py-1 rounded ${teller.active ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
                                {teller.active ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>
                        <p className="text-gray-400 mt-2">{teller.firstName} {teller.lastName}</p>
                        <p className="text-gray-500 text-sm">ID: {teller.id}</p>

                        {teller.active && (
                            <button
                                onClick={() => setDeleteTellerId(teller.id)}
                                className="mt-4 w-full bg-red-600/20 text-red-400 border border-red-600 py-2 rounded hover:bg-red-600 hover:text-white transition"
                            >
                                Deactivate
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ADD TELLER MODAL */}
            <Modal isOpen={isAddModalOpen} onClose={() => setAddModalOpen(false)} title="Add New Teller">
                <form onSubmit={handleSubmit(onAddSubmit)} className="space-y-4 text-gray-800">
                    <input {...register("firstName")} placeholder="First Name" className="w-full p-2 border rounded" required />
                    <input {...register("lastName")} placeholder="Last Name" className="w-full p-2 border rounded" required />
                    <input {...register("username")} placeholder="Username" className="w-full p-2 border rounded" required />
                    <input {...register("password")} type="password" placeholder="Password" className="w-full p-2 border rounded" required />
                    <input type="number" {...register("branchId")} placeholder="Branch ID" className="w-full p-2 border rounded" required />
                    <button type="submit" className="w-full bg-green-600 text-white py-3 rounded font-bold">Create Teller</button>
                </form>
            </Modal>

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={!!deleteTellerId} onClose={() => {setDeleteTellerId(null); setConfirmText("");}} title="Confirm Deactivation">
                <p className="text-red-400 mb-4">To prevent mistakes, please type <strong>CONFIRM</strong> to deactivate this teller.</p>
                <input
                    type="text"
                    className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white mb-4"
                    placeholder="Type CONFIRM here"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                />
                <button
                    onClick={handleDelete}
                    disabled={confirmText !== "CONFIRM"}
                    className="w-full bg-red-600 disabled:bg-gray-700 text-white py-2 rounded font-bold"
                >
                    Deactivate Teller
                </button>
            </Modal>
        </div>
    );
}