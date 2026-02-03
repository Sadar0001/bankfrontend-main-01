import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getCustomerDashboardData } from "../../services/api.js";
import SectionRow from "./SectionRow";
import UniversalCard from "./UniversalCard";
import { Loader2 } from "lucide-react";

// Sub-Pages
import AccountDetailsPage from "./pages/AccountDetailsPage";
import MakeTransactionPage from "./pages/MakeTransactionPage";
import RequestAccountPage from "./pages/RequestAccountPage";
import RequestCardPage from "./pages/RequestCardPage";
import RequestLoanPage from "./pages/RequestLoanPage";
import RequestChequePage from "./pages/RequestChequePage";
import ViewRequestsPage from "./pages/ViewRequestsPage";
import CardManagementPage from "./pages/CardManagementPage";
import UpdatePinPage from "./pages/UpdatePinPage";
import LoanOffersPage from "./pages/LoanOffersPage";

export default function CustomerDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);
    const [data, setData] = useState({ accounts: [], cards: [], loans: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getCustomerDashboardData().then(res => setData(res)).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="w-full h-[60vh] flex flex-col items-center justify-center text-emerald-600">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="font-bold">Syncing Data...</p>
        </div>
    );

    return (
        <Routes>
            <Route path="/" element={<DashboardHome data={data} user={user} navigate={navigate} />} />
            <Route path="/transfer" element={<MakeTransactionPage accounts={data.accounts} />} />
            <Route path="/requests" element={<ViewRequestsPage />} />
            <Route path="/update-pin" element={<UpdatePinPage />} />
            <Route path="/request-account" element={<RequestAccountPage />} />
            <Route path="/account/:accountId" element={<AccountDetailsPage />} />
            <Route path="/cards/request" element={<RequestCardPage accounts={data.accounts} />} />
            <Route path="/cards" element={<CardManagementPage cards={data.cards} />} />
            <Route path="/loans" element={<LoanOffersPage />} />
            <Route path="/loans/apply" element={<RequestLoanPage />} />
            <Route path="/request-cheque" element={<RequestChequePage accounts={data.accounts} />} />
        </Routes>
    );
}

function DashboardHome({ data, user, navigate }) {
    return (
        // SOLID WORKSPACE BOX: Emerald 200 (Light) / Emerald 800 (Dark)
        // No Opacity. Pure solid color block.
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-sm p-6 md:p-10 pb-20 min-h-[85vh]">

            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-300 dark:border-emerald-700 pb-6">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-emerald-950 dark:text-emerald-50">
                        Overview
                    </h1>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-2 text-lg font-medium">
                        Welcome back, <span className="text-emerald-900 dark:text-emerald-100 font-bold">{user?.username}</span>.
                    </p>
                </div>
                <div className="text-right hidden md:block">
                    <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-900 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
                        ID: {user?.userId}
                    </span>
                </div>
            </header>

            <div className="space-y-12">
                <SectionRow title="Quick Actions">
                    <UniversalCard variant="gradient" icon="💸" mainText="Transfer" subText="Send funds" onClick={() => navigate('/customer/transfer')} />
                    <UniversalCard variant="default" icon="📋" mainText="History" subText="Track requests" onClick={() => navigate('/customer/requests')} />
                    <UniversalCard variant="default" icon="🔐" mainText="Security" subText="Update PIN" onClick={() => navigate('/customer/update-pin')} />
                </SectionRow>

                <SectionRow title="Accounts">
                    <UniversalCard variant="outline" icon="+" mainText="New Account" subText="Savings/Current" onClick={() => navigate('/customer/request-account')} />
                    {data.accounts?.map(acc => (
                        <UniversalCard
                            key={acc.id}
                            variant="gradient"
                            title={acc.accountType}
                            badge={acc.status}
                            mainText={`₹ ${(acc.availableBalance || 0).toLocaleString('en-IN')}`}
                            subText={acc.accountNumber}
                            footerLeft="View Details"
                            onClick={() => navigate(`/customer/account/${acc.id}`)}
                        />
                    ))}
                </SectionRow>

                <SectionRow title="Services">
                    <UniversalCard variant="default" icon="💳" mainText="Debit Cards" subText="Manage cards" onClick={() => navigate('/customer/cards')} />
                    <UniversalCard variant="default" icon="💰" mainText="Loans" subText="Apply & View" onClick={() => navigate('/customer/loans')} />
                    <UniversalCard variant="default" icon="📓" mainText="Cheque Book" subText="Request new" onClick={() => navigate('/customer/request-cheque')} />
                </SectionRow>
            </div>
        </div>
    );
}