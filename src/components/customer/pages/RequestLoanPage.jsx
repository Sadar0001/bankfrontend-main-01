import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { applyLoan } from '../../../services/customer-api-service';

export default function RequestLoanPage({ onSuccess }) {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const [status, setStatus] = useState({ type: '', msg: '' });

    const onSubmit = async (data) => {
        try {
            setStatus({ type: '', msg: '' });
            await applyLoan({
                loanOfferId: Number(data.loanOfferId),
                requestedAmount: Number(data.requestedAmount),
                requestedTenure: Number(data.requestedTenure),
                purpose: data.purpose
            });
            setStatus({ type: 'success', msg: 'Loan Application Submitted!' });
            if (onSuccess) onSuccess();
            setTimeout(() => navigate('/customer/requests'), 2000);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Application failed' });
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 w-full max-w-lg">
                <h2 className="text-2xl font-bold text-white mb-2">Apply for a Loan</h2>
                <p className="text-gray-400 text-sm mb-6">Fill in the details below to process your application.</p>

                {status.msg && (
                    <div className={`p-3 rounded mb-4 ${status.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Ideally, this ID comes from the selected offer. For now, we input manually or assume '1' */}
                    <div>
                        <label className="block text-gray-400 mb-1">Loan Offer ID</label>
                        <input type="number" {...register('loanOfferId', { required: true })} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" placeholder="e.g. 1" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-1">Amount (₹)</label>
                            <input type="number" {...register('requestedAmount', { required: true })} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-1">Tenure (Months)</label>
                            <input type="number" {...register('requestedTenure', { required: true })} className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Purpose of Loan</label>
                        <textarea {...register('purpose', { required: true })} rows="3" className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white" placeholder="e.g. Home renovation, Education..."></textarea>
                    </div>

                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 font-bold mt-2">
                        {isSubmitting ? 'Submitting Application...' : 'Apply Now'}
                    </button>
                    <button type="button" onClick={() => navigate('/customer')} className="w-full text-gray-400 hover:text-white text-sm mt-2">Cancel</button>
                </form>
            </div>
        </div>
    );
}