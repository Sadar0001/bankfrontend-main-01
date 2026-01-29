import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import { getCustomerDashboardData } from "../../services/api.js";
import { getCustomerRequestsData } from "../../services/customer-api-service.js"; // Import from new file
import SectionRow from "./SectionRow";
import UniversalCard from "./UniversalCard";

// Import Sub-Pages
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
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            console.log("🔍 Loading dashboard data...");
            setLoading(true);
            const dashboardData = await getCustomerDashboardData();
            console.log("✅ Dashboard data loaded:", dashboardData);
            setData(dashboardData);
            setError(null);
        } catch (err) {
            console.error("❌ Dashboard Error:", err);
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="text-white mt-4">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-400 text-xl mb-4">{error}</p>
                    <button
                        onClick={loadDashboardData}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Main Dashboard */}
            <Route path="/" element={<DashboardHome data={data} user={user} navigate={navigate} refresh={loadDashboardData} />} />

            {/* Account Pages */}
            <Route path="/account/:accountId" element={<AccountDetailsPage />} />
            <Route path="/request-account" element={<RequestAccountPage onSuccess={loadDashboardData} />} />

            {/* Transaction Pages */}
            <Route path="/transfer" element={<MakeTransactionPage accounts={data.accounts} />} />

            {/* Card Pages */}
            <Route path="/cards" element={<CardManagementPage cards={data.cards} refresh={loadDashboardData} />} />
            <Route path="/cards/request" element={<RequestCardPage accounts={data.accounts} onSuccess={loadDashboardData} />} />

            {/* Loan Pages */}
            <Route path="/loans" element={<LoanOffersPage />} />
            <Route path="/loans/apply" element={<RequestLoanPage onSuccess={loadDashboardData} />} />

            {/* Request Pages */}
            <Route path="/requests" element={<ViewRequestsPage />} />
            <Route path="/request-cheque" element={<RequestChequePage accounts={data.accounts} onSuccess={loadDashboardData} />} />

            {/* Settings */}
            <Route path="/update-pin" element={<UpdatePinPage />} />
        </Routes>
    );
}

// ==================== DASHBOARD HOME ====================
function DashboardHome({ data, user, navigate, refresh }) {
    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            {/* HERO HEADER */}
            <header className="px-8 py-10 bg-gradient-to-b from-blue-900/20 to-transparent">
                <h1 className="text-3xl font-bold">Hello, {user?.username} 👋</h1>
                <p className="text-gray-400 mt-1">Here is your financial overview</p>
            </header>

            {/* SECTION 0: QUICK ACTIONS */}
            <SectionRow title="Quick Actions">
                <UniversalCard
                    variant="gradient"
                    icon="💸"
                    mainText="Transfer Money"
                    subText="Send money instantly"
                    onClick={() => navigate('/customer/transfer')}
                />
                <UniversalCard
                    variant="default"
                    icon="📋"
                    mainText="View Requests"
                    subText="Track applications"
                    onClick={() => navigate('/customer/requests')}
                />
                <UniversalCard
                    variant="default"
                    icon="🔐"
                    mainText="Update PIN"
                    subText="Change security PIN"
                    onClick={() => navigate('/customer/update-pin')}
                />
            </SectionRow>

            {/* SECTION 1: ACCOUNTS */}
            <SectionRow title="My Accounts">
                <UniversalCard
                    variant="outline"
                    icon="+"
                    mainText="Request Account"
                    onClick={() => navigate('/customer/request-account')}
                />

                {data.accounts && data.accounts.length > 0 ? (
                    data.accounts.map(acc => (
                        <UniversalCard
                            key={acc.id}
                            variant="gradient"
                            title={acc.accountType}
                            badge={acc.status}
                            mainText={`₹ ${(acc.availableBalance || 0).toLocaleString('en-IN')}`}
                            subText={acc.accountNumber}
                            footerLeft="View Details →"
                            onClick={() => navigate(`/customer/account/${acc.id}`)}
                        />
                    ))
                ) : (
                    <UniversalCard
                        variant="default"
                        mainText="No Accounts"
                        subText="Request one to get started"
                    />
                )}
            </SectionRow>

            {/* SECTION 2: CARDS */}
            <SectionRow title="My Debit Cards">
                <UniversalCard
                    variant="outline"
                    icon="💳"
                    mainText="Request Card"
                    onClick={() => navigate('/customer/cards/request')}
                />

                {data.cards && data.cards.length > 0 ? (
                    data.cards.map(card => (
                        <UniversalCard
                            key={card.id}
                            variant="default"
                            title="DEBIT CARD"
                            badge={card.isBlocked ? "BLOCKED" : (card.isActive ? "ACTIVE" : "INACTIVE")}
                            mainText={`•••• ${card.cardNumber?.slice(-4) || '****'}`}
                            subText={user?.username}
                            footerRight={card.expiryDate ? new Date(card.expiryDate).toLocaleDateString('en-IN', { month: '2-digit', year: '2-digit' }) : 'N/A'}
                            onClick={() => navigate('/customer/cards')}
                        />
                    ))
                ) : (
                    <UniversalCard
                        variant="default"
                        mainText="No Cards"
                        subText="Request one for your account"
                    />
                )}
            </SectionRow>

            {/* SECTION 3: LOANS */}
            <SectionRow title="Loans & Credit">
                <UniversalCard
                    variant="outline"
                    icon="💰"
                    mainText="View Offers"
                    subText="Check eligibility"
                    onClick={() => navigate('/customer/loans')}
                />

                {data.loans && data.loans.length > 0 ? (
                    data.loans.map(loan => (
                        <UniversalCard
                            key={loan.id}
                            variant="default"
                            title="LOAN"
                            badge={loan.status}
                            mainText={`₹ ${(loan.requestedAmount || 0).toLocaleString('en-IN')}`}
                            subText={`${loan.requestedTenureMonths} months`}
                            footerLeft={loan.purpose?.substring(0, 20) + '...'}
                        />
                    ))
                ) : (
                    <UniversalCard
                        variant="default"
                        mainText="No Active Loans"
                        subText="Explore offers"
                    />
                )}
            </SectionRow>

            {/* SECTION 4: REQUEST SERVICES */}
            <SectionRow title="Request Services">
                <UniversalCard
                    variant="default"
                    icon="🏦"
                    mainText="Request Account"
                    onClick={() => navigate('/customer/request-account')}
                />
                <UniversalCard
                    variant="default"
                    icon="💳"
                    mainText="Request Card"
                    onClick={() => navigate('/customer/cards/request')}
                />
                <UniversalCard
                    variant="default"
                    icon="📋"
                    mainText="Cheque Book"
                    onClick={() => navigate('/customer/request-cheque')}
                />
                <UniversalCard
                    variant="default"
                    icon="💼"
                    mainText="Apply for Loan"
                    onClick={() => navigate('/customer/loans/apply')}
                />
            </SectionRow>
        </div>
    );
}