import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { getAllLoanOffers, addLoanOffer, deactivateLoanOffer } from "../../../services/head-bank-api-service";
import Modal from "../../Modal";

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
        <div className="p-8 text-white min-h-screen">
            <button onClick={() => navigate('/headbank')} className="text-blue-400 mb-6">← Back</button>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Loan Offers</h2>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 px-6 py-2 rounded font-bold">+ Create Offer</button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {offers.map(offer => (
                    <div key={offer.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                        <h3 className="font-bold text-xl text-yellow-400">{offer.offerName}</h3>
                        <p className="text-sm text-gray-400">{offer.loanType}</p>
                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                            <div>Interest: <span className="font-bold text-white">{offer.interestRate}%</span></div>
                            <div>Tenure: {offer.minTenureMonths}-{offer.maxTenureMonths} m</div>
                            <div>Min: ₹{offer.minAmount}</div>
                            <div>Max: ₹{offer.maxAmount}</div>
                        </div>
                        {offer.isActive && (
                            <button onClick={() => onDelete(offer.id)} className="mt-4 w-full bg-red-600/20 text-red-400 py-2 rounded">
                                Deactivate Offer
                            </button>
                        )}
                    </div>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Loan Offer">
                <form onSubmit={handleSubmit(onAdd)} className="space-y-3 text-gray-800 text-sm">
                    <input {...register("name")} placeholder="Offer Name" className="w-full p-2 rounded" required />
                    <select {...register("loanType")} className="w-full p-2 rounded">
                        <option value="PERSONAL">PERSONAL</option>
                        <option value="HOME">HOME</option>
                        <option value="CAR">CAR</option>
                        <option value="EDUCATION">EDUCATION</option>
                    </select>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" step="0.01" {...register("interestRate")} placeholder="Interest %" className="p-2 rounded" required />
                        <input type="number" {...register("processingFee")} placeholder="Fee" className="p-2 rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" {...register("minAmount")} placeholder="Min Amount" className="p-2 rounded" required />
                        <input type="number" {...register("maxAmount")} placeholder="Max Amount" className="p-2 rounded" required />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" {...register("minTenure")} placeholder="Min Tenure (m)" className="p-2 rounded" required />
                        <input type="number" {...register("maxTenure")} placeholder="Max Tenure (m)" className="p-2 rounded" required />
                    </div>
                    <input type="number" {...register("headBankId")} placeholder="Head Bank ID" className="w-full p-2 rounded" required />
                    <button className="w-full bg-blue-600 text-white py-2 rounded font-bold mt-4">Save Offer</button>
                </form>
            </Modal>
        </div>
    );
}
