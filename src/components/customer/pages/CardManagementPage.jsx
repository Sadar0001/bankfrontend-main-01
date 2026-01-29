import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { blockCard, unblockCard } from '../../../services/customer-api-service';
import Modal from '../../Modal.jsx';

export default function CardManagementPage({ cards, refresh }) {
    const navigate = useNavigate();
    const [selectedCard, setSelectedCard] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const openCardModal = (card) => {
        setSelectedCard(card);
        setShowModal(true);
        setPin('');
        setError(null);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedCard(null);
        setPin('');
        setError(null);
    };

    const handleBlockCard = async () => {
        if (!confirm('Are you sure you want to block this card?')) return;

        try {
            setLoading(true);
            setError(null);
            await blockCard(selectedCard.id);
            alert('Card blocked successfully!');
            if (refresh) refresh();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to block card');
        } finally {
            setLoading(false);
        }
    };

    const handleUnblockCard = async () => {
        if (!pin) {
            setError('Please enter your transaction PIN');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            await unblockCard(selectedCard.id, pin);
            alert('Card unblocked successfully!');
            if (refresh) refresh();
            closeModal();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to unblock card');
        } finally {
            setLoading(false);
        }
    };

    const formatExpiryDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = String(date.getFullYear()).slice(-2);
        return `${month}/${year}`;
    };

    return (
        <div className="min-h-screen bg-[#121212] p-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate('/customer')}
                    className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2"
                >
                    ← Back to Dashboard
                </button>

                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-bold text-white">My Debit Cards</h2>
                    <button
                        onClick={() => navigate('/customer/cards/request')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition"
                    >
                        + Request New Card
                    </button>
                </div>

                {cards && cards.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cards.map(card => {
                            // Determine card status for display
                            const isCardActive = card.isActive && !card.isBlocked;
                            const cardStatus = card.isBlocked ? 'BLOCKED' : (card.isActive ? 'ACTIVE' : 'INACTIVE');

                            return (
                                <div
                                    key={card.id}
                                    onClick={() => openCardModal(card)}
                                    className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/50 rounded-xl p-6 cursor-pointer hover:scale-105 transition-transform shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <span className="text-xs text-gray-400 uppercase font-bold">Debit Card</span>
                                        <span className={`text-xs font-bold px-3 py-1 rounded border ${
                                            cardStatus === 'ACTIVE'
                                                ? 'bg-green-900/30 text-green-400 border-green-800'
                                                : cardStatus === 'BLOCKED'
                                                    ? 'bg-red-900/30 text-red-400 border-red-800'
                                                    : 'bg-gray-900/30 text-gray-400 border-gray-800'
                                        }`}>
                                            {cardStatus}
                                        </span>
                                    </div>

                                    <p className="text-2xl font-mono text-white tracking-widest mb-6">
                                        {card.cardNumber ?
                                            `${card.cardNumber.slice(0, 4)} •••• •••• ${card.cardNumber.slice(-4)}`
                                            : '•••• •••• •••• ••••'}
                                    </p>

                                    <div className="flex justify-between text-sm">
                                        <div>
                                            <p className="text-gray-400 text-xs">Card Holder</p>
                                            <p className="text-white font-semibold">CUSTOMER</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-gray-400 text-xs">Valid Thru</p>
                                            <p className="text-white font-semibold">{formatExpiryDate(card.expiryDate)}</p>
                                        </div>
                                    </div>

                                    {/* Chip visual */}
                                    <div className="absolute top-20 left-6 w-12 h-10 bg-yellow-600/30 rounded border border-yellow-600/50"></div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-12 text-center">
                        <div className="text-6xl mb-4">💳</div>
                        <p className="text-gray-400 text-lg mb-6">No cards found</p>
                        <button
                            onClick={() => navigate('/customer/cards/request')}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition"
                        >
                            Request Your First Card
                        </button>
                    </div>
                )}
            </div>

            {/* Card Details Modal */}
            <Modal
                isOpen={showModal}
                onClose={closeModal}
                title="Card Details & Management"
                size="md"
            >
                {selectedCard && (
                    <div className="space-y-6">
                        {/* Card Visual Preview */}
                        <div className="bg-gradient-to-br from-blue-900 to-slate-900 border border-blue-700/50 rounded-xl p-6">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-xs text-gray-400 uppercase font-bold">Debit Card</span>
                                <span className={`text-xs font-bold px-3 py-1 rounded border ${
                                    (selectedCard.isActive && !selectedCard.isBlocked)
                                        ? 'bg-green-900/30 text-green-400 border-green-800'
                                        : 'bg-red-900/30 text-red-400 border-red-800'
                                }`}>
                                    {selectedCard.isBlocked ? 'BLOCKED' : (selectedCard.isActive ? 'ACTIVE' : 'INACTIVE')}
                                </span>
                            </div>
                            <p className="text-xl font-mono text-white tracking-widest mb-4">
                                {selectedCard.cardNumber}
                            </p>
                            <div className="flex justify-between text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs">Valid Thru</p>
                                    <p className="text-white font-semibold">{formatExpiryDate(selectedCard.expiryDate)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">CVV</p>
                                    <p className="text-white font-mono">{selectedCard.cvv || '•••'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Card Information */}
                        <div className="bg-gray-800 rounded-lg p-6 space-y-3">
                            <div className="flex justify-between py-2 border-b border-gray-700">
                                <span className="text-gray-400">Card Number:</span>
                                <span className="text-white font-mono">{selectedCard.cardNumber}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-700">
                                <span className="text-gray-400">Status:</span>
                                <span className={`font-bold ${
                                    (selectedCard.isActive && !selectedCard.isBlocked) ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {selectedCard.isBlocked ? 'BLOCKED' : (selectedCard.isActive ? 'ACTIVE' : 'INACTIVE')}
                                </span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-700">
                                <span className="text-gray-400">Expiry Date:</span>
                                <span className="text-white">{formatExpiryDate(selectedCard.expiryDate)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-700">
                                <span className="text-gray-400">CVV:</span>
                                <span className="text-white font-mono">{selectedCard.cvv || '•••'}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-gray-700">
                                <span className="text-gray-400">Created:</span>
                                <span className="text-white">
                                    {selectedCard.createdAt ? new Date(selectedCard.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                </span>
                            </div>
                            {selectedCard.isBlocked && selectedCard.blockedAt && (
                                <div className="flex justify-between py-2">
                                    <span className="text-gray-400">Blocked At:</span>
                                    <span className="text-red-400">
                                        {new Date(selectedCard.blockedAt).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className="bg-red-900/30 border border-red-700 text-red-400 p-4 rounded-lg">
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="space-y-4">
                            {!selectedCard.isBlocked && selectedCard.isActive ? (
                                <button
                                    onClick={handleBlockCard}
                                    disabled={loading}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-bold transition"
                                >
                                    {loading ? 'Blocking...' : '🔒 Block Card'}
                                </button>
                            ) : selectedCard.isBlocked ? (
                                <>
                                    <div>
                                        <label className="block text-gray-300 text-sm mb-2">Enter Transaction PIN to Unblock</label>
                                        <input
                                            type="password"
                                            value={pin}
                                            onChange={(e) => setPin(e.target.value)}
                                            placeholder="Enter 4-digit PIN"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white"
                                            maxLength="4"
                                        />
                                    </div>
                                    <button
                                        onClick={handleUnblockCard}
                                        disabled={loading || !pin}
                                        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 text-white py-3 rounded-lg font-bold transition"
                                    >
                                        {loading ? 'Unblocking...' : '🔓 Unblock Card'}
                                    </button>
                                </>
                            ) : (
                                <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-400 p-4 rounded-lg text-center">
                                    This card is inactive. Please contact support.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}