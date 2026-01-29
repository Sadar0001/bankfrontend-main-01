import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/authStore';
import { requestNewAccount } from '../../../services/customer-api-service';

export default function RequestAccountPage({ onSuccess }) {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(null);

    // TODO: Replace with actual API call to get branches/banks
    const accountTypes = ['SAVINGS', 'CURRENT', 'SALARY', 'FIXED_DEPOSIT'];
    const branches = [1, 2, 3, 4, 5]; // Replace with actual branch IDs
    const headBanks = [1, 2, 3]; // Replace with actual head bank IDs

    const onSubmit = async (data) => {
        try {
            setError(null);

            const requestData = {
                customerId: user.userId,
                accountType: data.accountType,
                headBankId: Number(data.headBankId),
                branchId: Number(data.branchId)
            };

            const response = await requestNewAccount(requestData);
            setSuccess('Account request submitted successfully!');

            if (onSuccess) onSuccess();
            setTimeout(() => navigate('/customer'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request');
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => navigate('/customer')}
                    className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2"
                >
                    ← Back
                </button>

                <div className="bg-gray-900 rounded-xl border border-gray-700 p-8">
                    <h2 className="text-3xl font-bold text-white mb-6">Request New Account</h2>

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
                        <div>
                            <label className="block text-gray-300 mb-2">Account Type *</label>
                            <select
                                {...register('accountType', { required: 'Account type is required' })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                            >
                                <option value="">Select Type</option>
                                {accountTypes.map(type => (
                                    <option key={type} value={type}>{type.replace('_', ' ')}</option>
                                ))}
                            </select>
                            {errors.accountType && (
                                <p className="text-red-400 text-sm mt-1">{errors.accountType.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Head Bank *</label>
                            <select
                                {...register('headBankId', { required: 'Head bank is required' })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                            >
                                <option value="">Select Head Bank</option>
                                {headBanks.map(id => (
                                    <option key={id} value={id}>Head Bank {id}</option>
                                ))}
                            </select>
                            {errors.headBankId && (
                                <p className="text-red-400 text-sm mt-1">{errors.headBankId.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-gray-300 mb-2">Branch *</label>
                            <select
                                {...register('branchId', { required: 'Branch is required' })}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                            >
                                <option value="">Select Branch</option>
                                {branches.map(id => (
                                    <option key={id} value={id}>Branch {id}</option>
                                ))}
                            </select>
                            {errors.branchId && (
                                <p className="text-red-400 text-sm mt-1">{errors.branchId.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}