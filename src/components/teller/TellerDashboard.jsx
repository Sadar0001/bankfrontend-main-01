import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/authStore";
import SectionRow from "../customer/SectionRow";
import UniversalCard from "../customer/UniversalCard";
import { Badge } from "@/components/ui/badge";
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
        <Routes>
            <Route path="/" element={<TellerHome navigate={navigate} user={user} />} />
            <Route path="/transaction" element={<TellerTransactionPage />} />
            <Route path="/customers" element={<TellerCustomersPage />} />
            <Route path="/requests/accounts" element={
                <div className="bg-emerald-200 dark:bg-emerald-800 p-8 rounded-3xl min-h-[85vh]">
                    <RequestApprovalTable title="Account Open Requests" fetchData={getPendingAccounts} onApprove={approveAccount} onReject={rejectAccount} />
                    <BackButton navigate={navigate}/>
                </div>
            } />
            <Route path="/requests/cards" element={
                <div className="bg-emerald-200 dark:bg-emerald-800 p-8 rounded-3xl min-h-[85vh]">
                    <RequestApprovalTable title="Debit Card Requests" fetchData={getPendingCards} onApprove={approveCard} onReject={rejectCard} />
                    <BackButton navigate={navigate}/>
                </div>
            } />
            <Route path="/requests/cheques" element={
                <div className="bg-emerald-200 dark:bg-emerald-800 p-8 rounded-3xl min-h-[85vh]">
                    <RequestApprovalTable title="Cheque Book Requests" fetchData={getPendingCheques} onApprove={approveCheque} onReject={rejectCheque} />
                    <BackButton navigate={navigate}/>
                </div>
            } />
        </Routes>
    );
}

const BackButton = ({ navigate }) => (
    <button onClick={() => navigate('/teller')} className="mt-6 text-emerald-800 dark:text-emerald-200 hover:underline font-bold">← Back to Dashboard</button>
);

function TellerHome({ navigate, user }) {
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
        // SOLID WORKSPACE BOX
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 pb-20 min-h-[85vh]">

            <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-300 dark:border-emerald-700 pb-6">
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-emerald-950 dark:text-emerald-50">
                        Teller Operations
                    </h1>
                    <p className="text-emerald-700 dark:text-emerald-300 mt-2 font-medium">
                        Welcome, <span className="font-bold text-emerald-900 dark:text-emerald-100">{user?.username}</span>
                    </p>
                </div>
                <div className="text-right">
                    <Badge variant="outline" className="text-sm py-1 px-3 border-emerald-400 dark:border-emerald-600 bg-emerald-50 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        Staff ID: {user?.userId}
                    </Badge>
                </div>
            </header>

            <div className="space-y-12">
                <SectionRow title="Approvals Queue">
                    <UniversalCard variant="gradient" icon="🏦" mainText={summary.pendingAccountRequests} subText="New Accounts" onClick={() => navigate('/teller/requests/accounts')} />
                    <UniversalCard variant="gradient" icon="💳" mainText={summary.pendingCardRequests} subText="Debit Cards" onClick={() => navigate('/teller/requests/cards')} />
                    <UniversalCard variant="gradient" icon="📓" mainText={summary.pendingChequeBookRequests} subText="Cheque Books" onClick={() => navigate('/teller/requests/cheques')} />
                </SectionRow>

                <SectionRow title="Customer Services">
                    <UniversalCard variant="gradient" icon="💸" mainText="Transaction" subText="Deposit/Withdraw" onClick={() => navigate('/teller/transaction')} />
                    <UniversalCard variant="default" icon="👥" mainText="Customers" subText="Branch List" onClick={() => navigate('/teller/customers')} />

                    {/* SOLID Quick Tool Card */}
                    <div className="bg-white dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 min-w-[280px] h-48 rounded-xl p-6 relative shadow-sm flex flex-col justify-between">
                        <div>
                            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Quick Tool</span>
                            <p className="text-lg font-bold text-emerald-900 dark:text-emerald-100 mt-2">Validate Account</p>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Account ID"
                                className="w-full bg-emerald-50 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-700 rounded px-3 text-emerald-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                value={validateId}
                                onChange={(e) => setValidateId(e.target.value)}
                            />
                            <button onClick={handleValidate} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 rounded font-bold transition-colors">
                                Check
                            </button>
                        </div>
                    </div>
                </SectionRow>
            </div>
        </div>
    );
}