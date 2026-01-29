import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore"; // 👈 Import Store
import { getCustomerDashboardData } from "../../services/api.js";
import SectionRow from "./SectionRow.jsx";
import UniversalCard from "./UniversalCard.jsx";

export default function CustomerDashboard() {
    const navigate = useNavigate();

    // 1. GET USER FROM ZUSTAND (No more localStorage parsing here)
    const user = useAuthStore((state) => state.user);

    const [data, setData] = useState({ accounts: [], cards: [], loans: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                // We don't need to check "if (user)" because RequireAuth already did it.
                const dashboardData = await getCustomerDashboardData();
                setData(dashboardData);
            } catch (error) {
                console.error("Dashboard Error", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    if (loading) return <div className="min-h-screen bg-[#121212] flex items-center justify-center text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">

            {/* HERO HEADER - Uses Zustand Data directly */}
            <header className="px-8 py-10 bg-gradient-to-b from-blue-900/20 to-transparent">
                <h1 className="text-3xl font-bold">Hello, {user?.username} 👋</h1>
                <p className="text-gray-400 mt-1">Here is your financial overview</p>
            </header>

            {/* --- SECTION 1: ACCOUNTS --- */}
            <SectionRow title="My Accounts">
                <UniversalCard
                    variant="outline"
                    icon="+"
                    mainText="Open Account"
                    onClick={() => navigate('/customer/open-account')}
                />

                {data.accounts.length > 0 ? (
                    data.accounts.map(acc => (
                        <UniversalCard
                            key={acc.id}
                            variant="gradient"
                            title={acc.accountType}
                            badge={acc.accountStatus}
                            mainText={`₹ ${(acc.balance || 0).toLocaleString()}`}
                            subText={acc.accountNumber}
                            footerLeft="View History →"
                            onClick={() => navigate(`/customer/account/${acc.id}`)}
                        />
                    ))
                ) : (
                    <UniversalCard variant="default" mainText="No Accounts Found" subText="Open one to get started" />
                )}
            </SectionRow>

            {/* --- SECTION 2: CARDS --- */}
            <SectionRow title="My Cards">
                <UniversalCard
                    variant="outline"
                    icon="💳"
                    mainText="Request Card"
                    onClick={() => navigate('/customer/cards/request')}
                />

                {data.cards.map(card => (
                    <UniversalCard
                        key={card.id}
                        variant="default"
                        title="DEBIT CARD"
                        badge={card.active ? "ACTIVE" : "BLOCKED"}
                        mainText={card.cardNumber}
                        subText={user?.username}
                        footerRight={card.expiryDate}
                        onClick={() => navigate(`/customer/cards`)}
                    />
                ))}
            </SectionRow>

            {/* --- SECTION 3: SERVICES --- */}
            <SectionRow title="Services">
                <UniversalCard
                    variant="default"
                    icon="💸" mainText="Transfer Money"
                    onClick={() => navigate('/customer/transfer')}
                />
                <UniversalCard
                    variant="default"
                    icon="💰" mainText="Loan Offers"
                    subText="Check eligibility"
                    onClick={() => navigate('/customer/loans')}
                />
            </SectionRow>
        </div>
    );
}