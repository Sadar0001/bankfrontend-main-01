import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import { getTellerSummary, validateAccount } from "../../services/teller-api-service";

// Sub Components
import RequestApprovalTable from "./components/RequestApprovalTable";
import TellerCustomersPage from "./pages/TellerCustomersPage";
import TellerTransactionPage from "./pages/TellerTransactionPage"; // ✅ Imported

// Service Imports for Props
import {
    getPendingAccounts, approveAccount, rejectAccount,
    getPendingCards, approveCard, rejectCard,
    getPendingCheques, approveCheque, rejectCheque
} from "../../services/teller-api-service";

export default function TellerDashboard() {
    const navigate = useNavigate();
    const user = useAuthStore((state) => state.user);

    return (
        <div className="min-h-screen bg-[#121212] text-white pb-20">
            <header className="px-8 py-10 bg-gradient-to-b from-blue-900/20 to-transparent border-b border-gray-800 mb-6">
                <h1 className="text-3xl font-bold">Teller Dashboard</h1>
                <p className="text-gray-400 mt-1">Staff: {user?.username} (ID: {user?.userId})</p>
            </header>

            <Routes>
                <Route path="/" element={<TellerHome navigate={navigate} />} />

                {/* ✅ Transaction Route */}
                <Route path="/transaction" element={<TellerTransactionPage />} />

                {/* ✅ Customer Management Route */}
                <Route path="/customers" element={<TellerCustomersPage />} />

                {/* ✅ Request Approval Routes */}
                <Route path="/requests/accounts" element={
                    <div className="p-8">
                        <RequestApprovalTable
                            title="Account Open Requests"
                            fetchData={getPendingAccounts}
                            onApprove={approveAccount}
                            onReject={rejectAccount}
                        />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
                <Route path="/requests/cards" element={
                    <div className="p-8">
                        <RequestApprovalTable
                            title="Debit Card Requests"
                            fetchData={getPendingCards}
                            onApprove={approveCard}
                            onReject={rejectCard}
                        />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
                <Route path="/requests/cheques" element={
                    <div className="p-8">
                        <RequestApprovalTable
                            title="Cheque Book Requests"
                            fetchData={getPendingCheques}
                            onApprove={approveCheque}
                            onReject={rejectCheque}
                        />
                        <BackButton navigate={navigate}/>
                    </div>
                } />
            </Routes>
        </div>
    );
}

// Helper Back Button
const BackButton = ({ navigate }) => (
    <button onClick={() => navigate('/teller')} className="mt-6 text-blue-400 hover:underline">← Back to Dashboard</button>
);

// ================= HOME COMPONENT =================
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
            {/* SECTION 1: PENDING TASKS */}
            <SectionRow title="Pending Requests">
                <UniversalCard
                    variant="gradient" icon="🏦"
                    mainText={summary.pendingAccountRequests}
                    subText="Account Openings"
                    onClick={() => navigate('/teller/requests/accounts')}
                />
                <UniversalCard
                    variant="gradient" icon="💳"
                    mainText={summary.pendingCardRequests}
                    subText="Debit Cards"
                    onClick={() => navigate('/teller/requests/cards')}
                />
                <UniversalCard
                    variant="gradient" icon="📓"
                    mainText={summary.pendingChequeBookRequests}
                    subText="Cheque Books"
                    onClick={() => navigate('/teller/requests/cheques')}
                />
            </SectionRow>

            {/* SECTION 2: CUSTOMER SERVICES */}
            <SectionRow title="Customer Services">
                {/* ✅ New Transaction Card */}
                <UniversalCard
                    variant="gradient" icon="💸"
                    mainText="Make Transaction"
                    subText="Deposit / Withdraw / Transfer"
                    onClick={() => navigate('/teller/transaction')}
                />

                <UniversalCard
                    variant="default" icon="👥"
                    mainText="Branch Customers"
                    subText="View & Edit Details"
                    onClick={() => navigate('/teller/customers')}
                />

                {/* VALIDATION TOOL CARD */}
                <div className="bg-gray-800 border border-gray-700 min-w-[280px] h-44 rounded-xl p-5 relative shadow-lg flex flex-col justify-between">
                    <div>
                        <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">QUICK TOOL</span>
                        <p className="text-lg font-semibold text-white mt-2">Validate Account</p>
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="text" // ✅ Fixed: Changed from 'number' to 'text' to accept any ID format
                            placeholder="Account Number / ID"
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white text-sm"
                            value={validateId}
                            onChange={(e) => setValidateId(e.target.value)}
                        />
                        <button onClick={handleValidate} className="bg-blue-600 px-3 rounded text-white hover:bg-blue-700">✓</button>
                    </div>
                </div>
            </SectionRow>
        </>
    );
}