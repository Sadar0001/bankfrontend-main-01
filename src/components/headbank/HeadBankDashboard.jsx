import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import Modal from "../Modal";
import { 
    getHeadBankEarnings, 
    getHeadBankChargesLastMonth, 
    getHeadBankChargesLastYear, 
    getHeadBankChargesDateRange 
} from "../../services/head-bank-api-service";

// Sub-pages
import ManageBranchesPage from "./pages/ManageBranchesPage";
import ManageManagersPage from "./pages/ManageManagersPage";
import ManageLoanOffersPage from "./pages/ManageLoanOffersPage";
import ManageCardRulesPage from "./pages/ManageCardRulesPage";

export default function HeadBankDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <header className="px-8 py-10 bg-gradient-to-b from-indigo-900/20 to-transparent border-b border-gray-800 mb-6">
                <h1 className="text-3xl font-bold">Head Bank Administration</h1>
                <p className="text-gray-400 mt-1">Admin: {user?.username} (ID: {user?.userId})</p>
            </header>

            <Routes>
                <Route path="/" element={<DashboardHome navigate={navigate} />} />
                <Route path="/branches" element={<ManageBranchesPage />} />
                <Route path="/managers" element={<ManageManagersPage />} />
                <Route path="/loan-offers" element={<ManageLoanOffersPage />} />
                <Route path="/card-rules" element={<ManageCardRulesPage />} />
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

    // Generic Modal Handler
    const handleAnalyticsClick = async (title, apiCall) => {
        setLoading(true);
        setModalTitle(title);
        setIsModalOpen(true);
        setModalData(null);
        try {
            const res = await apiCall();
            // Handle generic response or direct BigDecimal response
            setModalData(res.data?.data || { Value: res.data?.data }); 
        } catch (error) {
            console.error(error);
            setModalData(null);
        } finally {
            setLoading(false);
        }
    };

    // Table/Object Renderer (Reused logic from Manager Dashboard)
    const renderModalContent = () => {
        if (loading) return <p className="text-center py-10 text-blue-400 animate-pulse">Fetching Data...</p>;
        if (!modalData) return <p className="text-center py-10 text-gray-500">No Data Available</p>;

        // If Array -> Table
        if (Array.isArray(modalData)) {
            if(modalData.length === 0) return <p className="text-center py-10 text-gray-500">No Records Found</p>;
            const headers = Object.keys(modalData[0]);
            return (
                <div className="overflow-x-auto max-h-[60vh] border border-gray-700 rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-800 text-gray-400 uppercase sticky top-0">
                            <tr>{headers.map(key => <th key={key} className="p-3 border-b border-gray-700 whitespace-nowrap">{key}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {modalData.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-800/50">
                                    {headers.map(key => <td key={key} className="p-3 text-gray-300 whitespace-nowrap">{String(item[key])}</td>)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            );
        }

        // If Object -> Key-Value List
        return (
            <div className="grid grid-cols-1 gap-0 bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
                {Object.entries(modalData).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) return null;
                    return (
                        <div key={key} className="flex justify-between items-center p-4 border-b border-gray-700 last:border-0">
                            <span className="text-gray-400 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-white font-bold text-lg">
                                {typeof value === 'number' && (key.toLowerCase().includes('earning') || key.toLowerCase().includes('amount')) 
                                    ? `₹ ${value.toLocaleString()}` : value}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* SECTION 1: NETWORK MANAGEMENT */}
            <SectionRow title="Network Management">
                <UniversalCard variant="gradient" icon="🏢" mainText="Branches" subText="Add / Remove"
                    onClick={() => navigate('/headbank/branches')} />
                <UniversalCard variant="gradient" icon="🧑‍💼" mainText="Managers" subText="Assign Staff"
                    onClick={() => navigate('/headbank/managers')} />
            </SectionRow>

            {/* SECTION 2: FINANCIAL PRODUCTS */}
            <SectionRow title="Product Management">
                <UniversalCard variant="outline" icon="📝" mainText="Loan Offers" subText="Interest Rates"
                    onClick={() => navigate('/headbank/loan-offers')} />
                <UniversalCard variant="outline" icon="💳" mainText="Card Rules" subText="Limits & Fees"
                    onClick={() => navigate('/headbank/card-rules')} />
            </SectionRow>

            {/* SECTION 3: ANALYTICS (MODALS) */}
            <SectionRow title="Analytics & Reports">
                <UniversalCard variant="default" icon="💰" mainText="Total Earnings" subText="Head Bank Revenue"
                    onClick={() => handleAnalyticsClick("Total Earnings", getHeadBankEarnings)} />
                <UniversalCard variant="default" icon="🗓️" mainText="Charges (Month)" subText="Last Month Report"
                    onClick={() => handleAnalyticsClick("Last Month Charges", getHeadBankChargesLastMonth)} />
                <UniversalCard variant="default" icon="📆" mainText="Charges (Year)" subText="Last Year Report"
                    onClick={() => handleAnalyticsClick("Last Year Charges", getHeadBankChargesLastYear)} />
            </SectionRow>

            {/* GENERIC ANALYTICS MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} size="xl">
                <div className="text-white min-h-[100px]">{renderModalContent()}</div>
            </Modal>
        </>
    );
}
