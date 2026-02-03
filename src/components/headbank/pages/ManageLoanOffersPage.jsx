import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllLoanOffers, addLoanOffer, deactivateLoanOffer } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Banknote } from "lucide-react";

export default function ManageLoanOffersPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, reset } = useForm();
    const [offers, setOffers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadOffers = () => {
        getAllLoanOffers().then(res => setOffers(res.data?.data || [])).catch(console.error);
    };

    useEffect(() => { loadOffers(); }, []);

    const onAdd = async (data) => {
        try {
            await addLoanOffer(data);
            alert("Offer Created!");
            setIsModalOpen(false);
            reset();
            loadOffers();
        } catch (err) {
            alert("Failed: " + (err.response?.data?.message || err.message));
        }
    };

    const onDelete = async (id) => {
        if(!confirm("Deactivate Offer?")) return;
        try {
            await deactivateLoanOffer(id);
            loadOffers();
        } catch(err) { alert("Failed"); }
    }

    return (
        <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-3xl border border-emerald-300 dark:border-emerald-700 shadow-none p-6 md:p-10 min-h-[85vh]">

            <div className="flex justify-between items-center mb-8">
                <Button variant="ghost" onClick={() => navigate('/headbank')} className="text-emerald-800 dark:text-emerald-200 hover:bg-emerald-300 dark:hover:bg-emerald-700">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-50">Loan Offers</h2>
                <Button onClick={() => setIsModalOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                    + Create Offer
                </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {offers.map(offer => (
                    <Card key={offer.id} className="bg-white dark:bg-emerald-900 border-emerald-100 dark:border-emerald-700 shadow-sm relative overflow-hidden">
                        {/* Decorative side bar */}
                        <div className="absolute left-0 top-0 bottom-0 w-2 bg-emerald-500" />

                        <CardContent className="p-6 pl-8">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-xl text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
                                        <Banknote className="h-5 w-5 text-emerald-500" />
                                        {offer.offerName}
                                    </h3>
                                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mt-1 uppercase tracking-wide">{offer.loanType}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">{offer.interestRate}%</span>
                                    <p className="text-[10px] text-emerald-500">INTEREST</p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4 text-sm text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-4 rounded-lg">
                                <div>
                                    <p className="text-xs text-emerald-500">Tenure</p>
                                    <p className="font-bold">{offer.minTenureMonths} - {offer.maxTenureMonths} Mo</p>
                                </div>
                                <div>
                                    <p className="text-xs text-emerald-500">Range</p>
                                    <p className="font-bold">₹{offer.minAmount} - ₹{offer.maxAmount}</p>
                                </div>
                            </div>

                            {offer.isActive && (
                                <Button onClick={() => onDelete(offer.id)} variant="ghost" className="mt-4 w-full text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30">
                                    Deactivate Offer
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Loan Offer">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-4">
                    <Input {...register("name")} placeholder="Offer Name" className="bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-700" required />
                    <select {...register("loanType")} className="w-full p-2 rounded bg-emerald-50 dark:bg-emerald-900 border border-emerald-200 dark:border-emerald-700 text-sm">
                        <option value="PERSONAL">PERSONAL</option>
                        <option value="HOME">HOME</option>
                        <option value="CAR">CAR</option>
                        <option value="EDUCATION">EDUCATION</option>
                    </select>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" step="0.01" {...register("interestRate")} placeholder="Interest %" className="bg-emerald-50 dark:bg-emerald-900" required />
                        <Input type="number" {...register("processingFee")} placeholder="Fee" className="bg-emerald-50 dark:bg-emerald-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" {...register("minAmount")} placeholder="Min Amount" className="bg-emerald-50 dark:bg-emerald-900" required />
                        <Input type="number" {...register("maxAmount")} placeholder="Max Amount" className="bg-emerald-50 dark:bg-emerald-900" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input type="number" {...register("minTenure")} placeholder="Min Tenure (m)" className="bg-emerald-50 dark:bg-emerald-900" required />
                        <Input type="number" {...register("maxTenure")} placeholder="Max Tenure (m)" className="bg-emerald-50 dark:bg-emerald-900" required />
                    </div>
                    <Input type="number" {...register("headBankId")} placeholder="Head Bank ID" className="bg-emerald-50 dark:bg-emerald-900" required />
                    <Button type="submit" className="w-full bg-emerald-600 text-white font-bold">Save Offer</Button>
                </form>
            </Modal>
        </div>
    );
}