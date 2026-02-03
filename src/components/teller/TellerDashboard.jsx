import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import { getTellerSummary, validateAccount } from "../../services/teller-api-service";

import RequestApprovalTable from "./components/RequestApprovalTable";
import TellerCustomersPage from "./pages/TellerCustomersPage";
import TellerTransactionPage from "./pages/TellerTransactionPage";

import {
    getPendingAccounts, approveAccount, rejectAccount,
    getPendingCards, approveCard, rejectCard,
    getPendingCheques, approveCheque, rejectCheque
} from "../../services/teller-api-service";

export default function TellerDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="w-full pb-20">
            <header className="px-4 md:px-8 py-8 mb-6 border-b border-border/40">
                <h1 className="text-3xl font-bold tracking-tight">Teller Dashboard</h1>
                <p className="text-muted-foreground mt-1">Staff: {user?.username} (ID: {user?.userId})</p>
            </header>

            <Routes>
                <Route path="/" element={<TellerHome navigate={navigate} />} />
                <Route path="/transaction" element={<TellerTransactionPage />} />
                <Route path="/customers" element={<TellerCustomersPage />} />
                <Route path="/requests/accounts" element={
                    <div className="p-8">
                        <RequestApprovalTable title="Account Open Requests" fetchData={getPendingAccounts} onApprove={approveAccount} onReject={rejectAccount} />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
                <Route path="/requests/cards" element={
                    <div className="p-8">
                        <RequestApprovalTable title="Debit Card Requests" fetchData={getPendingCards} onApprove={approveCard} onReject={rejectCard} />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
                <Route path="/requests/cheques" element={
                    <div className="p-8">
                        <RequestApprovalTable title="Cheque Book Requests" fetchData={getPendingCheques} onApprove={approveCheque} onReject={rejectCheque} />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
            </Routes>
        </div>
    );
}

const BackButton = ({ navigate }) => (
    <button onClick={() => navigate('/teller')} className="mt-6 text-primary hover:underline">← Back to Dashboard</button>
);

function TellerHome({ navigate }) {
    const [summary, setSummary] = useState({ pendingAccountRequests: 0, pendingCardRequests: 0, pendingChequeBookRequests: 0 });
    const [validateId, setValidateId] = useState("");

    useEffect(() => {
        getTellerSummary().then(res => setSummary(res.data?.data || res.data)).catch(console.error);
    }, []);

    const handleValidate = async () => {
        if(!validateId) return;
        try {
            const res = await validateAccount(validateId);
            const isValid = res.data?.data;
            alert(isValid ? "✅ Account is ACTIVE and VALID" : "❌ Account is INVALID or INACTIVE");
        } catch(err) {
            alert("❌ Error: Account not found or ID invalid");
        }
    };

    return (
        <>
            <SectionRow title="Pending Requests">
                <UniversalCard variant="gradient" icon="🏦" mainText={summary.pendingAccountRequests} subText="Account Openings" onClick={() => navigate('/teller/requests/accounts')} />
                <UniversalCard variant="gradient" icon="💳" mainText={summary.pendingCardRequests} subText="Debit Cards" onClick={() => navigate('/teller/requests/cards')} />
                <UniversalCard variant="gradient" icon="📓" mainText={summary.pendingChequeBookRequests} subText="Cheque Books" onClick={() => navigate('/teller/requests/cheques')} />
            </SectionRow>

            <SectionRow title="Customer Services">
                <UniversalCard variant="gradient" icon="💸" mainText="Make Transaction" subText="Deposit / Withdraw / Transfer" onClick={() => navigate('/teller/transaction')} />
                <UniversalCard variant="default" icon="👥" mainText="Branch Customers" subText="View & Edit Details" onClick={() => navigate('/teller/customers')} />

                <div className="bg-card border border-border min-w-[280px] h-44 rounded-xl p-5 relative shadow-lg flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">QUICK TOOL</span>
                        <p className="text-lg font-semibold text-card-foreground mt-2">Validate Account</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Account Number / ID"
                            className="w-full bg-background border border-input rounded p-2 text-foreground text-sm"
                            value={validateId}
                            onChange={(e) => setValidateId(e.target.value)}
                        />
                        <button onClick={handleValidate} className="bg-primary px-3 rounded text-primary-foreground hover:bg-primary/90">✓</button>
                    </div>
                </div>
            </SectionRow>
        </>
    );
}