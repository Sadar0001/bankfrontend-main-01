import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { requestChequeBook } from '../../../services/customer-api-service';

export default function RequestChequePage({ accounts, onSuccess }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { isSubmitting } } = useForm();
    const [status, setStatus] = useState({ type: '', msg: '' });

    const onSubmit = async (data) => {
        try {
            setStatus({ type: '', msg: '' });
            await requestChequeBook({
                accountId: Number(data.accountId),
                numberOfLeaves: Number(data.numberOfLeaves)
            });
            setStatus({ type: 'success', msg: 'Cheque Book requested successfully!' });
            if (onSuccess) onSuccess();
            setTimeout(() => navigate('/customer/requests'), 1500);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Request failed' });
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Request Cheque Book</h2>

                {status.msg && (
                    <div className={`p-3 rounded mb-4 ${status.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Select Account</label>
                        <select {...register('accountId', { required: true })} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white">
                            <option value="">-- Choose Account --</option>
                            {accounts?.map(acc => (
                                <option key={acc.id} value={acc.id}>{acc.accountNumber}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Number of Leaves</label>
                        <select {...register('numberOfLeaves', { required: true })} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white">
                            <option value="10">10 Leaves</option>
                            <option value="20">20 Leaves</option>
                            <option value="50">50 Leaves</option>
                            <option value="100">100 Leaves</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                            {isSubmitting ? 'Processing...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}