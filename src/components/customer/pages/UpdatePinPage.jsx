import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

export default function UpdatePinPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ oldPin: '', newPin: '', confirmPin: '' });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPin !== formData.confirmPin) {
            setStatus({ type: 'error', msg: "New PINs don't match" });
            return;
        }

        try {
            setLoading(true);
            await api.put('/customer/pin/update', {
                oldPin: formData.oldPin,
                newPin: formData.newPin
            });
            setStatus({ type: 'success', msg: 'PIN Updated Successfully!' });
            setTimeout(() => navigate('/customer'), 1500);
        } catch (err) {
            setStatus({ type: 'error', msg: err.response?.data?.message || 'Update failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8 flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-xl border border-gray-700 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">Change Transaction PIN</h2>

                {status.msg && (
                    <div className={`p-3 rounded mb-4 ${status.type === 'success' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 mb-1">Old PIN</label>
                        <input
                            type="password" required
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                            onChange={(e) => setFormData({...formData, oldPin: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">New PIN</label>
                        <input
                            type="password" required minLength="4" maxLength="6"
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                            onChange={(e) => setFormData({...formData, newPin: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-1">Confirm New PIN</label>
                        <input
                            type="password" required
                            className="w-full bg-gray-800 border border-gray-600 rounded p-2 text-white"
                            onChange={(e) => setFormData({...formData, confirmPin: e.target.value})}
                        />
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-gray-700 text-white py-2 rounded hover:bg-gray-600">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-bold">
                            {loading ? 'Updating...' : 'Update PIN'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
