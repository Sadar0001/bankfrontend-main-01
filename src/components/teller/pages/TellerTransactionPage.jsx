import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { performTellerTransaction } from "../../../services/teller-api-service";
import useAuthStore from "../../../store/authStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export default function TellerTransactionPage() {
    const navigate = useNavigate();
    const user = useAuthStore(state => state.user);
    const { register, handleSubmit, watch, reset } = useForm({
        defaultValues: {
            transactionType: "DEPOSIT",
            bankType: "BANK_BRANCH",
            accountHolderType: "CUSTOMER",
            description: "Teller Transaction",
            bankId: 1
        }
    });

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    const txnType = watch("transactionType");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setStatus({ type: '', msg: '' });

        const payload = { ...data };
        if (txnType === 'DEPOSIT') delete payload.senderAccountNumber;
        if (txnType === 'WITHDRAWAL') delete payload.receiverAccountNumber;

        try {
            await performTellerTransaction(payload);
            setStatus({ type: 'success', msg: `Transaction Successful!` });
            reset({ ...data, amount: "", senderAccountNumber: "", receiverAccountNumber: "" });
        } catch (err) {
            console.error(err);
            setStatus({ type: 'error', msg: err.response?.data?.message || "Transaction Failed" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center p-8 min-h-[85vh]">
            <div className="w-full max-w-2xl">
                <Button variant="ghost" onClick={() => navigate('/teller')} className="mb-6 text-emerald-200 hover:text-white hover:bg-emerald-800 font-bold self-start">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>

                <div className="bg-white dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 rounded-3xl p-8 shadow-sm">
                    <h2 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-emerald-950 dark:text-emerald-50">
                        <span className="text-emerald-500">💸</span> Perform Transaction
                    </h2>

                    {status.msg && (
                        <div className={`p-4 rounded-lg mb-6 flex items-center gap-2 font-bold border ${
                            status.type === 'success'
                                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-800 dark:text-emerald-100 dark:border-emerald-600'
                                : 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'
                        }`}>
                            {status.type === 'success' ? <CheckCircle2 className="h-5 w-5"/> : <AlertCircle className="h-5 w-5"/>}
                            {status.msg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                        {/* Transaction Type Radio */}
                        <div className="grid grid-cols-3 gap-4">
                            {['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'].map(type => (
                                <label key={type} className={`
                                    cursor-pointer text-center py-4 rounded-xl border-2 transition-all font-bold text-sm tracking-wide
                                    ${txnType === type
                                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md transform scale-105'
                                    : 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-800'}
                                `}>
                                    <input type="radio" value={type} {...register("transactionType")} className="hidden" />
                                    {type}
                                </label>
                            ))}
                        </div>

                        {/* Solid Form Box */}
                        <div className="space-y-5 bg-emerald-50 dark:bg-emerald-950 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
                            {txnType !== 'DEPOSIT' && (
                                <div>
                                    <Label className="text-emerald-900 dark:text-emerald-100">From Account (Sender)</Label>
                                    <Input
                                        {...register("senderAccountNumber", { required: txnType !== 'DEPOSIT' })}
                                        placeholder="e.g. ACC-1001"
                                        className="mt-1 bg-white dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-lg font-mono font-bold"
                                    />
                                </div>
                            )}

                            {txnType !== 'WITHDRAWAL' && (
                                <div>
                                    <Label className="text-emerald-900 dark:text-emerald-100">To Account (Receiver)</Label>
                                    <Input
                                        {...register("receiverAccountNumber", { required: txnType !== 'WITHDRAWAL' })}
                                        placeholder="e.g. ACC-2002"
                                        className="mt-1 bg-white dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-lg font-mono font-bold"
                                    />
                                </div>
                            )}

                            <div>
                                <Label className="text-emerald-900 dark:text-emerald-100">Amount (₹)</Label>
                                <Input
                                    type="number"
                                    step="0.01"
                                    {...register("amount", { required: true, min: 1 })}
                                    placeholder="0.00"
                                    className="mt-1 bg-white dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400"
                                />
                            </div>

                            <div>
                                <Label className="text-emerald-900 dark:text-emerald-100">Description</Label>
                                <Input
                                    {...register("description")}
                                    placeholder="e.g. Cash Deposit by Self"
                                    className="mt-1 bg-white dark:bg-emerald-900 border-emerald-300 dark:border-emerald-700"
                                />
                            </div>
                        </div>

                        <input type="hidden" {...register("bankType")} />
                        <input type="hidden" {...register("bankId")} />
                        <input type="hidden" {...register("accountHolderType")} />

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg py-6 rounded-xl shadow-md"
                        >
                            {isLoading ? "Processing..." : `CONFIRM ${txnType}`}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}