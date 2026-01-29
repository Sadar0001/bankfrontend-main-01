import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

export default function LoanOffersPage() {
    const navigate = useNavigate();
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/customer/loans/offers')
            .then(res => setOffers(res.data.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading Offers...</div>;

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-6xl mx-auto">
                <button onClick={() => navigate('/customer')} className="text-blue-400 mb-6">← Back to Dashboard</button>
                <h1 className="text-3xl font-bold text-white mb-2">Exclusive Loan Offers</h1>
                <p className="text-gray-400 mb-8">Pre-approved offers curated just for you.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.length > 0 ? offers.map(offer => (
                        <div key={offer.id} className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 flex flex-col justify-between hover:border-blue-500 transition shadow-lg">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{offer.offerName}</h3>
                                <div className="text-3xl font-bold text-green-400 mb-4">{offer.interestRate}% <span className="text-sm text-gray-400 font-normal">p.a.</span></div>
                                <ul className="text-gray-400 text-sm space-y-2 mb-6">
                                    <li>• {offer.loanType} Loan</li>
                                    <li>• Up to ₹ {offer.maxAmount?.toLocaleString()}</li>
                                    <li>• Max Tenure: {offer.maxTenureMonths} Months</li>
                                </ul>
                            </div>
                            <button
                                onClick={() => navigate('/customer/loans/apply')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition"
                            >
                                Apply Now
                            </button>
                        </div>
                    )) : (
                        <div className="col-span-3 text-center text-gray-500 py-12">
                            No loan offers available at the moment.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
