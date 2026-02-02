import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllCardRules, addCardRule, deactivateCardRule } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";

export default function ManageCardRulesPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [rules, setRules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Load Data
    const loadRules = () => {
        getAllCardRules()
            .then(res => setRules(res.data?.data || []))
            .catch(console.error);
    };

    useEffect(() => { loadRules(); }, []);

    // Add Rule Handler
    const onAdd = async (data) => {
        try {
            await addCardRule(data);
            alert("Card Rule Created Successfully!");
            setIsModalOpen(false);
            reset();
            loadRules();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || err.message));
        }
    };

    // Deactivate Handler
    const onDelete = async (id) => {
        if (!confirm("Are you sure you want to deactivate this rule?")) return;
        try {
            await deactivateCardRule(id);
            loadRules();
        } catch (err) {
            alert("Failed to deactivate rule");
        }
    };

    return (
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/headbank')} className="text-blue-400 mb-6 hover:underline">
                ← Back to Dashboard
            </button>
            
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Debit Card Rules</h2>
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="bg-purple-600 px-6 py-2 rounded font-bold hover:bg-purple-700 transition"
                >
                    + Create Rule
                </button>
            </div>

            {/* RULES GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map(rule => (
                    <div key={rule.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 relative shadow-lg">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-lg text-white">{rule.cardType}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded border ${
                                rule.isActive 
                                    ? 'bg-green-900/30 text-green-400 border-green-800' 
                                    : 'bg-red-900/30 text-red-400 border-red-800'
                            }`}>
                                {rule.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>

                        <div className="space-y-2 text-sm text-gray-300">
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span>Annual Fee:</span>
                                <span className="font-bold text-white">₹ {rule.annualFee}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span>Daily Withdraw Limit:</span>
                                <span className="text-white">₹ {rule.dailyWithdrawalLimit}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-700 pb-1">
                                <span>Daily Txn Limit:</span>
                                <span className="text-white">₹ {rule.dailyTransactionLimit}</span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span>International:</span>
                                <span className={rule.internationalUsage ? "text-green-400" : "text-gray-500"}>
                                    {rule.internationalUsage ? "Allowed" : "Not Allowed"}
                                </span>
                            </div>
                        </div>

                        {rule.isActive && (
                            <button 
                                onClick={() => onDelete(rule.id)} 
                                className="mt-6 w-full bg-red-600/10 text-red-400 border border-red-600/50 py-2 rounded hover:bg-red-600 hover:text-white transition"
                            >
                                Deactivate Rule
                            </button>
                        )}
                    </div>
                ))}
                
                {rules.length === 0 && (
                    <div className="col-span-full text-center py-10 text-gray-500">
                        No Debit Card Rules found. Create one to get started.
                    </div>
                )}
            </div>

            {/* CREATE RULE MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Define New Card Rule">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4 text-gray-800">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Card Type Name</label>
                        <input 
                            {...register("cardType")} 
                            placeholder="e.g. PLATINUM_PREMIUM" 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Annual Fee (₹)</label>
                            <input 
                                type="number" 
                                {...register("annualFee")} 
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Issuance Fee (₹)</label>
                            <input 
                                type="number" 
                                {...register("issuanceFee")} 
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Daily Withdraw Limit</label>
                            <input 
                                type="number" 
                                {...register("dailyWithdrawalLimit")} 
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                                required 
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Daily Purchase Limit</label>
                            <input 
                                type="number" 
                                {...register("dailyPurchaseLimit")} 
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Hardcoded Head Bank ID input (Ideally this comes from user context) */}
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Head Bank ID</label>
                        <input 
                            type="number" 
                            {...register("headBankId")} 
                            placeholder="1" 
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white" 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded mt-4"
                    >
                        Save Rule
                    </button>
                </form>
            </Modal>
        </div>
    );
}
