import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import Modal from "../Modal";
import { Badge } from "@/components/ui/badge";
import {
    getHeadBankEarnings,
    getHeadBankChargesLastMonth,
    getHeadBankChargesLastYear,
} from "../../services/head-bank-api-service";

import ManageBranchesPage from "./pages/ManageBranchesPage";
import ManageManagersPage from "./pages/ManageManagersPage";
import ManageLoanOffersPage from "./pages/ManageLoanOffersPage";
import ManageCardRulesPage from "./pages/ManageCardRulesPage";

export default function HeadBankDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <Routes>
            <Route path="/" element={<DashboardHome navigate={navigate} user={user} />} />
            <Route path="/branches" element={<ManageBranchesPage />} />
            <Route path="/managers" element={<ManageManagersPage />} />
            <Route path="/loan-offers" element={<ManageLoanOffersPage />} />
            <Route path="/card-rules" element={<ManageCardRulesPage />} />
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
            const res = await apiCall();
            setModalData(res.data?.data || { Value: res.data?.data });
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
                        <tr>{headers.map(key => <th key={key} className="p-4 whitespace-nowrap border-b border-emerald-300 dark:border-emerald-700">{key}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-emerald-200 dark:divide-emerald-800 bg-white dark:bg-emerald-950">
                        {modalData.map((item, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50 dark:hover:bg-emerald-900/50">
                                {headers.map(key => <td key={key} className="p-3 text-emerald-900 dark:text-emerald-100 whitespace-nowrap font-medium">{String(item[key])}</td>)}
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
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize text-sm">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-emerald-950 dark:text-emerald-50 font-bold text-lg">
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
        // SOLID WORKSPACE BOX
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 pb-20 min-h-[85vh]">

            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-300 dark:border-emerald-700 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
                        Administration
                    </h1>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-2 font-medium">
                        Head Office Control Panel
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="default" className="text-sm py-1 px-3 bg-emerald-700 hover:bg-emerald-800 text-white border-0">
                        HEAD ADMIN: {user?.username}
                    </Badge>
                </div>
            </header>

            <div className="space-y-12">
                <SectionRow title="Network Management">
                    <UniversalCard variant="gradient" icon="🏢" mainText="Branches" subText="Add / Remove" onClick={() => navigate('/headbank/branches')} />
                    <UniversalCard variant="gradient" icon="🧑‍💼" mainText="Managers" subText="Assign Staff" onClick={() => navigate('/headbank/managers')} />
                </SectionRow>

                <SectionRow title="Product Management">
                    <UniversalCard variant="outline" icon="📝" mainText="Loan Offers" subText="Interest Rates" onClick={() => navigate('/headbank/loan-offers')} />
                    <UniversalCard variant="outline" icon="💳" mainText="Card Rules" subText="Limits & Fees" onClick={() => navigate('/headbank/card-rules')} />
                </SectionRow>

                <SectionRow title="Financial Reports">
                    <UniversalCard variant="default" icon="💰" mainText="Total Earnings" subText="Revenue Stream" onClick={() => handleAnalyticsClick("Total Earnings", getHeadBankEarnings)} />
                    <UniversalCard variant="default" icon="🗓️" mainText="Month Charges" subText="Last Month" onClick={() => handleAnalyticsClick("Last Month Charges", getHeadBankChargesLastMonth)} />
                    <UniversalCard variant="default" icon="📆" mainText="Annual Charges" subText="Last Year" onClick={() => handleAnalyticsClick("Last Year Charges", getHeadBankChargesLastYear)} />
                </SectionRow>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={modalTitle} size="xl">
                <div className="min-h-[100px] text-emerald-950 dark:text-emerald-50">{renderModalContent()}</div>
            </Modal>
        </div>
    );
}