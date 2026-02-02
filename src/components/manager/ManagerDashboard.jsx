import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import Modal from "../Modal";
import { getBranchEarnings, getLoanStats, getBranchTransactions, getChargesByDate, getChargesLastMonth, getChargesLastYear } from "../../services/manager-api-service";

// Sub-pages
import ManagerPendingLoans from "./pages/ManagerPendingLoans";
import ManagerTellersPage from "./pages/ManagerTellersPage";
import ManagerCustomersPage from "./pages/ManagerCustomersPage";
import ManagerAccountsPage from "./pages/ManagerAccountsPage";
import ManagerAnalyticsPage from "./pages/ManagerAnalyticsPage";

export default function ManagerDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            <header className="px-8 py-10 bg-gradient-to-b from-purple-900/20 to-transparent border-b border-gray-800 mb-6">
                <h1 className="text-3xl font-bold">Branch Manager Dashboard</h1>
                <p className="text-gray-400 mt-1">ID: {user?.userId} | {user?.username}</p>
            </header>

            <Routes>
                <Route path="/" element={<DashboardHome navigate={navigate} />} />
                <Route path="/loans" element={<ManagerPendingLoans />} />
                <Route path="/customers" element={<ManagerCustomersPage />} />
                <Route path="/accounts" element={<ManagerAccountsPage />} />
                <Route path="/tellers" element={<ManagerTellersPage />} />
                <Route path="/analytics" element={<ManagerAnalyticsPage />} />
            </Routes>
        </div>
    );
}

// ================= INTERNAL DASHBOARD COMPONENT =================
function DashboardHome({ navigate }) {
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Helper to fetch and show modal
    const handleAnalyticsClick = async (title, apiCall) => {
        setLoading(true);
        setModalTitle(title);
        setIsModalOpen(true);
        setModalData(null);
        try {
            // Default date range: Last 30 days
            const end = new Date().toISOString();
            const start = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();

            const res = await apiCall(start, end);

            // ✅ CRITICAL FIX: Extract the inner .data from the API Response
            // If res.data.data exists, use it. Otherwise use res.data (fallback)
            setModalData(res.data?.data || res.data);

        } catch (error) {
            console.error(error);
            setModalData(null);
        } finally {
            setLoading(false);
        }
    };

    // ✅ NEW: Smart Renderer to make data look like a proper Table or Grid
    const renderModalContent = () => {
        if (loading) return <p className="text-center py-10 text-blue-400 animate-pulse">Fetching Data...</p>;
        if (!modalData) return <p className="text-center py-10 text-gray-500">No Data Available</p>;

        // CASE 1: It is a LIST (Transaction Logs, Charge Lists)
        if (Array.isArray(modalData)) {
            if(modalData.length === 0) return <p className="text-center py-10 text-gray-500">No Records Found</p>;

            // Dynamically grab headers from the first item
            const headers = Object.keys(modalData[0]);

            return (
                <div className="overflow-x-auto max-h-[60vh] border border-gray-700 rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-800 text-gray-400 uppercase sticky top-0">
                        <tr>
                            {headers.map(key => (
                                <th key={key} className="p-3 border-b border-gray-700 whitespace-nowrap">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                        {modalData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-800/50">
                                {headers.map(key => (
                                    <td key={key} className="p-3 text-gray-300 whitespace-nowrap">
                                        {/* Format values nicely */}
                                        {(typeof item[key] === 'number' && (key.toLowerCase().includes('amount') || key.toLowerCase().includes('fee')))
                                            ? `₹ ${item[key].toLocaleString()}`
                                            : (typeof item[key] === 'object' ? '-' : item[key])}
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // CASE 2: It is an OBJECT (Earnings Map, Loan Stats)
        return (
            <div className="grid grid-cols-1 gap-0 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                {Object.entries(modalData).map(([key, value]) => {
                    // Skip nested objects (like IDs or relationships) if they look messy
                    if (typeof value === 'object' && value !== null) return null;

                    return (
                        <div key={key} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700/50 transition">
                            <span className="text-gray-400 font-medium capitalize">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-white font-bold text-lg">
                                {/* Format Currency if key implies money */}
                                {typeof value === 'number' && (key.toLowerCase().includes('earnings') || key.toLowerCase().includes('amount'))
                                    ? `₹ ${value.toLocaleString()}`
                                    : value}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* SECTION 1: REPORTS & ANALYTICS (Modals) */}
            <SectionRow title="Section 1: Reports & Analytics">
                <UniversalCard variant="gradient" icon="💰" mainText="Earnings" subText="Date Range Report"
                               onClick={() => handleAnalyticsClick("Earnings Report", getBranchEarnings)} />
                <UniversalCard variant="gradient" icon="📊" mainText="Loan Stats" subText="General Statistics"
                               onClick={() => handleAnalyticsClick("Loan Statistics", (s, e) => getLoanStats())} />
                <UniversalCard variant="gradient" icon="📝" mainText="Transactions" subText="Master Log"
                               onClick={() => handleAnalyticsClick("Transactions Log", getBranchTransactions)} />
            </SectionRow>

            {/* SECTION 2: CHARGES MANAGEMENT (Modals) */}
            <SectionRow title="Section 2: Charges Management">
                <UniversalCard variant="default" icon="📅" mainText="Range Charges" subText="Custom Date"
                               onClick={() => handleAnalyticsClick("Charges (Date Range)", getChargesByDate)} />
                <UniversalCard variant="default" icon="🗓️" mainText="Last Month" subText="Charge Report"
                               onClick={() => handleAnalyticsClick("Charges (Last Month)", (s,e) => getChargesLastMonth())} />
                <UniversalCard variant="default" icon="📆" mainText="Last Year" subText="Charge Report"
                               onClick={() => handleAnalyticsClick("Charges (Last Year)", (s,e) => getChargesLastYear())} />
            </SectionRow>

            {/* SECTION 3: LOANS (Page) */}
            <SectionRow title="Section 3: Loan Management">
                <UniversalCard variant="outline" icon="📂" mainText="Loan Applications" subText="Approve / Reject"
                               onClick={() => navigate('/manager/loans')} />
            </SectionRow>

            {/* SECTION 4: CUSTOMERS & ACCOUNTS (Pages) */}
            <SectionRow title="Section 4: Account & Customer">
                <UniversalCard variant="default" icon="👥" mainText="All Customers" subText="View & Manage"
                               onClick={() => navigate('/manager/customers')} />
                <UniversalCard variant="default" icon="💳" mainText="All Accounts" subText="Freeze/Close Ops"
                               onClick={() => navigate('/manager/accounts')} />
            </SectionRow>

            {/* SECTION 5: TELLERS (Page) */}
            <SectionRow title="Section 5: Teller Management">
                <UniversalCard variant="default" icon="🧑‍💼" mainText="Manage Tellers" subText="Add / Remove"
                               onClick={() => navigate('/manager/tellers')} />
            </SectionRow>

            {/* --- GENERIC ANALYTICS MODAL --- */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
                <div className="text-white min-h-[100px]">
                    {renderModalContent()}
                </div>
            </Modal>
        </>
    );
}