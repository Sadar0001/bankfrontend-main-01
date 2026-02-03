import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllCardRules, addCardRule, deactivateCardRule } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ArrowLeft, CreditCard } from "lucide-react";

export default function ManageCardRulesPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [rules, setRules] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadRules = () => {
        getAllCardRules().then(res => setRules(res.data?.data || [])).catch(console.error);
    };

    useEffect(() => { loadRules(); }, []);

    const onAdd = async (data) => {
        try {
            await addCardRule(data);
            alert("Rule Created!");
            setIsModalOpen(false);
            reset();
            loadRules();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const onDelete = async (id) => {
        if (!confirm("Deactivate this rule?")) return;
        try {
            await deactivateCardRule(id);
            loadRules();
        } catch (err) { alert("Failed to deactivate"); }
    };

    return (
        // SOLID WORKSPACE
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">

            <div className="flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={() => navigate('/headbank')} className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Debit Card Rules</h2>
                <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    + Create Rule
                </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rules.map(rule => (
                    // SOLID CARD
                    <Card key={rule.id} className="bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-700 shadow-sm overflow-hidden">
                        <div className="bg-emerald-50 dark:bg-emerald-950 p-4 border-b border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                            <h3 className="font-bold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                <CreditCard className="h-4 w-4" /> {rule.cardType}
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${rule.isActive ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'}`}>
                                {rule.isActive ? "ACTIVE" : "INACTIVE"}
                            </span>
                        </div>

                        <CardContent className="p-5 space-y-3 text-sm text-emerald-800 dark:text-emerald-200">
                            <div className="flex justify-between">
                                <span>Annual Fee:</span>
                                <span className="font-bold">₹ {rule.annualFee}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Withdraw Limit:</span>
                                <span className="font-mono">₹ {rule.dailyWithdrawalLimit}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Txn Limit:</span>
                                <span className="font-mono">₹ {rule.dailyTransactionLimit}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-emerald-100 dark:border-emerald-800">
                                <span>International:</span>
                                <span className={rule.internationalUsage ? "text-emerald-600 font-bold" : "text-slate-400"}>
                                    {rule.internationalUsage ? "Allowed" : "No"}
                                </span>
                            </div>
                        </CardContent>

                        {rule.isActive && (
                            <CardFooter className="bg-emerald-50/50 dark:bg-emerald-950/30 p-3">
                                <Button onClick={() => onDelete(rule.id)} variant="ghost" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 text-xs">
                                    Deactivate Rule
                                </Button>
                            </CardFooter>
                        )}
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Define New Card Rule">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
                    <div>
                        <Label>Card Type Name</Label>
                        <Input {...register("cardType")} placeholder="e.g. PLATINUM" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Annual Fee (₹)</Label>
                            <Input type="number" {...register("annualFee")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        </div>
                        <div>
                            <Label>Issuance Fee (₹)</Label>
                            <Input type="number" {...register("issuanceFee")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Withdraw Limit</Label>
                            <Input type="number" {...register("dailyWithdrawalLimit")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        </div>
                        <div>
                            <Label>Purchase Limit</Label>
                            <Input type="number" {...register("dailyPurchaseLimit")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                        </div>
                    </div>
                    <div>
                        <Label>Head Bank ID</Label>
                        <Input type="number" {...register("headBankId")} className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    </div>
                    <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold">Save Rule</Button>
                </form>
            </Modal>
        </div>
    );
}