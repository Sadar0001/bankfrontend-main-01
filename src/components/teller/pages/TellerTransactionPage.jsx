import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { performTellerTransaction } from "../../../services/teller-api-service";
import useAuthStore from "../../../store/authStore";

export default function TellerTransactionPage() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user); // To get Branch ID if needed
    const { register, handleSubmit, watch, reset, setValue } = useForm({
        defaultValues: {
            transactionType: "DEPOSIT",
            bankType: "BANK_BRANCH",
            accountHolderType: "CUSTOMER",
            description: "Teller Transaction",
            // Assuming the teller's branch ID is known or user enters it.
            // Often backend extracts from token, but DTO asks for it.
            bankId: 1 // Defaulting to 1 for now, or fetch from user context
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Watch transaction type to toggle fields
    const txnType = watch("transactionType");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setStatus({ type: '', msg: '' });

        // Clean up data based on type
        const payload = { ...data };
        if (txnType === 'DEPOSIT') delete payload.senderAccountNumber;
        if (txnType === 'WITHDRAWAL') delete payload.receiverAccountNumber;

        try {
            await performTellerTransaction(payload);
            setStatus({ type: 'success', msg: `Transaction Successful!` });
            reset({ ...data, amount: "", senderAccountNumber: "", receiverAccountNumber: "" }); // Reset inputs but keep settings
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: err.response?.data?.message || "Transaction Failed" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 text-white min-h-screen flex flex-col items-center">
            <div className="w-full max-w-2xl">
                <button onClick={() => navigate('/teller')} className="text-blue-400 mb-6 hover:underline">
                    ← Back to Dashboard
                </button>

                <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-green-500">💸</span> Perform Transaction
                    </h2>

                    {status.msg && (
                        <div className={`p-4 rounded mb-6 text-center font-bold ${
                            status.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'
                        }`}>
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                        {/* Transaction Type Selector */}
                        <div className="grid grid-cols-3 gap-4">
                            {['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(type => (
                                <label key={type} className={`
                                    cursor-pointer text-center py-3 rounded-lg border transition-all font-bold
                                    ${txnType === type
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg scale-105'
                                    : 'bg-gray-800 border-gray-600 text-gray-400 hover:bg-gray-700'}
                                `}>
                                    <input
                                        type="radio"
                                        value={type}
                                        {...register("transactionType")}
                                        className="hidden"
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>

                        {/* Account Inputs */}
                        <div className="space-y-4 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                            {/* Sender Account (Hidden for DEPOSIT) */}
                            {txnType !== 'DEPOSIT' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">From Account (Sender)</label>
                                    <input
                                        {...register("senderAccountNumber", { required: txnType !== 'DEPOSIT' })}
                                        placeholder="e.g. ACC-1001"
                                        className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            {/* Receiver Account (Hidden for WITHDRAWAL) */}
                            {txnType !== 'WITHDRAWAL' && (
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">To Account (Receiver)</label>
                                    <input
                                        {...register("receiverAccountNumber", { required: txnType !== 'WITHDRAWAL' })}
                                        placeholder="e.g. ACC-2002"
                                        className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            )}

                            {/* Amount */}
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Amount (₹)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register("amount", { required: true, min: 1 })}
                                    placeholder="0.00"
                                    className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white text-xl font-mono focus:border-green-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Hidden Technical Fields */}
                        <input type="hidden" {...register("bankType")} />
                        <input type="hidden" {...register("bankId")} />
                        <input type="hidden" {...register("accountHolderType")} />

                        {/* Description */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Description (Optional)</label>
                            <input
                                {...register("description")}
                                placeholder="e.g. Cash Deposit by Self"
                                className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-lg shadow-lg transition transform active:scale-[0.98]"
                        >
                            {isLoading ? "Processing..." : `CONFIRM ${txnType}`}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}