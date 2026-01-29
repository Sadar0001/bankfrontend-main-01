import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { makeTransaction } from '../../../services/customer-api-service';

export default function MakeTransactionPage({ accounts }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    const onSubmit = async (data) => {
        try {
            setError(null);

            // 1. Find the selected account object to get its Number
            const selectedAccount = accounts.find(acc => acc.id === Number(data.fromAccountId));

            if (!selectedAccount) {
                setError("Invalid source account selected");
                return;
            }

            // 2. Map data to match Java TransactionDto EXACTLY
            const transactionData = {
                senderAccountNumber: selectedAccount.accountNumber, // Changed from fromAccountId
                receiverAccountNumber: data.toAccountNumber,        // Changed from toAccountNumber (name check)
                amount: Number(data.amount),
                transactionType: 'TRANSFER',
                description: data.remarks // Changed from remarks to match Java DTO
            };

            const response = await makeTransaction(transactionData);
            setSuccess(response.message || 'Transaction successful!');

            setTimeout(() => navigate('/customer'), 2000);
        } catch (err) {
            console.error("Tx Error:", err);
            setError(err.response?.data?.message || 'Transaction failed');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/customer')}
                    className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2"
                >
                    ← Back to Dashboard
                </button>

                <div className="bg-gray-900 rounded-xl border border-gray-700 p-8">
                    <h2 className="text-3xl font-bold text-white mb-6">Make Transaction</h2>

                    {success && (
                        <div className="bg-green-900/30 border border-green-700 text-green-400 p-4 rounded-lg mb-6">
                            ✓ {success}
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-lg mb-6">
                            ✗ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* From Account */}
                        <div>
                            <label className="block text-gray-300 mb-2">From Account *</label>
                            <select
                                {...register('fromAccountId', { required: 'Please select an account' })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                            >
                                <option value="">Select Account</option>
                                {accounts?.map(acc => (
                                    <option key={acc.id} value={acc.id}>
                                        {/* FIX: Changed .balance to .currentBalance */}
                                        {acc.accountNumber} - {acc.accountType} (₹{(acc.currentBalance || 0).toLocaleString('en-IN')})
                                    </option>
                                ))}
                            </select>
                            {errors.fromAccountId && (
                                <p className="text-red-400 text-sm mt-1">{errors.fromAccountId.message}</p>
                            )}
                        </div>

                        {/* To Account Number */}
                        <div>
                            <label className="block text-gray-300 mb-2">To Account Number *</label>
                            <input
                                type="text"
                                {...register('toAccountNumber', {
                                    required: 'Account number is required',
                                })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                                placeholder="Enter recipient account number"
                            />
                            {errors.toAccountNumber && (
                                <p className="text-red-400 text-sm mt-1">{errors.toAccountNumber.message}</p>
                            )}
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-gray-300 mb-2">Amount (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register('amount', {
                                    required: 'Amount is required',
                                    min: { value: 1, message: 'Minimum ₹1' }
                                })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                                placeholder="0.00"
                            />
                            {errors.amount && (
                                <p className="text-red-400 text-sm mt-1">{errors.amount.message}</p>
                            )}
                        </div>

                        {/* Remarks */}
                        <div>
                            <label className="block text-gray-300 mb-2">Remarks (Optional)</label>
                            <textarea
                                {...register('remarks')}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                                rows="3"
                                placeholder="Add a note..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            {isSubmitting ? 'Processing...' : 'Transfer Money'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}