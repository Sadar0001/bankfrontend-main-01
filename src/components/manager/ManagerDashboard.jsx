import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import Modal from "../Modal";
import { Badge } from "@/components/ui/badge";
import {
    getBranchEarnings, getLoanStats, getBranchTransactions,
    getChargesByDate, getChargesLastMonth, getChargesLastYear
} from "../../services/manager-api-service";

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
        <Routes>
            <Route path="/" element={<DashboardHome navigate={navigate} user={user} />} />
            <Route path="/loans" element={<ManagerPendingLoans />} />
            <Route path="/customers" element={<ManagerCustomersPage />} />
            <Route path="/accounts" element={<ManagerAccountsPage />} />
            <Route path="/tellers" element={<ManagerTellersPage />} />
            <Route path="/analytics" element={<ManagerAnalyticsPage />} />
        </Routes>
    );
}

function DashboardHome({ navigate, user }) {
    const [modalData, setModalData] = useState(null);
    const [modalTitle, setModalTitle] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleAnalyticsClick = async (title, apiCall) => {
        setLoading(true);
        setModalTitle(title);
        setIsModalOpen(true);
        setModalData(null);
        try {
            const end = new Date().toISOString();
            const start = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString();
            const res = await apiCall(start, end);
            setModalData(res.data?.data || res.data);
        } catch (error) {
            console.error(error);
            setModalData(null);
        } finally {
            setLoading(false);
        }
    };

    const renderModalContent = () => {
        if (loading) return <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-b-4 border-emerald-600 rounded-full"></div></div>;
        if (!modalData) return <p className="text-center py-10 text-emerald-600 dark:text-emerald-400">No Data Available</p>;

        if (Array.isArray(modalData)) {
            if(modalData.length === 0) return <p className="text-center py-10 text-emerald-600 dark:text-emerald-400">No Records Found</p>;
            const headers = Object.keys(modalData[0]);
            return (
                <div className="overflow-x-auto border border-emerald-300 dark:border-emerald-700 rounded-lg">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 uppercase text-xs font-bold">
                        <tr>
                            {headers.map(key => (
                                <th key={key} className="p-4 whitespace-nowrap border-b border-emerald-300 dark:border-emerald-700">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800 bg-white dark:bg-emerald-950">
                        {modalData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/50">
                                {headers.map(key => (
                                    <td key={key} className="p-3 text-emerald-900 dark:text-emerald-100 whitespace-nowrap font-medium">
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

        return (
            <div className="grid grid-cols-1 divide-y divide-emerald-200 dark:divide-emerald-800 bg-white dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded-lg overflow-hidden">
                {Object.entries(modalData).map(([key, value]) => {
                    if (typeof value === 'object' && value !== null) return null;
                    return (
                        <div key={key} className="flex justify-between items-center p-4 hover:bg-emerald-50 dark:hover:bg-emerald-900/50 transition">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize text-sm">
                                {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-emerald-950 dark:text-emerald-50 font-bold text-lg">
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
        // SOLID WORKSPACE BOX: Emerald 200 (Light) / Emerald 800 (Dark)
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 pb-20 min-h-[85vh]">

            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-300 dark:border-emerald-700 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
                        Manager Dashboard
                    </h1>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-1 font-medium">
                        Branch Operations & Analytics
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Manager: {user?.username}
                    </Badge>
                </div>
            </header>

            <div className="space-y-12">
                <SectionRow title="Reports & Analytics">
                    <UniversalCard variant="gradient" icon="💰" mainText="Earnings" subText="Date Range Report" onClick={() => handleAnalyticsClick("Earnings Report", getBranchEarnings)} />
                    <UniversalCard variant="gradient" icon="📊" mainText="Loan Stats" subText="General Statistics" onClick={() => handleAnalyticsClick("Loan Statistics", (s, e) => getLoanStats())} />
                    <UniversalCard variant="gradient" icon="📝" mainText="Transactions" subText="Master Log" onClick={() => handleAnalyticsClick("Transactions Log", getBranchTransactions)} />
                </SectionRow>

                <SectionRow title="Charges Management">
                    <UniversalCard variant="default" icon="📅" mainText="Range Charges" subText="Custom Date" onClick={() => handleAnalyticsClick("Charges (Date Range)", getChargesByDate)} />
                    <UniversalCard variant="default" icon="🗓️" mainText="Last Month" subText="Charge Report" onClick={() => handleAnalyticsClick("Charges (Last Month)", (s,e) => getChargesLastMonth())} />
                    <UniversalCard variant="default" icon="📆" mainText="Last Year" subText="Charge Report" onClick={() => handleAnalyticsClick("Charges (Last Year)", (s,e) => getChargesLastYear())} />
                </SectionRow>

                <SectionRow title="Operations">
                    <UniversalCard variant="outline" icon="📂" mainText="Loan Apps" subText="Approve / Reject" onClick={() => navigate('/manager/loans')} />
                    <UniversalCard variant="default" icon="👥" mainText="Customers" subText="View & Manage" onClick={() => navigate('/manager/customers')} />
                    <UniversalCard variant="default" icon="💳" mainText="Accounts" subText="Freeze/Close Ops" onClick={() => navigate('/manager/accounts')} />
                    <UniversalCard variant="default" icon="🧑‍💼" mainText="Staff" subText="Manage Tellers" onClick={() => navigate('/manager/tellers')} />
                </SectionRow>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle}>
                <div className="min-h-[100px]">
                    {renderModalContent()}
                </div>
            </Modal>
        </div>
    );
}