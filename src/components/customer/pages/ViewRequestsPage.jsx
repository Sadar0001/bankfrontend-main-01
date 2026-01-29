import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCustomerRequestsData } from '../../../services/customer-api-service';

export default function ViewRequestsPage() {
    const navigate = useNavigate();
    const [requests, setRequests] = useState({ accountRequests: [], cardRequests: [], chequeRequests: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getCustomerRequestsData();
                setRequests(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#121212] text-white flex items-center justify-center">Loading Status...</div>;

    const RequestCard = ({ title, status, sub, date }) => (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 flex justify-between items-center mb-3">
            <div>
                <p className="font-bold text-white">{title}</p>
                <p className="text-xs text-gray-400">{sub}</p>
                <p className="text-[10px] text-gray-500 mt-1">{new Date(date).toLocaleDateString()}</p>
            </div>
            <span className={`text-xs px-2 py-1 rounded font-bold border ${
                status === 'APPROVED' ? 'bg-green-900/30 text-green-400 border-green-800' :
                    status === 'REJECTED' ? 'bg-red-900/30 text-red-400 border-red-800' :
                        'bg-yellow-900/30 text-yellow-400 border-yellow-800'
            }`}>
                {status}
            </span>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/customer')} className="text-blue-400 mb-6">← Back to Dashboard</button>
                <h1 className="text-3xl font-bold text-white mb-8">My Request Status</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Column 1 */}
                    <div>
                        <h3 className="text-xl text-blue-400 font-bold mb-4 border-b border-gray-700 pb-2">Account Requests</h3>
                        {requests.accountRequests.length > 0 ? requests.accountRequests.map(r => (
                            <RequestCard key={r.id} title={`${r.accountType} Account`} status={r.status} sub={`Branch ID: ${r.branchId}`} date={r.createdAt} />
                        )) : <p className="text-gray-500 italic">No account requests.</p>}
                    </div>

                    {/* Column 2 */}
                    <div>
                        <h3 className="text-xl text-blue-400 font-bold mb-4 border-b border-gray-700 pb-2">Service Requests</h3>

                        {/* Cards */}
                        {requests.cardRequests.map(r => (
                            <RequestCard key={`c-${r.id}`} title={`Debit Card (${r.cardType})`} status={r.status} sub="New Card Request" date={r.createdAt} />
                        ))}

                        {/* Chequebooks */}
                        {requests.chequeRequests.map(r => (
                            <RequestCard key={`q-${r.id}`} title="Cheque Book" status={r.status} sub={`${r.numberOfLeaves} Leaves`} date={r.createdAt} />
                        ))}

                        {requests.cardRequests.length === 0 && requests.chequeRequests.length === 0 && (
                            <p className="text-gray-500 italic">No service requests.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
